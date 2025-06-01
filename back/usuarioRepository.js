const pool = require('./db');

async function buscarUsuarioPorCpf(cpf) {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE cpf = ?', [cpf]);
  return rows[0];
}

module.exports = { buscarUsuarioPorCpf };
