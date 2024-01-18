const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

// Configurações do Pool do PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sistema_bancario',
  password: 'Kesia1703',
  port: 5432,
});

// Middleware para adicionar o pool ao objeto de requisição
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/account', accountRoutes);
app.use('/transaction', transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
