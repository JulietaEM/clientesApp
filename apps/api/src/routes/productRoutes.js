const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { requireAuth } = require('../middleware/authMiddleware');
const { getProducts } = require('../services/productService');

const router = express.Router();

router.get(
  '/',
  requireAuth,
  asyncHandler(async (_req, res) => {
    res.json(await getProducts());
  }),
);

module.exports = { productRoutes: router };
