document.getElementById('trocarEmailForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const cpf = document.getElementById('cpf').value;
  const novoEmail = document.getElementById('novoEmail').value;
  const mensagemDiv = document.getElementById('mensagem');
  mensagemDiv.textContent = '';

  try {
  const resposta = await fetch('http://localhost:3000/api/usuarios/alterar-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf, novoEmail })
    });
    const dados = await resposta.json();
    if (resposta.ok) {
      mensagemDiv.style.color = 'green';
      mensagemDiv.textContent = dados.mensagem;
      // Atualiza o localStorage com o novo e-mail
      try {
        const usuarioLogado = localStorage.getItem('usuarioLogado');
        if (usuarioLogado) {
          const user = JSON.parse(usuarioLogado);
          user.Email = novoEmail;
          localStorage.setItem('usuarioLogado', JSON.stringify(user));
        }
      } catch {}
      setTimeout(() => {
        window.location.href = '/page/configuracao.html';
      }, 1200);
    } else {
      mensagemDiv.style.color = 'red';
      mensagemDiv.textContent = dados.erro || 'Erro ao trocar e-mail.';
    }
  } catch (err) {
    mensagemDiv.style.color = 'red';
    mensagemDiv.textContent = 'Erro ao conectar com o servidor.';
  }
});
