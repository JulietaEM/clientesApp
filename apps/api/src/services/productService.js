const { getPool } = require('../config/database');

async function getProducts() {
  const pool = await getPool();

  //Devuelve los productos en orden alfabético
  const result = await pool.request().query(`
    SELECT
      idProducto,
      nombreProducto,
      descripcion,
      CAST(valorUnitario AS DECIMAL(10,2)) AS valorUnitario,
      stock
    FROM tblProducto
    ORDER BY nombreProducto ASC; 
  `);

  return result.recordset;
}

module.exports = { getProducts };
