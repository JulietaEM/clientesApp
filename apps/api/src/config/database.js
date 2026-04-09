const sql = require('mssql');
const { env } = require('./env');

let poolPromise;

function getPool() {
  if (!poolPromise) {
    // Autenticación SQL
    // Conectar la config de la base de datos
    poolPromise = new sql.ConnectionPool({
      server: env.dbServer,
      database: env.dbName,
      user: env.dbUser,
      password: env.dbPassword,
      port: env.dbPort,
      options: {
        encrypt: env.dbEncrypt,
        trustServerCertificate: env.dbTrustServerCertificate,
      },
    })
      .connect()
      .then((pool) => pool)
      .catch((error) => {
        poolPromise = undefined;
        throw error;
      });
  }

  return poolPromise;
}

async function withTransaction(handler) {
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  await transaction.begin();

  try {
    const result = await handler(transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

module.exports = {
  sql,
  getPool,
  withTransaction,
};
