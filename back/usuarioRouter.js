const express = require('express');
const pool = require('./db');
const router = express.Router();

// Cadastro de usuário
router.post('/usuarios', async (req, res) => {
  const { CPF, Senha } = req.body;
  try {
    await pool.query('INSERT INTO Perfil (CPF, Senha) VALUES (?, ?)', [CPF, Senha]);
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao cadastrar usuário', detalhes: error.message });
  }
});

module.exports = router;
