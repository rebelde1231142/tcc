// Botão mostrar/ocultar senha
document.getElementById('toggleSenha').addEventListener('click', function() {
  const senhaInput = document.getElementById('senha');
  if (senhaInput.type === 'password') {
    senhaInput.type = 'text';
    this.innerHTML = '<i class="bi bi-eye-slash"></i>';
  } else {
    senhaInput.type = 'password';
    this.innerHTML = '<i class="bi bi-eye"></i>';
  }
});
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
    const resp = await fetch('http://localhost:3000/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ CPF: cpf, Email: email, Senha: senha, Nivel: nivel, Area: area })
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

// Exibe campo de área apenas se nível for professor
document.getElementById('nivel').addEventListener('change', function() {
  const areaDiv = document.getElementById('areaDiv');
  const areaSelect = document.getElementById('area');
  if (this.value === 'professor') {
    areaDiv.style.display = '';
    areaSelect.disabled = false;
  } else {
    areaDiv.style.display = 'none';
    areaSelect.disabled = true;
  }
});
