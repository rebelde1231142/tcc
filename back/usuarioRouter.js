const express = require('express');
const pool = require('./db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { enviarEmail } = require('./emailService');
const router = express.Router();
const { enviarErro } = require('./utils/errorHandler');
// Troca de e-mail por confirmação (baseado na lógica de troca de senha)
if (!global.tokensTrocaEmail) global.tokensTrocaEmail = {};

// Função auxiliar: gera token, salva em memória e envia email de confirmação
async function prepararEEnviarTrocaEmail(cpf, novoEmail) {
  if (!cpf || !novoEmail) {
    return { status: 400, body: { erro: 'CPF e novo email são obrigatórios.' } };
  }
  // Verifica se o novo e-mail já está em uso
  const [existe] = await pool.query('SELECT 1 FROM Perfil WHERE Email = ?', [novoEmail]);
  if (existe.length > 0) {
    return { status: 400, body: { erro: 'Este e-mail já está em uso.' } };
  }
  // Gera token temporário (válido por 1h)
  const token = crypto.randomBytes(32).toString('hex');
  const expires = Date.now() + 3600 * 1000;
  global.tokensTrocaEmail[token] = { cpf, novoEmail, expires };
  // Monta link
  const link = `http://localhost:3000/page/usuario/confirmar-troca-email.html?token=${token}`;
  // Envia email
  await enviarEmail(novoEmail, 'Confirmação de troca de e-mail', `<p>Para confirmar a troca de e-mail, clique abaixo:</p><p><a href="${link}">Confirmar troca de e-mail</a></p><p>Se não foi você, ignore este email.</p>`);
  return { status: 200, body: { mensagem: 'Se o novo e-mail for válido, um link de confirmação foi enviado.' } };
}

// Solicita troca de e-mail (envia link para o novo e-mail)
router.post('/usuarios/solicitar-troca-email', async (req, res) => {
  try {
    const { cpf, novoEmail } = req.body;
    const resultado = await prepararEEnviarTrocaEmail(cpf, novoEmail);
    return res.status(resultado.status).json(resultado.body);
  } catch (error) {
    console.log(error);
    return enviarErro(res, 500, 'Não foi possível processar a solicitação no momento.', error);
  }
});

// Rota alternativa compatível com frontend: '/usuarios/alterar-email'
router.post('/usuarios/alterar-email', async (req, res) => {
  try {
    const { cpf, novoEmail } = req.body;
    const resultado = await prepararEEnviarTrocaEmail(cpf, novoEmail);
    return res.status(resultado.status).json(resultado.body);
  } catch (error) {
    console.log(error);
    return enviarErro(res, 500, 'Não foi possível processar a solicitação no momento.', error);
  }
});

// Confirma a troca de e-mail
router.post('/usuarios/confirmar-troca-email', async (req, res) => {
  const { token } = req.body;
  if (!token || !global.tokensTrocaEmail[token]) {
    return res.status(400).json({ erro: 'Token inválido ou expirado.' });
  }
  const { cpf, novoEmail, expires } = global.tokensTrocaEmail[token];
  if (Date.now() > expires) {
    delete global.tokensTrocaEmail[token];
    return res.status(400).json({ erro: 'Token expirado.' });
  }
  try {
  await pool.query('UPDATE Perfil SET Email = ? WHERE CPF = ?', [novoEmail, cpf]);
  delete global.tokensTrocaEmail[token];
  // Retorna o novo email e CPF para que o frontend possa reagir apropriadamente
  res.json({ mensagem: 'E-mail alterado com sucesso!', CPF: cpf, Email: novoEmail });
  } catch (error) {
    return enviarErro(res, 500, 'Não foi possível confirmar a troca de e-mail no momento.', error);
  }
});


// Confirmação de troca de senha por email
router.post('/usuarios/confirmar-troca', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ erro: 'Token é obrigatório.' });
  if (!global.tokensRecuperacao || !global.tokensRecuperacao[token]) {
    return res.status(400).json({ erro: 'Token inválido ou expirado.' });
  }
  // Marca token como confirmado
  global.tokensRecuperacao[token].confirmado = true;
  res.json({ mensagem: 'Token confirmado. Pode trocar a senha.' });
});

// Redefinir senha via token
router.post('/usuarios/redefinir-senha', async (req, res) => {
  const { token, novaSenha } = req.body;
  if (!token || !novaSenha) return res.status(400).json({ erro: 'Token e nova senha são obrigatórios.' });
  try {
    if (!global.tokensRecuperacao || !global.tokensRecuperacao[token]) {
      return res.status(400).json({ erro: 'Token inválido ou expirado.' });
    }
    const { cpf, expires, confirmado } = global.tokensRecuperacao[token];
    if (Date.now() > expires) {
      delete global.tokensRecuperacao[token];
      return res.status(400).json({ erro: 'Token expirado.' });
    }
    if (!confirmado) {
      return res.status(400).json({ erro: 'Token não confirmado. Confirme o email antes de trocar a senha.' });
    }
    // Atualiza a senha
    const hash = await bcrypt.hash(novaSenha, 10);
    await pool.query('UPDATE Perfil SET Senha = ? WHERE CPF = ?', [hash, cpf]);
    delete global.tokensRecuperacao[token];
    res.json({ mensagem: 'Senha redefinida com sucesso!' });
  } catch (error) {
    return enviarErro(res, 500, 'Não foi possível redefinir a senha no momento.', error);
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
  const link = `http://localhost:3000/page/usuario/confirmar-troca.html?token=${token}`;
    // Envia email
    await enviarEmail(email, 'Recuperação de senha', `<p>Para redefinir sua senha, confirme abaixo:</p><p><a href="${link}">Confirmar troca de senha</a></p><p>Se não foi você, ignore este email.</p>`);
    res.status(200).json({ mensagem: 'Se o email estiver cadastrado, um link foi enviado.' });
  } catch (error) {
    console.log(error);
    return enviarErro(res, 500, 'Não foi possível processar a solicitação no momento.', error);
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
    return enviarErro(res, 500, 'Não foi possível cadastrar o usuário no momento.', error);
  }
});



module.exports = router;
