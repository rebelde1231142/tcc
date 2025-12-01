require('dotenv').config();
const nodemailer = require('nodemailer');
const pool = require('./db');

// Função para buscar credenciais do banco
async function obterCredenciaisEmail() {
  try {
    const [rows] = await pool.query(
      'SELECT email, senha FROM ConfiguracaoEmail WHERE ativo = 1 LIMIT 1'
    );
    
    if (rows.length === 0) {
      throw new Error('Credenciais de email não configuradas no banco de dados');
    }
    
    return rows[0];
  } catch (error) {
    console.error('Erro ao obter credenciais de email:', error);
    throw error;
  }
}

async function enviarEmail(destinatario, assunto, html) {
  try {
    const credenciais = await obterCredenciaisEmail();
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: credenciais.email,
        pass: credenciais.senha
      }
    });

    const mailOptions = {
      from: credenciais.email,
      to: destinatario,
      subject: assunto,
      html
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
}

module.exports = { enviarEmail };
