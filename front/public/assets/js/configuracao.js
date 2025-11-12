window.addEventListener('DOMContentLoaded', () => {
  // Exibir email do usuário logado
  const usuarioLogado = localStorage.getItem('usuarioLogado');
  if (usuarioLogado) {
    try {
      const user = JSON.parse(usuarioLogado);
      document.getElementById('emailUsuario').value = user.Email || '';
    } catch {
      document.getElementById('emailUsuario').value = '';
    }
  } else {
    document.getElementById('emailUsuario').value = '';
  }
  // Mostrar link de histórico somente se CPF estiver na whitelist
  try {
    const u = JSON.parse(localStorage.getItem('usuarioLogado')||'null');
    const linkHist = document.getElementById('linkHistoricoCfg');
    if (u && linkHist) {
      const cpf = (u.CPF || u.cpf || '').replace(/\D/g,'');
      fetch('/api/auditoria/permissao', { headers: { 'X-User-CPF': cpf } })
        .then(r => r.ok ? r.json() : { permitido:false })
        .then(j => {
          if (j && j.permitido) {
            // Visível apenas em mobile: telas < md
            linkHist.classList.remove('d-none');
            linkHist.classList.add('d-md-none');
          }
        })
        .catch(() => {});
    }
  } catch (_) {}
  // Botão para troca de senha
  const btnTrocarSenha = document.getElementById('btnTrocarSenha');
  if (btnTrocarSenha) {
    btnTrocarSenha.addEventListener('click', function() {
      window.location.href = '/page/usuario/trocar-senha.html';
    });
  }
  // Botão para troca de e-mail
  const btnTrocarEmail = document.getElementById('btnTrocarEmail');
  if (btnTrocarEmail) {
    btnTrocarEmail.addEventListener('click', function() {
      window.location.href = '/page/usuario/trocar-email.html';
    });
  }
  // Botão de logout
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', function() {
      localStorage.removeItem('usuarioLogado');
      window.location.href = '/page/usuario/login.html';
    });
  }
});
