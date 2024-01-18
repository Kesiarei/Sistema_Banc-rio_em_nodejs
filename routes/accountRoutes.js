const express = require('express');
const router = express.Router();

router.get('/:accountNumber', async (req, res) => {
  try {
    const client = await req.pool.query('SELECT * FROM Cliente WHERE numero_conta = $1', [req.params.accountNumber]);

    if (client.rows.length > 0) {
      res.status(200).json({
        accountNumber: client.rows[0].numero_conta,
        balance: client.rows[0].saldo,
        clientName: client.rows[0].nome,
        clientDocument: client.rows[0].documento_cliente,
      });
    } else {
      res.status(404).json({ message: 'Conta não encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.post('/create', async (req, res) => {
  try {
    const { nome, numero_conta, saldo, documento_cliente } = req.body;

    const newAccount = await req.pool.query(
      'INSERT INTO Cliente (nome, numero_conta, saldo, documento_cliente) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, numero_conta, saldo, documento_cliente]
    );

    res.status(201).json(newAccount.rows[0]);
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    res.status(500).json({ message: 'Erro interno ao criar conta' });
  }
});

module.exports = router;
