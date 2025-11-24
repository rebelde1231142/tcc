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
document.addEventListener('DOMContentLoaded', function() {
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
  // Supondo que o backend retorna o usuário logado em window.usuarioLogado
  // Exemplo:
  // window.usuarioLogado = { nivel: 'professor', area: 'quimica' }
  if (window.usuarioLogado) {
    const { nivel, area } = window.usuarioLogado;
    // Importa helpers.js se necessário
    // Filtra botões de alteração
    if (typeof podeAlterar === 'function' && !podeAlterar(nivel, area)) {
      const btnsAlteracao = [
        'btnAdicionarItem',
        'btnDeletarMassa',
        'btnEditarMassa'
      ];
      btnsAlteracao.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
      });
    }
    // Exemplo: filtrar itens da dashboard
    if (typeof getItensPermitidos === 'function') {
      const itensPermitidos = getItensPermitidos(nivel, area);
      // Aqui você pode usar itensPermitidos para renderizar menus, cards, etc.
      // Exemplo: console.log('Itens permitidos:', itensPermitidos);
    }
  }
});
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
