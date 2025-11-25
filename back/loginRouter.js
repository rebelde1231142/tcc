const express = require('express');
const pool = require('./db');
const bcrypt = require('bcrypt');
const router = express.Router();
const { enviarErro } = require('./utils/errorHandler');

router.post('/login', async (req, res) => {
  const { cpf, senha } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM Perfil WHERE CPF = ?', [cpf]);
    if (rows.length > 0) {
      const usuario = rows[0];
      console.log('Usuário encontrado:', {
        CPF: usuario.CPF,
        Email: usuario.Email,
        Nivel: usuario.Nivel || usuario.nivel,
        Area: usuario.Area || usuario.area
      });
      const senhaCorreta = await bcrypt.compare(senha, usuario.Senha);
      if (senhaCorreta) {
        return res.json(usuario);
      }
    }
    // Não especificar se o CPF ou a senha falharam para manter mensagem neutra
    return res.status(401).json({ erro: 'Credenciais inválidas.' });
  } catch (error) {
    console.error('Erro na rota /login:', error);
    return enviarErro(res, 500, 'Não foi possível processar o login no momento.', error);
  }
});

module.exports = router;
