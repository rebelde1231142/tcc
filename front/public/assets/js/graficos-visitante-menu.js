// Gráficos do menu lateral — réplica da função do visitante
// Requer Chart.js carregado e os canvases com estilos inline de altura (como no visitante)

let chartPorLocalMenu = null;
let chartPorCategoriaMenu = null;
let chartQtdPorCategoriaMenu = null;
let chartItensPorDiaMenu = null;

function fixarAlturaCanvas(id, h = 180) {
  const el = document.getElementById(id);
  if (!el) return el;
  try {
    el.height = h; // atributo
    el.style.height = h + 'px'; // CSS
    el.style.maxHeight = h + 'px';
  } catch (_) {}
  return el;
}

export async function carregarGraficosMenuVisitante() {
  try {
    const response = await fetch('http://localhost:3000/api/itens');
    const itens = await response.json();

    // 1. Itens por Local
    const locais = {};
    itens.forEach(item => {
      locais[item.local] = (locais[item.local] || 0) + 1;
    });
    // Mapeamento dos nomes reais para nomes amigáveis
    const nomesLocais = {
      'Almoxarifado': 'Sala de limpeza',
      'Sala de Aula': 'Sala de Aula',
      'Biblioteca': 'Biblioteca',
      'Sala dos Professores': 'Sala dos Professores',
      'Diretoria': 'Diretoria',
      'Quadra': 'Sala de material esportivo',
      'Cantina': 'Cantina',
      'Laboratório de Quimica': 'Laboratório de Quimica',
      'Laboratório de Informática': 'Laboratório de Informática',
      'Laboratório de Informática 2': 'Laboratório de Informática 2',
      'Laboratório de Informática 3': 'Laboratório de Informática 3'
    };
    const locaisLabels = Object.keys(locais).map(l => nomesLocais[l] || l);
    const locaisValues = Object.values(locais);
    const minimalColors = ['#6c757d', '#a3b1c6', '#bdbdbd', '#b8bac0', '#b5c2d1', '#e0cfc2', '#bfc4c9', '#dee2e6'];
    const minimalColorsHover = ['#1976d2', '#43a047', '#e53935', '#fbc02d', '#8e24aa', '#00838f', '#5d4037', '#757575'];
    if (chartPorLocalMenu) chartPorLocalMenu.destroy();
    chartPorLocalMenu = new Chart(document.getElementById('graficoPorLocalMenu').getContext('2d'), {
      type: 'pie',
      data: { labels: locaisLabels, datasets: [{ data: locaisValues, backgroundColor: minimalColors, hoverBackgroundColor: minimalColorsHover }] },
      options: { plugins: { legend: { display: false }, tooltip: { enabled: true }, title: { display: false } }, responsive: true }
    });

    // 2. Itens por Categoria
    const categorias = {};
    itens.forEach(item => {
      categorias[item.categoriaNome] = (categorias[item.categoriaNome] || 0) + 1;
    });
    // Mapeamento dos nomes reais para nomes amigáveis de categoria
    const nomesCategorias = {
      'Desenvolvimento de Sistemas': 'Desenvolvimento de Sistemas',
      'Administração Escolar': 'Administração Escolar',
      'Quimica': 'Química',
      'Ds': 'Desenvolvimento de Sistemas',
      'Administração': 'Administração Escolar',
      'Qui': 'Química'
    };
    const catLabels = Object.keys(categorias).map(c => nomesCategorias[c] || c);
    const catValues = Object.values(categorias);
    const catColors = ['#6c757d', '#a3b1c6', '#bdbdbd', '#e0cfc2'];
    if (chartPorCategoriaMenu) chartPorCategoriaMenu.destroy();
    chartPorCategoriaMenu = new Chart(document.getElementById('graficoPorCategoriaMenu').getContext('2d'), {
      type: 'pie',
      data: { labels: catLabels, datasets: [{ data: catValues, backgroundColor: catColors, hoverBackgroundColor: minimalColorsHover }] },
      options: { plugins: { legend: { display: false }, tooltip: { enabled: true }, title: { display: false } }, responsive: true }
    });

    // 3. Estado dos Itens (%) - paleta viva em Android, sempre 3 barras
    (function() {
      const isAndroid = /Android/i.test(navigator.userAgent);
      const vivid = ['#1976d2', '#e53935', '#43a047'];
      const vividHover = ['#1565c0', '#c62828', '#388e3c'];
      const estados = { 'Em uso': 0, 'Quebrado': 0, 'Parado': 0 };
      let totalEstados = 0;
      itens.forEach(item => {
        const estadoRaw = (item.estado || '').trim().toLowerCase();
        const qtd = Number(item.quantidade) || 0;
        if (estadoRaw === 'em uso') { estados['Em uso'] += qtd; totalEstados += qtd; }
        else if (estadoRaw === 'quebrado') { estados['Quebrado'] += qtd; totalEstados += qtd; }
        else if (estadoRaw === 'parado') { estados['Parado'] += qtd; totalEstados += qtd; }
      });
      const estadoLabels = ['Em uso','Quebrado','Parado'];
      const estadoValues = estadoLabels.map(l => totalEstados > 0 ? Math.round((estados[l] / totalEstados) * 100) : 0);
      const estadoColors = isAndroid ? vivid : ['#6c757d', '#a3b1c6', '#e0cfc2'];
      if (chartQtdPorCategoriaMenu) chartQtdPorCategoriaMenu.destroy();
      const elQtd = fixarAlturaCanvas('graficoQtdPorCategoriaMenu');
      chartQtdPorCategoriaMenu = new Chart(elQtd.getContext('2d'), {
        type: 'bar',
        data: { labels: estadoLabels, datasets: [{ data: estadoValues, backgroundColor: estadoColors, hoverBackgroundColor: isAndroid ? vividHover : minimalColorsHover, maxBarThickness: 40 }] },
        options: { responsive: false, animation: false, plugins: { legend: { display: false }, tooltip: { enabled: true, callbacks: { label: ctx => ctx.label + ': ' + ctx.parsed.y + '%' } }, title: { display: false } }, interaction: { mode: 'nearest', intersect: true }, scales: { x: { display: true }, y: { display: true, beginAtZero: true, min: 0, max: 100, ticks: { callback: v => v + '%' } } } }
      });
    })();

    // 4. Itens adicionados por dia - mostrar datas no eixo X e tooltip em DD/MM/YYYY, interação por toque
    (function() {
      const dias = {};
      itens.forEach(item => { if (item.dataAdicionado) dias[item.dataAdicionado] = (dias[item.dataAdicionado] || 0) + 1; });
      const diasLabels = Object.keys(dias).sort();
      const diasValues = diasLabels.map(d => dias[d]);
      if (chartItensPorDiaMenu) chartItensPorDiaMenu.destroy();
      const elDia = fixarAlturaCanvas('graficoItensPorDiaMenu');
      chartItensPorDiaMenu = new Chart(elDia.getContext('2d'), {
        type: 'line',
        data: { labels: diasLabels, datasets: [{ data: diasValues, borderColor: '#36A2EB', fill: false }] },
        options: { responsive: false, animation: false, plugins: { legend: { display: false }, tooltip: { enabled: true, callbacks: { title: function(ctx) { const lab = ctx[0] && ctx[0].label; if (!lab) return ''; const m = lab.match(/^(\d{4})-(\d{2})-(\d{2})/); if (m) { return `${m[3]}/${m[2]}/${m[1]}`; } return lab; }, label: function(ctx) { return 'Quantidade: ' + ctx.parsed.y; } } }, title: { display: false } }, interaction: { mode: 'index', intersect: false }, scales: { x: { display: false }, y: { display: false } } }
      });
    })();
  } catch (e) {}
}

export function destruirGraficosMenuVisitante() {
  try {
    if (chartPorLocalMenu) { chartPorLocalMenu.destroy(); chartPorLocalMenu = null; }
    if (chartPorCategoriaMenu) { chartPorCategoriaMenu.destroy(); chartPorCategoriaMenu = null; }
    if (chartQtdPorCategoriaMenu) { chartQtdPorCategoriaMenu.destroy(); chartQtdPorCategoriaMenu = null; }
    if (chartItensPorDiaMenu) { chartItensPorDiaMenu.destroy(); chartItensPorDiaMenu = null; }
  } catch (e) {}
}
