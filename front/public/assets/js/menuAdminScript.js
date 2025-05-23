import { logoutAndRedirect } from '/assets/js/logoutAndRedirect.js';
import { exibirNomeUsuarioMenu, atualizarIconePerfilMenu } from '/assets/js/userMenuUtils.js';

document.getElementById('buttonsair').addEventListener('click', function (e) {
    e.preventDefault();
    logoutAndRedirect();
});

// Exibe o nome do admin logado no menu e a estrela
exibirNomeUsuarioMenu('nomeAdminMenu', 'admin', 'estrelaAdmin');
atualizarIconePerfilMenu('iconePerfilAdmin');
