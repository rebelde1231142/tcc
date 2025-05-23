// Função genérica para logout e redirecionamento para menu default
export function logoutAndRedirect() {
    localStorage.removeItem('usuarioLogado');
    if (window.loadMenu) {
        loadMenu('menu', 'default');
    } else if (window.parent && window.parent.loadMenu) {
        window.parent.loadMenu('menu', 'default');
    }
    window.location.href = '/';
}

document.getElementById('buttonSairLogado').addEventListener('click', function (e) {
    e.preventDefault();
    logoutAndRedirect();
});

