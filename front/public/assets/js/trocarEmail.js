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
      mensagemDiv.textContent = dados.mensagem + ' Verifique seu novo e-mail e confirme a troca pelo link enviado.';
      // Não atualiza localStorage nem redireciona, pois a troca só será feita após confirmação!
    } else {
      mensagemDiv.style.color = 'red';
      mensagemDiv.textContent = dados.erro || 'Erro ao trocar e-mail.';
    }
  } catch (err) {
    mensagemDiv.style.color = 'red';
    mensagemDiv.textContent = 'Erro ao conectar com o servidor.';
  }
});
