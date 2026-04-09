const { app } = require('./app');
const { env } = require('./config/env');
const { getPool } = require('./config/database');

async function startServer() {
  try {
    await getPool();

    app.listen(env.port, () => {
      console.log(`API escuchando en http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('No fue posible iniciar la API.', error);
    process.exit(1);
  }
}

startServer();
