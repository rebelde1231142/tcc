document.getElementById('formRegistro').addEventListener('submit', async function(e) {
  e.preventDefault();
  const cpf = document.getElementById('cpf').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  const nivel = document.getElementById('nivel').value;
  const area = nivel === 'professor' ? document.getElementById('area').value : null;
  const msg = document.getElementById('msg');
  msg.textContent = '';
  try {
    const resp = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ CPF: cpf, Email: email, Senha: senha, Nivel: nivel, Area: area })
    });
    if (resp.ok) {
      msg.textContent = 'Registrado com sucesso! Redirecionando...';
      setTimeout(() => {
        window.location.href = '/page/usuario/login.html';
      }, 1200);
    } else {
      const data = await resp.json();
      msg.textContent = data.erro || 'Erro ao registrar.';
    }
  } catch (err) {
    msg.textContent = 'Erro de conexão.';
  }
});

// Exibe campo de área apenas se nível for professor
document.getElementById('nivel').addEventListener('change', function() {
  const areaDiv = document.getElementById('areaDiv');
  if (this.value === 'professor') {
    areaDiv.style.display = '';
  } else {
    areaDiv.style.display = 'none';
  }
});
