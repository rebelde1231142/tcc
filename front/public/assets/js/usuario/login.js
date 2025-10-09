// Script para gerenciar o tema e eventos da página de login
(function() {
    var tema = localStorage.getItem('configTema') || 'padrao';
    document.addEventListener('DOMContentLoaded', function() {
        document.body.setAttribute('data-tema', tema);
    });
})();

document.addEventListener('DOMContentLoaded', function() {
    const btnRegistrar = document.getElementById('btnRegistrar');
    if (btnRegistrar) {
        btnRegistrar.addEventListener('click', function() {
            window.location.href = '/page/usuario/registrar-2.html';
        });
    }
    const btnTrocarSenha = document.getElementById('btnTrocarSenha');
    if (btnTrocarSenha) {
        btnTrocarSenha.addEventListener('click', function() {
            window.location.href = '/page/usuario/trocar-senha-login.html';
        });
    }
});
