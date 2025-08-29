const nodemailer = require('nodemailer');

// Configure aqui com seu email real e senha de app
const transporter = nodemailer.createTransport({
  service: 'gmail', // ou outro serviço
  auth: {
    user: 'SEU_EMAIL@gmail.com',
    pass: 'SENHA_DE_APP'
  }
});

async function enviarEmail(destinatario, assunto, html) {
  return transporter.sendMail({
    from: 'SEU_EMAIL@gmail.com',
    to: destinatario,
    subject: assunto,
    html
  });
}

module.exports = { enviarEmail };
