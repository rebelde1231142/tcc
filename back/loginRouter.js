const express = require('express');
const pool = require('./db');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { cpf, senha } = req.body;
  const [rows] = await pool.query('SELECT * FROM Perfil WHERE CPF = ? AND Senha = ?', [cpf, senha]);
  if (rows.length > 0) {
    res.json(rows[0]);
  } else {
    res.status(401).json({ erro: 'CPF ou senha inválidos' });
  }
});

module.exports = router;
