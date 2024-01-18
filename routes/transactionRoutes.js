const express = require('express');
const router = express.Router();

// Endpoint de Depósito
router.post('/deposit', async (req, res) => {
  try {
    const { accountNumber, amount } = req.body;

    console.log('Request Body (Deposit):', req.body);

    const client = await req.pool.query('SELECT * FROM Cliente WHERE numero_conta = $1', [accountNumber]);

    if (client.rows.length === 0) {
      return res.status(404).json({ message: 'Conta não encontrada' });
    }

    const currentBalance = client.rows[0].saldo;
    const newBalance = currentBalance + amount;

    console.log('Current Balance (Deposit):', currentBalance);

    const result = await req.pool.query(
      'UPDATE Cliente SET saldo = $1 WHERE numero_conta = $2 RETURNING *',
      [newBalance, accountNumber]
    );

    console.log('Result after Update (Deposit):', result.rows[0]);

    const transaction = await req.pool.query(
      'INSERT INTO Transacao (id_cliente, tipo_transacao, valor) VALUES ($1, $2, $3) RETURNING *',
      [result.rows[0].id, 'deposit', amount]
    );

    console.log('Transaction Result (Deposit):', transaction.rows[0]);

    res.status(200).json({
      accountNumber: result.rows[0].numero_conta,
      balance: result.rows[0].saldo,
      transactionId: transaction.rows[0].id,
    });
  } catch (error) {
    console.error('Erro ao processar depósito:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Endpoint de Retirada
router.post('/withdraw', async (req, res) => {
  try {
    const { accountNumber, amount } = req.body;

    console.log('Request Body (Withdraw):', req.body);

    const client = await req.pool.query('SELECT * FROM Cliente WHERE numero_conta = $1', [accountNumber]);

    if (client.rows.length === 0) {
      return res.status(404).json({ message: 'Conta não encontrada' });
    }

    const currentBalance = client.rows[0].saldo;

    console.log('Current Balance (Withdraw):', currentBalance);

    // Verificar se há saldo suficiente para a retirada
    if (currentBalance < amount) {
      return res.status(400).json({ message: 'Saldo insuficiente para retirada' });
    }

    const newBalance = currentBalance - amount;

    console.log('New Balance after Withdraw:', newBalance);

    const result = await req.pool.query(
      'UPDATE Cliente SET saldo = $1 WHERE numero_conta = $2 RETURNING *',
      [newBalance, accountNumber]
    );

    console.log('Result after Update (Withdraw):', result.rows[0]);

    const transaction = await req.pool.query(
      'INSERT INTO Transacao (id_cliente, tipo_transacao, valor) VALUES ($1, $2, $3) RETURNING *',
      [result.rows[0].id, 'withdraw', amount]
    );

    console.log('Transaction Result (Withdraw):', transaction.rows[0]);

    res.status(200).json({
      accountNumber: result.rows[0].numero_conta,
      balance: result.rows[0].saldo,
      transactionId: transaction.rows[0].id,
    });
  } catch (error) {
    console.error('Erro ao processar retirada:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
