const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { loginClient, registerClient } = require('../services/authService');
const { AppError } = require('../utils/appError');

const router = express.Router();

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { nombre, apellido, usuario, correo, contrasena, confirmarContrasena } = req.body;

    if (!nombre || !apellido || !usuario || !correo || !contrasena || !confirmarContrasena) {
      throw new AppError('Todos los campos del registro son obligatorios.', 400);
    }

    if (contrasena !== confirmarContrasena) {
      throw new AppError('Las contraseñas no coinciden.', 400);
    }

    res.status(201).json(await registerClient({ nombre, apellido, usuario, correo, contrasena }));
  }),
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
      throw new AppError('Usuario y contraseña son obligatorios.', 400);
    }

    res.json(await loginClient({ usuario, contrasena }));
  }),
);

module.exports = { authRoutes: router };
