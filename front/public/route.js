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

        // Ocultar o menu na página de login
        const currentPath = window.location.pathname;
        const menu = document.getElementById('menu');
        if (currentPath === '/login' || currentPath === '/usuario/login') {
            if (menu) menu.style.display = 'none';
        } else {
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

// Abrir modal de edição e preencher campos
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('btn-editar-item')) {
    const id = e.target.getAttribute('data-id');
    fetch(`http://localhost:3000/api/itens/${id}`)
      .then(res => res.json())
      .then(item => {
        document.getElementById('editarItemId').value = item.id;
        document.getElementById('editarNomeItem').value = item.nome;
        document.getElementById('editarQtdItem').value = item.quantidade;
        document.getElementById('editarDescItem').value = item.descricao;
        document.getElementById('editarCategoriaItem').value = item.fk_Categoria_id;
        const modal = new bootstrap.Modal(document.getElementById('modalEditarItem'));
        modal.show();
      });
  }
});

// Submeter edição
document.getElementById('formEditarItem').addEventListener('submit', function(e) {
  e.preventDefault();
  const id = document.getElementById('editarItemId').value;
  const nome = document.getElementById('editarNomeItem').value.trim();
  const quantidade = document.getElementById('editarQtdItem').value.trim();
  const descricao = document.getElementById('editarDescItem').value.trim();
  const categoria = document.getElementById('editarCategoriaItem').value;
  const alerta = document.getElementById('alertaEditarModal');
  alerta.classList.add('d-none');

  if (!nome || !quantidade || !descricao || !categoria) {
    alerta.classList.remove('d-none', 'alert-success');
    alerta.classList.add('alert-danger');
    alerta.textContent = 'Todos os campos são obrigatórios.';
    return;
  }

  fetch(`http://localhost:3000/api/itens/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, quantidade, descricao, fk_Categoria_id: parseInt(categoria) })
  })
  .then(response => {
    if (!response.ok) throw new Error('Erro ao editar item.');
    alerta.classList.remove('d-none', 'alert-danger');
    alerta.classList.add('alert-success');
    alerta.textContent = 'Item editado com sucesso!';
    setTimeout(() => {
      bootstrap.Modal.getInstance(document.getElementById('modalEditarItem')).hide();
      location.reload();
    }, 800);
  })
  .catch(error => {
    alerta.classList.remove('d-none', 'alert-success');
    alerta.classList.add('alert-danger');
    alerta.textContent = error.message || 'Erro ao editar item.';
  });
});


