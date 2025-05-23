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
            nome: $('#nome').val(),
            email: $('#email').val(),
            telefone: $('#telefone').val(),
            senha: $('#senha').val(),
            fotoPerfil: "" // será preenchido após upload
        };

        // Função para enviar a imagem e retornar a URL
        function uploadFotoPerfil() {
            const file = $('#fotoPerfil')[0].files[0];
            if (!file) return Promise.resolve(""); // Se não houver imagem, retorna vazio

            const formData = new FormData();
            formData.append('file', file);

            return fetch('http://localhost:3037/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(result => result.url || "");
        }

        // Verifica se já existe usuário com o mesmo e-mail
        fetch('http://localhost:3000/usuarios?email=' + encodeURIComponent(usuario.email))
            .then(response => response.json())
            .then(usuarios => {
                if (usuarios.length > 0) {
                    $('#alertaCadastro')
                        .removeClass('d-none alert-success')
                        .addClass('alert-danger')
                        .text('Já existe um usuário cadastrado com este e-mail.');
                } else {
                    // Faz upload da foto e depois cadastra o usuário
                    uploadFotoPerfil().then(url => {
                        usuario.fotoPerfil = url;
                        fetch('http://localhost:3000/usuarios', {
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
                }
            })
            .catch(error => {
                $('#alertaCadastro')
                    .removeClass('d-none alert-success')
                    .addClass('alert-danger')
                    .text('Erro ao verificar e-mail: ' + error.message);
            });
    });
});
