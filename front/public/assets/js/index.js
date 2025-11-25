// JS portado de index.html
function gerenciarItensGrupo(nomeGrupo) {
  try {
    if (typeof abrirModalGrupo === 'function') {
      abrirModalGrupo(nomeGrupo);
      return;
    }
  } catch (_) {}
  const modalEl = document.getElementById('modalGrupoItens');
  if (modalEl && window.bootstrap && bootstrap.Modal) {
    try { modalEl.dataset.nomeGrupo = nomeGrupo; } catch (_) {}
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  } else {
    console.warn('Modal de grupo não encontrado.');
  }
}

// Função para aplicar permissões
function aplicarPermissoes() {
  // Primeiro, garante que window.usuarioLogado está carregado
  if (!window.usuarioLogado) {
    const usuarioLogadoStorage = localStorage.getItem('usuarioLogado');
    if (usuarioLogadoStorage) {
      try {
        window.usuarioLogado = JSON.parse(usuarioLogadoStorage);
        console.log('Usuário carregado do localStorage:', window.usuarioLogado);
      } catch (e) {
        console.error('Erro ao carregar usuário logado:', e);
      }
    }
  }

  const isAndroid = /Android/i.test(navigator.userAgent);
  if (isAndroid) {
    const btns = [
      { id: 'btnAdicionarItem', cls: 'btn-primary' },
      { id: 'btnDeletarMassa', cls: 'btn-danger' },
      { id: 'btnRelatorio', cls: 'btn-success' },
      { id: 'btnFiltro', cls: 'btn-info' }
    ];
    btns.forEach(({id, cls}) => {
      const el = document.getElementById(id);
      if (el) {
        el.className = 'btn px-4 py-2 ' + cls;
        el.style.background = '';
        el.style.color = '';
        el.style.border = '';
        el.style.boxShadow = '';
        el.style.borderRadius = '';
      }
    });
  }

  // Permissões por nível
  if (window.usuarioLogado) {
    const nivel = window.usuarioLogado.Nivel || window.usuarioLogado.nivel;
    const area = window.usuarioLogado.Area || window.usuarioLogado.area;
    
    console.log('Aplicando permissões para Nível:', nivel, 'Area:', area);
    
    // Obtém botões permitidos
    if (typeof getBotoesPermitidos === 'function') {
      const botoesPermitidos = getBotoesPermitidos(nivel, area);
      console.log('Botões permitidos:', botoesPermitidos.join(', '));
      
      // Oculta botões que não são permitidos
      const todosBotoes = [
        'btnAdicionarItem',
        'btnDeletarMassa',
        'btnEditarMassa',
        'btnRelatorio',
        'btnFiltro',
        'btnConfiguracoes',
        'btnHistorico'
      ];
      
      todosBotoes.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          if (botoesPermitidos.includes(id)) {
            el.style.display = '';
            console.log('Mostrando botão:', id);
          } else {
            el.style.display = 'none';
            console.log('Ocultando botão:', id);
          }
        }
      });
    } else {
      console.warn('getBotoesPermitidos não definida');
    }
    
    // Armazena configurações permitidas no window para uso em outras páginas
    if (typeof getConfiguracoes === 'function') {
      window.configuracoesPermitidas = getConfiguracoes(nivel, area);
      console.log('Configurações permitidas:', window.configuracoesPermitidas.join(', '));
    }
  } else {
    console.warn('Nenhum usuário logado (window.usuarioLogado não definido)');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  aplicarPermissoes();
});

// Também executa imediatamente em caso de script ser carregado após DOMContentLoaded
if (document.readyState === 'loading') {
  // DOM ainda está carregando
  document.addEventListener('DOMContentLoaded', aplicarPermissoes);
} else {
  // DOM já foi carregado
  aplicarPermissoes();
}
function selecionarLocalidade(local) {
  document.getElementById('localItem').value = local;
  var modalEl = document.getElementById('modalLocalidades');
  var modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  if (modal) modal.hide();
  modalEl.addEventListener('hidden.bs.modal', function handler() {
    const parentId = window._modalParentBeforeLocal || 'modalAdicionarItem';
    const parent = document.getElementById(parentId);
    if (parent) {
      bootstrap.Modal.getOrCreateInstance(parent).show();
      const localInput = document.getElementById('localItem');
      if (localInput) localInput.focus();
    }
    window._modalParentBeforeLocal = null;
    modalEl.removeEventListener('hidden.bs.modal', handler);
  });
}
