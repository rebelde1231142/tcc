// Esconde o menu e o footer na página de cadastro de usuário
$(document).ready(function() {
    const currentPath = window.location.pathname;
    const footer = document.getElementById('container-footer');
    const menu = document.getElementById('menu');
    if (currentPath === '/usuario/cadastrousuario') {
        if (footer) footer.style.display = 'none';
        if (menu) menu.style.display = 'none';
    } else {
        if (footer) footer.style.display = 'block';
        if (menu) menu.style.display = 'block';
    }
});
