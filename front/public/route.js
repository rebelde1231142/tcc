const rotas = [
    {
        'path': '',
        'component': '/page/home.html'
    },
    {
        'path': '/',
        'component': '/page/home.html'
    },
    {
        'path': '/teste',
        'component': '/page/teste.html'
    },
    {
        'path': '/teste/teste',
        'component': '/page/teste.html'
    },
    {
        'path': '/veiculo/cadastro',
        'component': '/page/veiculo/cadastro.html'
    },
    {
        'path': '/usuario/login',
        'component': '/page/usuario/login.html'
    },
    {
        'path': '/usuario/cadastrousuario',
        'component': '/page/usuario/cadastrousuario.html'
    },
    {
        'path': '/usuario/perfil',
        'component': '/page/usuario/perfil.html'
    },
    {
        'path': '/veiculo/perfil',
        'component': '/page/veiculo/perfil.html'
    }
];

const rotear = (rotaUrl) => {
    const rotaEncontrada = rotas.find(rota => rota.path.toLowerCase() === rotaUrl.toLowerCase());
    return rotaEncontrada || {
        path: '/error',
        component: '/page/erro.html'
    };
}

export const loadPage = async (callBackPageReturned) => {
    try {
        let rota = rotear(window.location.pathname);
        const response = await fetch(rota.component);

        if (!response.ok) {
            throw new Error(`Erro ao carregar a página: ${response.statusText}`);
        }

        const page = await response.text();
        callBackPageReturned(page);

        // Ocultar o rodapé e o menu na página de login
        const currentPath = window.location.pathname;
        const footer = document.getElementById('container-footer');
        const menu = document.getElementById('menu');
        if (currentPath === '/login' || currentPath === '/usuario/login') {
            if (footer) footer.style.display = 'none';
            if (menu) menu.style.display = 'none';
        } else {
            if (footer) footer.style.display = 'block';
            if (menu) menu.style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao carregar página:', error);
    }
};

// Função utilitária para gerar links de navegação baseados nas rotas
export const getRouteLink = (path) => {
    const rota = rotas.find(rota => rota.path.toLowerCase() === path.toLowerCase());
    return rota ? rota.path : '/error';
}


