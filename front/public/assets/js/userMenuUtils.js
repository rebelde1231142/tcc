// userMenuUtils.js
// Funções utilitárias para exibir nome e foto do usuário/admin nos menus

// Função para exibir o nome do usuário no menu
export function exibirNomeUsuarioMenu(elementId, tipo, estrelaId) {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (usuarioLogado) {
        const usuario = JSON.parse(usuarioLogado);
        if (usuario.nome && document.getElementById(elementId)) {
            document.getElementById(elementId).textContent = usuario.nome;
        }
        // Se for admin, mostra a estrela
        if (tipo === 'admin' && estrelaId && document.getElementById(estrelaId)) {
            document.getElementById(estrelaId).style.display = 'inline';
        } else if (estrelaId && document.getElementById(estrelaId)) {
            document.getElementById(estrelaId).style.display = 'none';
        }
    }
}

// Função para atualizar o ícone do perfil no menu
export function atualizarIconePerfilMenu(iconeId) {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const icone = document.getElementById(iconeId);
    if (icone && usuarioLogado) {
        const usuario = JSON.parse(usuarioLogado);
        icone.src = usuario.fotoPerfil || 'https://cdn-icons-png.flaticon.com/512/747/747376.png';
    }
}
