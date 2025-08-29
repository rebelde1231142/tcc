const express = require('express');
const pool = require('./db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { enviarEmail } = require('./emailService');
const router = express.Router();

// Redefinir senha via token
router.post('/usuarios/redefinir-senha', async (req, res) => {
  const { token, novaSenha } = req.body;
  if (!token || !novaSenha) return res.status(400).json({ erro: 'Token e nova senha são obrigatórios.' });
  try {
    if (!global.tokensRecuperacao || !global.tokensRecuperacao[token]) {
      return res.status(400).json({ erro: 'Token inválido ou expirado.' });
    }
    const { cpf, expires } = global.tokensRecuperacao[token];
    if (Date.now() > expires) {
      delete global.tokensRecuperacao[token];
      return res.status(400).json({ erro: 'Token expirado.' });
    }
    // Atualiza a senha
    const hash = await bcrypt.hash(novaSenha, 10);
    await pool.query('UPDATE Perfil SET Senha = ? WHERE CPF = ?', [hash, cpf]);
    delete global.tokensRecuperacao[token];
    res.json({ mensagem: 'Senha redefinida com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao redefinir senha', detalhes: error.message });
  }
});

// Recuperação de senha por email
router.post('/usuarios/recuperar-senha', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ erro: 'Email é obrigatório.' });
  try {
    // Busca usuário pelo email
    const [rows] = await pool.query('SELECT CPF, Email FROM Perfil WHERE Email = ?', [email]);
    if (!rows || rows.length === 0) {
      // Sempre responde sucesso para não revelar emails existentes
      return res.status(200).json({ mensagem: 'Se o email estiver cadastrado, um link foi enviado.' });
    }
    const usuario = rows[0];
    // Gera token temporário (válido por 1h)
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 3600 * 1000;
    // Salva token e expiração em memória (ideal: salvar em tabela no banco)
    if (!global.tokensRecuperacao) global.tokensRecuperacao = {};
    global.tokensRecuperacao[token] = { cpf: usuario.CPF, expires };
    // Monta link
    const link = `http://localhost:3030/page/usuario/trocar-senha.html?token=${token}`;
    // Envia email
    await enviarEmail(email, 'Recuperação de senha', `<p>Para redefinir sua senha, clique no link abaixo:</p><p><a href="${link}">${link}</a></p><p>Se não foi você, ignore este email.</p>`);
    res.status(200).json({ mensagem: 'Se o email estiver cadastrado, um link foi enviado.' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao enviar email', detalhes: error.message });
  }
});

// Cadastro de usuário
router.post('/usuarios', async (req, res) => {
  const { CPF, Email, Senha } = req.body;
  try {
    // Verifica se já existe usuário com o mesmo CPF ou Email
    const [existe] = await pool.query('SELECT 1 FROM Perfil WHERE CPF = ? OR Email = ?', [CPF, Email]);
    if (existe.length > 0) {
      return res.status(400).json({ erro: 'CPF ou Email já cadastrado.' });
    }
    const hash = await bcrypt.hash(Senha, 10); // Gera o hash da senha
    await pool.query('INSERT INTO Perfil (CPF, Email, Senha) VALUES (?, ?, ?)', [CPF, Email, hash]);
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
