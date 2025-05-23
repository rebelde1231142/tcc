import { logoutAndRedirect } from '/assets/js/logoutAndRedirect.js';
import { exibirNomeUsuarioMenu, atualizarIconePerfilMenu } from '/assets/js/userMenuUtils.js';

document.getElementById('buttonSairLogado').addEventListener('click', function (e) {
    e.preventDefault();
    logoutAndRedirect();
});

// Exibe o nome do usuário logado no menu
exibirNomeUsuarioMenu('nomeUsuarioMenu');
atualizarIconePerfilMenu('iconePerfilMenu');
