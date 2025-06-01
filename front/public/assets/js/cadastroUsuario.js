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
            Senha: $('#senha').val()
        };

        fetch('http://localhost:3000/api/usuarios', {
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
                $('#previewFotoPerfil').attr('src', 'https://cdn-icons-png.flaticon.com/512/747/747376.png');
            } else {
                throw new Error('Erro ao cadastrar usuário.');
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
