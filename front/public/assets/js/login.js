// login.js
$(document).ready(() => {
    $('#formLogin').on('submit', function (e) {
        e.preventDefault();
        const email = $('#email').val();
        const senha = $('#senha').val();
        fetch('http://localhost:3000/usuarios')
            .then(response => response.json())
            .then(usuarios => {
                const usuario = usuarios.find(u => u.email === email && u.senha === senha);
                if (usuario) {
                    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
                    $('#alertaLogin')
                        .removeClass('d-none alert-danger')
                        .addClass('alert-success')
                        .text('Login realizado com sucesso!');
                    setTimeout(() => window.location.href = '/', 2000);
                } else {
                    throw new Error('E-mail ou senha inválidos.');
                }
            })
            .catch(error => {
                $('#alertaLogin')
                    .removeClass('d-none alert-success')
                    .addClass('alert-danger')
                    .text(error.message);
            });
    });
    // Redireciona para o cadastro ao clicar em "Cadastrar"
    $('#linkCadastro').on('click', function(e) {
        e.preventDefault();
        window.location.href = '/usuario/cadastrousuario';
    });
});
