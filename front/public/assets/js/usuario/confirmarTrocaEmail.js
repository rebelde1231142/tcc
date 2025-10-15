// Script para gerenciar a confirmação de troca de e-mail
function getTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('token');
}

document.addEventListener('DOMContentLoaded', function() {
  const loading = document.getElementById('loading');
  const btnConfirmar = document.getElementById('btnConfirmar');
  const btnText = document.getElementById('btnText');
  const token = getTokenFromUrl();

  btnConfirmar.addEventListener('click', async function() {
    const msg = document.getElementById('msg');
    msg.innerHTML = '';
    btnConfirmar.disabled = true;
    btnText.style.display = 'none';
    loading.style.display = 'inline-block';

    if (!token) {
      msg.innerHTML = '<span class="text-danger"><i class="bi bi-x-circle"></i> Token não encontrado.</span>';
      btnConfirmar.disabled = false;
      btnText.style.display = '';
      loading.style.display = 'none';
      return;
    }

    try {
  const resp = await fetch('/api/usuarios/confirmar-troca-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      if (resp.ok) {
        const data = await resp.json();
        msg.innerHTML = '<span class="text-success"><i class="bi bi-check-circle"></i> E-mail alterado com sucesso! Redirecionando para login...</span>';
        localStorage.removeItem('usuarioLogado');
        setTimeout(() => {
          window.location.href = '/page/usuario/login.html';
        }, 1200);
      } else {
        const data = await resp.json();
        msg.innerHTML = `<span class="text-danger"><i class="bi bi-x-circle"></i> ${data.erro || 'Erro ao confirmar.'}</span>`;
      }
    } catch (err) {
      msg.innerHTML = '<span class="text-danger"><i class="bi bi-x-circle"></i> Erro de conexão.</span>';
    }

    btnConfirmar.disabled = false;
    btnText.style.display = '';
    loading.style.display = 'none';
  });
});
