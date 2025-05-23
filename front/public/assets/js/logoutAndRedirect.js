// Função para logout e redirecionamento para o menu-default
export function logoutAndRedirect() {
    localStorage.removeItem('usuarioLogado');
    // Troca o menu para o default se a função existir
    if (window.loadMenu) {
        loadMenu('menu', 'default');
    } else if (window.parent && window.parent.loadMenu) {
        window.parent.loadMenu('menu', 'default');
    }
    // Redireciona para a página principal (menu-default)
    window.location.href = '/';
}
