// Função de paginação reutilizável para dashboards
// containerItens: elemento onde os cards dos itens serão renderizados
// paginacaoEl: elemento onde os botões de paginação serão renderizados
// itens: array de itens
// renderItem: função que recebe um item e retorna o HTML do card
// options: { itensPorPagina: number }
function renderPaginacaoItens({ containerItens, paginacaoEl, itens, renderItem, options = {} }) {
  const itensPorPagina = options.itensPorPagina || 10;
  let paginaAtual = 1;
  function renderPagina(pagina) {
    containerItens.innerHTML = '';
    const inicio = (pagina - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const itensPagina = itens.slice(inicio, fim);
    itensPagina.forEach(item => {
      containerItens.appendChild(renderItem(item));
    });
    // Renderizar botões de paginação
    paginacaoEl.innerHTML = '';
    paginacaoEl.style.display = 'flex';
    paginacaoEl.style.gap = '4px';
    paginacaoEl.style.marginTop = '16px';
    for (let i = 1; i <= Math.ceil(itens.length / itensPorPagina); i++) {
      const btn = document.createElement('button');
      btn.className = 'btn btn-dark mx-1';
      btn.textContent = i;
      if (i === pagina) btn.classList.add('active');
      btn.onclick = () => {
        paginaAtual = i;
        renderPagina(paginaAtual);
      };
      paginacaoEl.appendChild(btn);
    }
    if (itens.length <= itensPorPagina) {
      paginacaoEl.innerHTML = '<button class="btn btn-dark mx-1" disabled>1</button>';
    }
  }
  renderPagina(paginaAtual);
}

// Exporta para uso global
window.renderPaginacaoItens = renderPaginacaoItens;
