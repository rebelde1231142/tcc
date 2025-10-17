// login.js
$(document).ready(() => {
    $('#formLogin').on('submit', function (e) {
        e.preventDefault();
        const cpf = $('#cpf').val(); // ajuste conforme o campo do formulário
        const senha = $('#senha').val();
            fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cpf, senha })
            })
            .then(response => {
                if (!response.ok) throw new Error('CPF ou senha inválidos.');
                return response.json();
            })
            .then(usuario => {
                localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
                $('#alertaLogin')
                    .removeClass('d-none alert-danger')
                    .addClass('alert-success')
                    .text('Login realizado com sucesso!');
                setTimeout(() => window.location.href = '/', 2000);
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
            window.location.href = '/page/usuario/registrar.html';
        });
});
