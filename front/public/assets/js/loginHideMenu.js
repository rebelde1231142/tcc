// loginHideMenu.js
// Esconde menu e rodapé na página de login
$(document).ready(function() {
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
});
