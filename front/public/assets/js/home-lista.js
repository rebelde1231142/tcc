let chart; // Variável global para o gráfico
const itens = [];

$(document).ready(function() {
    $('#formAddItem').on('submit', function(e) {
        e.preventDefault();
        const nome = $('#itemNome').val();
        const quantidade = $('#itemQuantidade').val();
        const descricao = $('#itemDescricao').val();
        if (!nome || !quantidade || !descricao) return;
        const item = { nome, quantidade, descricao };
        itens.push(item);
        atualizarListaItens();
        this.reset();
    });
});

function atualizarListaItens() {
    const $lista = $('#listaItens');
    $lista.empty();
    itens.forEach((item, idx) => {
        $lista.append(`
            <li class="list-group-item d-flex flex-column align-items-start">
                <div class="d-flex w-100 justify-content-between align-items-center">
                    <strong>${item.nome}</strong>
                    <span class="badge bg-secondary ms-2">${item.quantidade}</span>
                    <button class="btn btn-sm btn-outline-primary ms-2 toggle-desc" type="button" data-idx="${idx}">Ver descrição</button>
                </div>
                <div class="descricao collapse mt-2" id="desc-${idx}">
                    <small>${item.descricao}</small>
                </div>
            </li>
        `);
    });
    // Evento para mostrar/ocultar descrição
    $('.toggle-desc').off('click').on('click', function() {
        const idx = $(this).data('idx');
        const $desc = $(`#desc-${idx}`);
        $desc.collapse('toggle');
        if ($desc.hasClass('show')) {
            $(this).text('Ver descrição');
        } else {
            $(this).text('Esconder descrição');
        }
        $desc.on('shown.bs.collapse', () => {
            $(this).text('Esconder descrição');
        });
        $desc.on('hidden.bs.collapse', () => {
            $(this).text('Ver descrição');
        });
    });
    atualizarGrafico(); // Atualiza o gráfico sempre que a lista muda
}

function atualizarGrafico() {
    const nomes = itens.map(item => item.nome);
    const quantidades = itens.map(item => Number(item.quantidade));
    if (chart) chart.destroy(); // Remove o gráfico anterior
    const ctx = document.getElementById('graficoItens').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nomes,
            datasets: [{
                label: 'Quantidade',
                data: quantidades,
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            }
        }
    });
}
