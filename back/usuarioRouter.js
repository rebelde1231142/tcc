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

// Endpoint para troca de senha
router.put('/usuarios/trocarSenha', async (req, res) => {
  const { CPF, novaSenha } = req.body;
  try {
    const [resultado] = await pool.query('UPDATE Perfil SET Senha = ? WHERE CPF = ?', [novaSenha, CPF]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    res.status(200).json({ mensagem: 'Senha atualizada com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar senha', detalhes: error.message });
  }
});

module.exports = router;
