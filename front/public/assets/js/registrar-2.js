document.getElementById('formRegistro').addEventListener('submit', async function(e) {
  e.preventDefault();
  const cpf = document.getElementById('cpf').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  const msg = document.getElementById('msg');
  msg.textContent = '';
  try {
    const resp = await fetch('http://localhost:3000/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ CPF: cpf, Email: email, Senha: senha })
    });
    if (resp.ok) {
      msg.textContent = 'Registrado com sucesso! Redirecionando...';
      msg.classList.remove('text-muted');
      msg.classList.add('text-success');
      setTimeout(() => {
        window.location.href = '/page/usuario/login.html';
      }, 1200);
    } else {
      const data = await resp.json();
      msg.textContent = data.erro || 'Erro ao registrar.';
      msg.classList.remove('text-muted');
      msg.classList.add('text-danger');
    }
  } catch (err) {
    msg.textContent = 'Erro de conexão.';
    msg.classList.remove('text-muted');
    msg.classList.add('text-danger');
  }
});
