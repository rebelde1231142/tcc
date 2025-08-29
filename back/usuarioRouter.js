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


// Troca de senha
router.post('/usuarios/trocar-senha', async (req, res) => {
  const { CPF, senhaAtual, novaSenha } = req.body;
  try {
    // Busca o usuário pelo CPF
    const [rows] = await pool.query('SELECT Senha FROM Perfil WHERE CPF = ?', [CPF]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    const hashAtual = rows[0].Senha;
    // Compara a senha atual
    const senhaConfere = await bcrypt.compare(senhaAtual, hashAtual);
    if (!senhaConfere) {
      return res.status(401).json({ erro: 'Senha atual incorreta.' });
    }
    // Gera hash da nova senha
    const novoHash = await bcrypt.hash(novaSenha, 10);
    await pool.query('UPDATE Perfil SET Senha = ? WHERE CPF = ?', [novoHash, CPF]);
    res.json({ mensagem: 'Senha alterada com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao trocar senha', detalhes: error.message });
  }
});

module.exports = router;
