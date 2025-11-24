// Estrutura de permissões para dashboard
const permissoesDashboard = {
    direcao: {
        itens: [
            'estatisticas',
            'gerenciarUsuarios',
            'relatorios',
            'configuracoes'
        ],
        podeAlterar: true
    },
    coordenacao: {
        itens: [
            'estatisticas',
            'gerenciarUsuarios',
            'relatorios'
        ],
        podeAlterar: true
    },
    professores: {
        comuns: {
            itens: [
                'listaAlunosComuns',
                'registroAtividadesComuns',
                'perfilComum'
            ],
            podeAlterar: false
        },
        desenvolvimentoSistemas: {
            itens: [
                'listaAlunosSistemas',
                'registroAtividadesSistemas',
                'perfilSistemas'
            ],
            podeAlterar: false
        },
        quimica: {
            itens: [
                'listaAlunosQuimica',
                'registroAtividadesQuimica',
                'perfilQuimica'
            ],
            podeAlterar: false
        },
        administracao: {
            itens: [
                'listaAlunosAdministracao',
                'registroAtividadesAdministracao',
                'perfilAdministracao'
            ],
            podeAlterar: false
        }
    },
    alunos: {
        itens: [
            'visualizarPerfil',
            'visualizarAtividades',
            'visualizarNotas'
        ],
        podeAlterar: false
    }
};

// Função para obter itens permitidos conforme nível e área
function getItensPermitidos(nivel, area) {
    if (nivel === 'direcao' || nivel === 'coordenacao') {
        return permissoesDashboard[nivel].itens;
    }
    if (nivel === 'professor' && area && permissoesDashboard.professores[area]) {
        return permissoesDashboard.professores[area].itens;
    }
    if (nivel === 'aluno') {
        return permissoesDashboard.alunos.itens;
    }
    return [];
}

// Função para verificar permissão de alteração
function podeAlterar(nivel, area) {
    if (nivel === 'direcao' || nivel === 'coordenacao') {
        return permissoesDashboard[nivel].podeAlterar;
    }
    if (nivel === 'professor' && area && permissoesDashboard.professores[area]) {
        return permissoesDashboard.professores[area].podeAlterar;
    }
    if (nivel === 'aluno') {
        return permissoesDashboard.alunos.podeAlterar;
    }
    return false;
}
export const loadJS = (containerId) =>{
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