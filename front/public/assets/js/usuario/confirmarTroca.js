// JS portado da página confirmar-troca.html
(function() {
  var tema = localStorage.getItem('configTema') || 'padrao';
  document.addEventListener('DOMContentLoaded', function() {
    document.body.setAttribute('data-tema', tema);
  });
})();

function getTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('token');
}
const token = getTokenFromUrl();
const btnConfirmar = document.getElementById('btnConfirmar');
const btnText = document.getElementById('btnText');
const loading = document.getElementById('loading');
if (btnConfirmar) {
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
      const resp = await fetch('http://localhost:3000/api/usuarios/confirmar-troca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      if (resp.ok) {
        msg.innerHTML = '<span class="text-success"><i class="bi bi-check-circle"></i> Confirmação realizada! Redirecionando...</span>';
        setTimeout(() => {
          window.location.href = '/page/usuario/trocar-senha.html?token=' + token;
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
}
// Adiciona ícones do Bootstrap Icons
const linkIcons = document.createElement('link');
linkIcons.rel = 'stylesheet';
linkIcons.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css';
document.head.appendChild(linkIcons);
