// loginHideMenu.js
// Esconde menu na página de login
$(document).ready(function() {
    const currentPath = window.location.pathname;
    const menu = document.getElementById('menu');
    if (currentPath === '/login' || currentPath === '/usuario/login') {
        if (menu) menu.style.display = 'none';
    } else {
        if (menu) menu.style.display = 'block';
    }
});
