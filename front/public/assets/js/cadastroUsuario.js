// cadastroUsuario.js - funcionalidades exclusivas para a página de cadastro de usuário
$(document).ready(() => {
    // Pré-visualização da foto de perfil
    $('#fotoPerfil').on('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (ev) {
                $('#previewFotoPerfil').attr('src', ev.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    $('#formCadastroUsuario').on('submit', function (e) {
        e.preventDefault();
        const usuario = {
            CPF: $('#cpf').val(),
            Email: $('#email').val(),
            Senha: $('#senha').val()
        };
        fetch('/api/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        })
        .then(response => {
            if (response.ok) {
                $('#alertaCadastro')
                    .removeClass('d-none alert-danger')
                    .addClass('alert-success')
                    .text('Usuário cadastrado com sucesso!');
                $('#formCadastroUsuario')[0].reset();
                setTimeout(() => window.location.href = '/page/usuario/login.html', 1500);
            } else {
                return response.json().then(data => {
                    throw new Error(data.erro || 'Erro ao cadastrar usuário.');
                });
            }
        })
        .catch(error => {
            $('#alertaCadastro')
                .removeClass('d-none alert-success')
                .addClass('alert-danger')
                .text(error.message);
        });
    });
});
