const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { AppError } = require('../utils/appError');

function requireAuth(req, _res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError('No autorizado.', 401));
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    req.auth = jwt.verify(token, env.jwtSecret);
    return next();
  } catch (_error) {
    return next(new AppError('Sesión inválida o expirada.', 401));
  }
}

module.exports = { requireAuth };
