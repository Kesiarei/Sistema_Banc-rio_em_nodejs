const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


router.post('/login', (req, res) => {
  const { username, password } = req.body;

  
  if (username && password) {
    console.log('Login success');

    // Gere um token de forma segura
    const token = jwt.sign({ username }, 'secreto', { expiresIn: '1h' });

    res.status(200).json({ token });
  } else {
    console.log('Login failed. Credenciais fornecidas:', username, password);
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

router.post('/validateToken', (req, res) => {
  const token = req.headers['authorization'];

  // Verifique o token recebido
  jwt.verify(token, 'secreto', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    res.status(200).json({ message: 'Token válido' });
  });
});

module.exports = router;

module.exports = router;
