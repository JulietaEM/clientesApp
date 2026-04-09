const { sql, withTransaction } = require('../config/database');
const { AppError } = require('../utils/appError');

async function getCurrentHeader(transaction, idCliente) {
  const request = new sql.Request(transaction);
  const result = await request.input('idCliente', sql.Int, idCliente).query(`
    SELECT TOP 1
      e.idEncabezado,
      e.idCliente,
      e.fecha,
      CAST(e.subTotal AS DECIMAL(10,2)) AS subTotal,
      CAST(e.total AS DECIMAL(10,2)) AS total,
      CAST(e.descuentoTotal AS DECIMAL(10,2)) AS descuentoTotal,
      CONCAT(c.nombreCliente, ' ', c.apellido) AS cliente
    FROM tblEncabezado e
    INNER JOIN tblCliente c ON c.idCliente = e.idCliente
    WHERE e.idCliente = @idCliente
    ORDER BY e.idEncabezado DESC;
  `);

  return result.recordset[0] || null;
}

async function ensureHeader(transaction, idCliente) {
  const existingHeader = await getCurrentHeader(transaction, idCliente);

  if (existingHeader) {
    return existingHeader;
  }

  const created = await new sql.Request(transaction)
    .input('idCliente', sql.Int, idCliente)
    .query(`
      INSERT INTO tblEncabezado (idCliente, subTotal, total, descuentoTotal)
      OUTPUT INSERTED.idEncabezado, INSERTED.idCliente, INSERTED.fecha,
        CAST(INSERTED.subTotal AS DECIMAL(10,2)) AS subTotal,
        CAST(INSERTED.total AS DECIMAL(10,2)) AS total,
        CAST(INSERTED.descuentoTotal AS DECIMAL(10,2)) AS descuentoTotal
      VALUES (@idCliente, 0, 0, 0);
    `);

  const header = created.recordset[0];
  const clientResult = await new sql.Request(transaction)
    .input('idCliente', sql.Int, idCliente)
    .query(`
      SELECT CONCAT(nombreCliente, ' ', apellido) AS cliente
      FROM tblCliente
      WHERE idCliente = @idCliente;
    `);

  return {
    ...header,
    cliente: clientResult.recordset[0]?.cliente || '',
  };
}

async function getProductById(transaction, idProducto) {
  const result = await new sql.Request(transaction)
    .input('idProducto', sql.Int, idProducto)
    .query(`
      SELECT
        idProducto,
        nombreProducto,
        CAST(valorUnitario AS DECIMAL(10,2)) AS valorUnitario,
        stock
      FROM tblProducto
      WHERE idProducto = @idProducto;
    `);

  return result.recordset[0];
}

async function updateProductStock(transaction, idProducto, delta) {
  if (delta === 0) {
    return;
  }

  // El stock se ajusta dentro de la misma transaccion de la compra para que
  // detalle e inventario nunca queden desincronizados si algo falla.
  const result = await new sql.Request(transaction)
    .input('idProducto', sql.Int, idProducto)
    .input('delta', sql.Int, delta)
    .query(`
      UPDATE tblProducto
      SET stock = stock + @delta
      OUTPUT INSERTED.stock
      WHERE idProducto = @idProducto AND stock + @delta >= 0;
    `);

  if (result.recordset.length === 0) {
    throw new AppError('No fue posible actualizar el stock del producto.', 400);
  }
}

async function getDetailById(transaction, detailId) {
  const result = await new sql.Request(transaction)
    .input('detailId', sql.Int, detailId)
    .query(`
      SELECT
        idDetalles,
        idEncabezado,
        idProducto,
        cantidad,
        CAST(valor AS DECIMAL(10,2)) AS valor,
        CAST(descuento AS DECIMAL(10,2)) AS descuento
      FROM tblDetalles
      WHERE idDetalles = @detailId;
    `);

  return result.recordset[0];
}

async function getDetailsByHeader(transaction, idEncabezado) {
  const result = await new sql.Request(transaction)
    .input('idEncabezado', sql.Int, idEncabezado)
    .query(`
      SELECT
        d.idDetalles,
        d.idProducto,
        p.nombreProducto,
        d.cantidad,
        CAST(d.valor AS DECIMAL(10,2)) AS valorUnitario,
        CAST(d.descuento AS DECIMAL(10,2)) AS descuento,
        CAST((d.cantidad * d.valor) - d.descuento AS DECIMAL(10,2)) AS subtotal
      FROM tblDetalles d
      INNER JOIN tblProducto p ON p.idProducto = d.idProducto
      WHERE d.idEncabezado = @idEncabezado
      ORDER BY d.idDetalles ASC;
    `);

  return result.recordset;
}

async function recalculateHeader(transaction, idEncabezado) {
  // Recalculamos siempre desde la base para que el encabezado no dependa
  // del estado del cliente ni de supuestos en la interfaz.
  const totalsResult = await new sql.Request(transaction)
    .input('idEncabezado', sql.Int, idEncabezado)
    .query(`
      SELECT
        CAST(COALESCE(SUM(d.cantidad * d.valor), 0) AS DECIMAL(10,2)) AS subTotal,
        CAST(COALESCE(SUM(d.descuento), 0) AS DECIMAL(10,2)) AS descuentoTotal
      FROM tblDetalles d
      WHERE d.idEncabezado = @idEncabezado;
    `);

  const totals = totalsResult.recordset[0];
  const total = Number(totals.subTotal) - Number(totals.descuentoTotal);

  await new sql.Request(transaction)
    .input('idEncabezado', sql.Int, idEncabezado)
    .input('subTotal', sql.Decimal(10, 2), totals.subTotal)
    .input('descuentoTotal', sql.Decimal(10, 2), totals.descuentoTotal)
    .input('total', sql.Decimal(10, 2), total < 0 ? 0 : total)
    .query(`
      UPDATE tblEncabezado
      SET
        subTotal = @subTotal,
        descuentoTotal = @descuentoTotal,
        total = @total
      WHERE idEncabezado = @idEncabezado;
    `);
}

async function getPurchaseByClientInTransaction(transaction, idCliente) {
  const header = await getCurrentHeader(transaction, idCliente);

  if (!header) {
    return {
      header: null,
      details: [],
    };
  }

  const details = await getDetailsByHeader(transaction, header.idEncabezado);

  return { header, details };
}

async function getPurchaseByClient(idCliente) {
  return withTransaction(async (transaction) => getPurchaseByClientInTransaction(transaction, idCliente));
}

async function addPurchaseItem(payload) {
  const { idCliente, idProducto, cantidad, descuento } = payload;

  return withTransaction(async (transaction) => {
    const product = await getProductById(transaction, idProducto);

    if (!product) {
      throw new AppError('El producto no existe.', 404);
    }

    const header = await ensureHeader(transaction, idCliente);

    const existingResult = await new sql.Request(transaction)
      .input('idEncabezado', sql.Int, header.idEncabezado)
      .input('idProducto', sql.Int, idProducto)
      .query(`
        SELECT TOP 1
          idDetalles,
          cantidad,
          CAST(descuento AS DECIMAL(10,2)) AS descuento
        FROM tblDetalles
        WHERE idEncabezado = @idEncabezado AND idProducto = @idProducto;
      `);

    const existing = existingResult.recordset[0];
    if (cantidad > product.stock) {
      throw new AppError(`Stock insuficiente. Disponible: ${product.stock}.`, 400);
    }

    if (existing) {
      await new sql.Request(transaction)
        .input('detailId', sql.Int, existing.idDetalles)
        .input('cantidad', sql.Int, existing.cantidad + cantidad)
        .input('descuento', sql.Decimal(10, 2), Number(existing.descuento) + descuento)
        .query(`
          UPDATE tblDetalles
          SET cantidad = @cantidad, descuento = @descuento
          WHERE idDetalles = @detailId;
        `);
    } else {
      await new sql.Request(transaction)
        .input('idEncabezado', sql.Int, header.idEncabezado)
        .input('idProducto', sql.Int, idProducto)
        .input('cantidad', sql.Int, cantidad)
        .input('valor', sql.Decimal(10, 2), product.valorUnitario)
        .input('descuento', sql.Decimal(10, 2), descuento)
        .query(`
          INSERT INTO tblDetalles (idEncabezado, idProducto, cantidad, valor, descuento)
          VALUES (@idEncabezado, @idProducto, @cantidad, @valor, @descuento);
        `);
    }

    await updateProductStock(transaction, idProducto, -cantidad);
    await recalculateHeader(transaction, header.idEncabezado);
    return getPurchaseByClientInTransaction(transaction, idCliente);
  });
}

async function updatePurchaseItem(detailId, payload) {
  const { idCliente, cantidad, descuento } = payload;

  return withTransaction(async (transaction) => {
    const detail = await getDetailById(transaction, detailId);

    if (!detail) {
      throw new AppError('El detalle no existe.', 404);
    }

    const product = await getProductById(transaction, detail.idProducto);
    const quantityDifference = cantidad - detail.cantidad;

    if (quantityDifference > 0 && quantityDifference > product.stock) {
      throw new AppError(`Stock insuficiente. Disponible: ${product.stock}.`, 400);
    }

    await new sql.Request(transaction)
      .input('detailId', sql.Int, detailId)
      .input('cantidad', sql.Int, cantidad)
      .input('descuento', sql.Decimal(10, 2), descuento)
      .query(`
        UPDATE tblDetalles
        SET cantidad = @cantidad, descuento = @descuento
        WHERE idDetalles = @detailId;
      `);

    await updateProductStock(transaction, detail.idProducto, -quantityDifference);
    await recalculateHeader(transaction, detail.idEncabezado);
    return getPurchaseByClientInTransaction(transaction, idCliente);
  });
}

async function deletePurchaseItem(detailId, idCliente) {
  return withTransaction(async (transaction) => {
    const detail = await getDetailById(transaction, detailId);

    if (!detail) {
      throw new AppError('El detalle no existe.', 404);
    }

    await new sql.Request(transaction)
      .input('detailId', sql.Int, detailId)
      .query(`
        DELETE FROM tblDetalles
        WHERE idDetalles = @detailId;
      `);

    await updateProductStock(transaction, detail.idProducto, detail.cantidad);
    await recalculateHeader(transaction, detail.idEncabezado);
    return getPurchaseByClientInTransaction(transaction, idCliente);
  });
}

module.exports = {
  addPurchaseItem,
  deletePurchaseItem,
  getPurchaseByClient,
  updatePurchaseItem,
};
