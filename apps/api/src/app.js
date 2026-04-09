const express = require('express');
const cors = require('cors');
const { authRoutes } = require('./routes/authRoutes');
const { productRoutes } = require('./routes/productRoutes');
const { purchaseRoutes } = require('./routes/purchaseRoutes');
const { errorMiddleware } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/purchase', purchaseRoutes);
app.use(errorMiddleware);

module.exports = { app };
