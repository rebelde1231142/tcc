// Estrutura de permissões para dashboard
const permissoesDashboard = {
    todos: {
        botoes: [
            'btnAdicionarItem',
            'btnDeletarMassa',
            'btnEditarMassa',
            'btnRelatorio',
            'btnFiltro',
            'btnConfiguracoes',
            'btnHistorico'
        ],
        podeAlterar: true,
        categoriasVisiveis: ['Administração', 'Desenvolvimento de Sistemas', 'Química'],
        configuracoes: ['trocarSenha', 'trocarEmail', 'tema'] // Coordenação e Direção veem tudo
    },
    professor: {
        botoes: [
            'btnFiltro',
            'btnRelatorio',
            'btnConfiguracoes'
        ],
        podeAlterar: false,
        categoriasVisiveis: {}, // Será determinado pela área
        configuracoes: ['tema'] // Apenas tema
    },
    auxiliar_docente: {
        botoes: [
            'btnAdicionarItem',
            'btnDeletarMassa',
            'btnEditarMassa',
            'btnRelatorio',
            'btnFiltro',
            'btnConfiguracoes'
        ],
        podeAlterar: false,
        categoriasVisiveis: {}, // Será determinado pela área
        configuracoes: ['tema'] // Apenas tema
    }
};

// Mapeamento de áreas para categorias
const categoriasAreas = {
    'Desenvolvimento de Sistemas': 'Desenvolvimento de Sistemas',
    'Química': 'Química',
    'Administração': 'Administração'
};

// Função para obter botões permitidos conforme nível e área
function getBotoesPermitidos(nivel, area) {
    if (nivel === 'todos') {
        return permissoesDashboard.todos.botoes;
    }
    if (nivel === 'professor') {
        return permissoesDashboard.professor.botoes;
    }
    if (nivel === 'auxiliar_docente') {
        return permissoesDashboard.auxiliar_docente.botoes;
    }
    return [];
}

// Função para obter opções de configurações permitidas
function getConfiguracoes(nivel, area) {
    if (nivel === 'todos') {
        return permissoesDashboard.todos.configuracoes;
    }
    if (nivel === 'professor') {
        return permissoesDashboard.professor.configuracoes;
    }
    if (nivel === 'auxiliar_docente') {
        return permissoesDashboard.auxiliar_docente.configuracoes;
    }
    return [];
}

// Função para obter itens permitidos conforme nível e área
function getItensPermitidos(nivel, area) {
    if (nivel === 'todos') {
        return permissoesDashboard.todos.botoes;
    }
    if (nivel === 'professor' && area) {
        return permissoesDashboard.professor.botoes;
    }
    if (nivel === 'auxiliar_docente' && area) {
        return permissoesDashboard.auxiliar_docente.botoes;
    }
    return [];
}

// Função para obter categorias visíveis conforme nível e área
function getCategoriasVisiveis(nivel, area) {
    if (nivel === 'todos') {
        return ['Administração', 'Desenvolvimento de Sistemas', 'Química'];
    }
    if (nivel === 'professor' && area) {
        return [area];
    }
    if (nivel === 'auxiliar_docente' && area) {
        // Apenas Auxiliar Docente de Desenvolvimento de Sistemas vê Administração
        if (area === 'Desenvolvimento de Sistemas') {
            return ['Desenvolvimento de Sistemas', 'Administração'];
        } else {
            return [area];
        }
    }
    return [];
}

// Função para verificar permissão de alteração
function podeAlterar(nivel, area) {
    return nivel === 'todos' || nivel === 'auxiliar_docente';
}

// Carrega usuário logado do localStorage para window.usuarioLogado
function carregarUsuarioLogado() {
    const usuarioLogadoStorage = localStorage.getItem('usuarioLogado');
    if (usuarioLogadoStorage && !window.usuarioLogado) {
        try {
            window.usuarioLogado = JSON.parse(usuarioLogadoStorage);
            console.log('Usuário carregado do localStorage:', window.usuarioLogado);
        } catch (e) {
            console.error('Erro ao carregar usuário logado:', e);
        }
    }
}

// Carrega imediatamente e também no DOMContentLoaded
carregarUsuarioLogado();
document.addEventListener('DOMContentLoaded', carregarUsuarioLogado);

const loadJS = (containerId) =>{
    // Encontra e executa todos os <script> do conteúdo carregado
    const container = document.getElementById(containerId);
    const scripts = container.querySelectorAll("script");
    scripts.forEach(oldScript => {
        const newScript = document.createElement("script");

        // Copia o conteúdo ou src
        if (oldScript.src) {
            newScript.src = oldScript.src;
        } else {
            newScript.textContent = oldScript.textContent;
        }

        // Preserva atributos do script original, se houver
        [...oldScript.attributes].forEach(attr =>
            newScript.setAttribute(attr.name, attr.value)
        );

        // Adiciona ao DOM para execução
        document.body.appendChild(newScript);
    });
}
// Função para fazer fetch de itens com filtro de nivel e area
function fetchItensComPermissoes(baseUrl = 'http://localhost:3000/api/itens') {
  const usuario = window.usuarioLogado || JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
  
  // Se não há usuário logado, retorna todos os itens
  if (!usuario) {
    console.warn('fetchItensComPermissoes: Nenhum usuário logado, retornando todos os itens');
    return fetch(baseUrl);
  }
  
  const nivel = usuario.Nivel || usuario.nivel;
  const area = usuario.Area || usuario.area;
  
  // Se não há nível ou área, retorna todos os itens
  if (!nivel || !area) {
    console.warn('fetchItensComPermissoes: Nível ou área não definidos, retornando todos os itens');
    return fetch(baseUrl);
  }
  
  // Constrói URL com parâmetros
  const url = new URL(baseUrl);
  url.searchParams.append('nivel', nivel);
  url.searchParams.append('area', area);
  
  console.log('fetchItensComPermissoes - Nível:', nivel, 'Area:', area, 'URL:', url.toString());
  
  return fetch(url.toString());
}