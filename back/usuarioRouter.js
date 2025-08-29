const express = require('express');
const pool = require('./db');
const bcrypt = require('bcrypt'); // ADICIONE ESTA LINHA
const router = express.Router();

// Cadastro de usuário
router.post('/usuarios', async (req, res) => {
  const { CPF, Senha } = req.body;
  try {
    const hash = await bcrypt.hash(Senha, 10); // Gera o hash da senha
    await pool.query('INSERT INTO Perfil (CPF, Senha) VALUES (?, ?)', [CPF, hash]);
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao cadastrar usuário', detalhes: error.message });
  }
});

module.exports = router;
