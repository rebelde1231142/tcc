const express = require('express');
const pool = require('./db');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { cpf, senha } = req.body;
  const [rows] = await pool.query('SELECT * FROM Perfil WHERE CPF = ?', [cpf]);
  if (rows.length > 0) {
    const usuario = rows[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.Senha);
    if (senhaCorreta) {
      res.json(usuario);
    } else {
      res.status(401).json({ erro: 'CPF ou senha inválidos' });
    }
  } else {
    res.status(401).json({ erro: 'CPF ou senha inválidos' });
  }
});

module.exports = router;
