const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(__dirname, '../../../../.env'),
});

const env = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'default-dev-secret',
  dbServer: process.env.DB_SERVER || 'DESKTOP-M19C4KS',
  dbName: process.env.DB_NAME || 'dbClientes',
  dbUser: process.env.DB_USER || 'clienteapp_user',
  dbPassword: process.env.DB_PASSWORD || '',
  dbPort: Number(process.env.DB_PORT || 1433),
  dbEncrypt: (process.env.DB_ENCRYPT || 'false').toLowerCase() === 'true',
  dbTrustServerCertificate: (process.env.DB_TRUST_SERVER_CERTIFICATE || 'true').toLowerCase() === 'true',
};

module.exports = { env };
