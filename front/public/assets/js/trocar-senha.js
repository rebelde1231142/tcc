// Detecta token na URL
function getTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('token');
}
const token = getTokenFromUrl();
if (!token) {
  document.getElementById('formTrocaSenha').style.display = 'none';
  document.getElementById('formSolicitarEmail').style.display = '';
  document.getElementById('tituloTroca').style.display = '';
  const msg = document.getElementById('msg');
  let email = '';
  try {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (usuarioLogado) {
      const user = JSON.parse(usuarioLogado);
      email = user.Email || '';
    }
  } catch {}
  msg.textContent = '';
  document.getElementById('formSolicitarEmail').addEventListener('submit', async function(e) {
    e.preventDefault();
    const emailInput = document.getElementById('emailSolicitado').value;
    msg.textContent = '';
    try {
      const resp = await fetch('http://localhost:3000/api/usuarios/recuperar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput })
      });
      if (resp.ok) {
        msg.textContent = 'Se o email estiver cadastrado, um link foi enviado. Verifique sua caixa de entrada.';
      } else {
        msg.textContent = 'Erro ao enviar email de troca.';
      }
    } catch (err) {
      msg.textContent = 'Erro de conexão.';
    }
  });
} else {
  // Exibe apenas o formulário de troca de senha
  document.getElementById('formTrocaSenha').style.display = '';
  document.getElementById('formSolicitarEmail').style.display = 'none';
  document.getElementById('tituloTroca').style.display = 'none';
}
document.getElementById('formTrocaSenha').addEventListener('submit', async function(e) {
  e.preventDefault();
  const novaSenha = document.getElementById('novaSenha').value;
  const msg = document.getElementById('msg');
  msg.textContent = '';
  if (!novaSenha) {
    msg.textContent = 'Preencha todos os campos.';
    return;
  }
  // Só permite troca via token
  try {
    const resp = await fetch('http://localhost:3000/api/usuarios/redefinir-senha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, novaSenha })
    });
    if (resp.ok) {
      msg.textContent = 'Senha redefinida com sucesso!';
      setTimeout(() => { window.location.href = '/page/usuario/login.html'; }, 1200);
    } else {
      const data = await resp.json();
      msg.textContent = data.erro || 'Erro ao redefinir senha.';
    }
  } catch (err) {
    msg.textContent = 'Erro de conexão.';
  }
});
const voltarBtn = document.querySelector('.btn-light');
if (!token) {
  voltarBtn.href = '/page/configuracao.html'; // Voltar para configuração se estiver na página de envio de email
} else {
  voltarBtn.href = '/page/usuario/login.html'; // Voltar para login se estiver na página de redefinição de senha
}
