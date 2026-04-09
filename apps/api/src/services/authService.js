const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { sql, getPool, withTransaction } = require('../config/database');
const { AppError } = require('../utils/appError');

function createToken(session) {
  return jwt.sign(session, env.jwtSecret, { expiresIn: '12h' });
}

function normalizeSession(record) {
  return {
    idCliente: record.idCliente,
    idUsuario: record.idUsuario,
    usuario: record.usuario,
    nombreCliente: record.nombreCliente,
    apellido: record.apellido,
    correo: record.correo,
  };
}

async function registerClient(payload) {
  const { nombre, apellido, usuario, correo, contrasena } = payload;
  const pool = await getPool();

  const existing = await pool
    .request()
    .input('usuario', sql.VarChar(50), usuario)
    .input('correo', sql.VarChar(320), correo)
    .query(`
      SELECT TOP 1 usuario, correo
      FROM tblUsuarios u
      FULL OUTER JOIN tblCliente c ON c.idCliente = u.idCliente
      WHERE u.usuario = @usuario OR c.correo = @correo;
    `);

  if (existing.recordset.length > 0) {
    throw new AppError('El usuario o correo ya se encuentran registrados.', 409);
  }

  const hashedPassword = await bcrypt.hash(contrasena, 10);

  return withTransaction(async (transaction) => {
    const request = new sql.Request(transaction);

    const clientResult = await request
      .input('nombre', sql.VarChar(50), nombre)
      .input('apellido', sql.VarChar(50), apellido)
      .input('correo', sql.VarChar(320), correo)
      .query(`
        INSERT INTO tblCliente (nombreCliente, apellido, correo)
        OUTPUT INSERTED.idCliente, INSERTED.nombreCliente, INSERTED.apellido, INSERTED.correo
        VALUES (@nombre, @apellido, @correo);
      `);

    const client = clientResult.recordset[0];

    const userResult = await new sql.Request(transaction)
      .input('usuario', sql.VarChar(50), usuario)
      .input('contrasena', sql.VarChar(255), hashedPassword)
      .input('idCliente', sql.Int, client.idCliente)
      .query(`
        INSERT INTO tblUsuarios (usuario, contrasena, idCliente)
        OUTPUT INSERTED.idUsuario, INSERTED.usuario
        VALUES (@usuario, @contrasena, @idCliente);
      `);

    const user = userResult.recordset[0];
    const session = normalizeSession({ ...client, ...user });

    return {
      token: createToken(session),
      session,
    };
  });
}

async function loginClient(payload) {
  const { usuario, contrasena } = payload;
  const pool = await getPool();

  const result = await pool
    .request()
    .input('usuario', sql.VarChar(50), usuario)
    .query(`
      SELECT TOP 1
        u.idUsuario,
        u.usuario,
        u.contrasena,
        c.idCliente,
        c.nombreCliente,
        c.apellido,
        c.correo
      FROM tblUsuarios u
      INNER JOIN tblCliente c ON c.idCliente = u.idCliente
      WHERE u.usuario = @usuario;
    `);

  const user = result.recordset[0];

  if (!user) {
    throw new AppError('Credenciales inválidas.', 401);
  }

  const isValid = await bcrypt.compare(contrasena, user.contrasena);

  if (!isValid) {
    throw new AppError('Credenciales inválidas.', 401);
  }

  const session = normalizeSession(user);

  return {
    token: createToken(session),
    session,
  };
}

module.exports = {
  loginClient,
  registerClient,
};
