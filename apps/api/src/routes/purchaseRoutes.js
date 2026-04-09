const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../utils/appError');
const { requireAuth } = require('../middleware/authMiddleware');
const {
  addPurchaseItem,
  deletePurchaseItem,
  getPurchaseByClient,
  updatePurchaseItem,
} = require('../services/purchaseService');

const router = express.Router();

router.get(
  '/current/:clientId',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json(await getPurchaseByClient(Number(req.params.clientId)));
  }),
);

router.post(
  '/items',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { idCliente, idProducto, cantidad, descuento } = req.body;

    if (!idCliente || !idProducto || !cantidad) {
      throw new AppError('Cliente, producto y cantidad son obligatorios.', 400);
    }

    res.status(201).json(
      await addPurchaseItem({
        idCliente: Number(idCliente),
        idProducto: Number(idProducto),
        cantidad: Number(cantidad),
        descuento: Number(descuento || 0),
      }),
    );
  }),
);

router.put(
  '/items/:detailId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { idCliente, cantidad, descuento } = req.body;

    if (!idCliente || !cantidad) {
      throw new AppError('Cliente y cantidad son obligatorios.', 400);
    }

    res.json(
      await updatePurchaseItem(Number(req.params.detailId), {
        idCliente: Number(idCliente),
        cantidad: Number(cantidad),
        descuento: Number(descuento || 0),
      }),
    );
  }),
);

router.delete(
  '/items/:detailId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const clientId = Number(req.query.clientId);

    if (!clientId) {
      throw new AppError('El clientId es obligatorio.', 400);
    }

    res.json(await deletePurchaseItem(Number(req.params.detailId), clientId));
  }),
);

module.exports = { purchaseRoutes: router };
