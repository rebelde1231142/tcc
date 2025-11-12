// JS portado de registro.html
// Responsável por carregar e renderizar o registro de modificações

(function() {
  const escapeHTML = (str) => String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const LABEL_MAP = {
    nome: 'Nome',
    descricao: 'Descrição',
    quantidade: 'Quantidade',
    fk_Categoria_id: 'Categoria ID',
    categoria: 'Categoria',
    categoriaNome: 'Categoria',
    local: 'Local',
    estado: 'Estado',
    acao: 'Ação',
    recurso: 'Recurso',
    antes: 'Antes',
    alteracoes: 'Alterações',
    unidades: 'Unidades',
    usuario: 'Usuário',
    cpf: 'CPF'
  };

  const formatLabel = (key) => {
    if (!key) return '';
    if (LABEL_MAP[key]) return LABEL_MAP[key];
    const cleaned = key.toString().replace(/[_-]+/g, ' ');
    return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatDetalhes = (value, depth = 0) => {
    if (value === null || value === undefined || value === '') {
      return '<span class="text-muted">Sem detalhes</span>';
    }
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (depth < 3 && ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']')))) {
        try { return formatDetalhes(JSON.parse(trimmed), depth + 1); } catch (_) {}
      }
      const safe = escapeHTML(value).replace(/\n/g, '<br>');
      return `<span class="detalhe-texto">${safe}</span>`;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      return `<span class="detalhe-texto">${escapeHTML(String(value))}</span>`;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return '<span class="text-muted">Lista vazia</span>';
      return `<div class="detalhes-bloco detalhes-array">${value.map((item, idx) => `
        <div class="detalhe-linha">
          <span class="detalhe-chave">#${idx + 1}</span>
          <span class="detalhe-valor">${formatDetalhes(item, depth + 1)}</span>
        </div>
      `).join('')}</div>`;
    }
    if (typeof value === 'object') {
      const entries = Object.entries(value);
      if (entries.length === 0) return '<span class="text-muted">Sem dados</span>';
      return `<div class="detalhes-bloco">${entries.map(([k, v]) => `
        <div class="detalhe-linha">
          <span class="detalhe-chave">${escapeHTML(formatLabel(k))}</span>
          <span class="detalhe-valor">${formatDetalhes(v, depth + 1)}</span>
        </div>
      `).join('')}</div>`;
    }
    return `<span class="detalhe-texto">${escapeHTML(String(value))}</span>`;
  };

  const formatTipoBadge = (tipo) => {
    const normalized = (tipo || '-').toString().toLowerCase();
    const label = escapeHTML(tipo || '-');
    return `<span class="badge badge-tipo tipo-${normalized}" title="${label}">${label}</span>`;
  };

  const formatCPF = (valor) => {
    if (!valor) return '<span class="text-muted">-</span>';
    const digits = String(valor).replace(/\D/g, '');
    if (digits.length === 11) {
      const formatado = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
      return escapeHTML(formatado);
    }
    return escapeHTML(String(valor));
  };

  async function carregarRegistro() {
    const tbody = document.getElementById('tbodyRegistro');
    const alerta = document.getElementById('alerta');
    if (!tbody) return;
    alerta?.classList.add('d-none');
    tbody.innerHTML = '<tr><td colspan="6" class="text-muted">Carregando...</td></tr>';
    try {
      const response = await fetch('http://localhost:3000/api/registro');
      if (!response.ok) throw new Error('Erro ao buscar registros.');
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-muted">Nenhuma modificação encontrada.</td></tr>';
        return;
      }
      tbody.innerHTML = data.map(reg => {
        const tipoBadge = formatTipoBadge(reg.tipo);
        const metaParts = [];
        if (reg.grupo) metaParts.push(`Grupo: ${escapeHTML(reg.grupo)}`);
        if (reg.itemId) metaParts.push(`Item ID: ${escapeHTML(String(reg.itemId))}`);
        const metaHtml = metaParts.length ? `<div class="text-muted small">${metaParts.join(' · ')}</div>` : '';
        const detalhesConteudo = reg.detalhes !== null && reg.detalhes !== undefined
          ? formatDetalhes(reg.detalhes)
          : formatDetalhes(reg.detalhesTexto ?? '-');
        const cpfHtml = formatCPF(reg.cpf);
        return `
          <tr>
            <td>${reg.dataHora ? new Date(reg.dataHora).toLocaleString('pt-BR') : '-'}</td>
            <td>
              <div class="fw-semibold">${escapeHTML(reg.usuario || '-')}</div>
              ${metaHtml}
            </td>
            <td>${cpfHtml}</td>
            <td>${tipoBadge}</td>
            <td>${escapeHTML(reg.recurso || '-')}</td>
            <td>${detalhesConteudo}</td>
          </tr>
        `;
      }).join('');
    } catch (e) {
      if (alerta) {
        alerta.classList.remove('d-none');
        alerta.classList.add('alert-danger');
        alerta.textContent = e.message || 'Erro ao carregar registro.';
      }
      tbody.innerHTML = '<tr><td colspan="6" class="text-danger">Erro ao carregar registro.</td></tr>';
    }
  }

  document.addEventListener('DOMContentLoaded', carregarRegistro);
})();
