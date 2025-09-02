const nodemailer = require('nodemailer');

// Configure aqui com seu email real e senha de app
const transporter = nodemailer.createTransport({
  host: 'smtp.elasticemail.com',
  port: 2525,
  auth: {
    user: 'leonelbrenodasilvagithub1@gmail.com', // seu usuário Elastic Email
    pass: '9352A5233612E3A7776E90A2563F07E939FE' // sua senha SMTP Elastic Email
  }
});

async function enviarEmail(destinatario, assunto, html) {
  return transporter.sendMail({
    from: 'leonelbrenodasilvagithub1@gmail.com',
    to: destinatario,
    subject: assunto,
    html
  });
}

module.exports = { enviarEmail };
