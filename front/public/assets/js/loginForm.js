$(document).ready(() => {
    $('#formLogin').on('submit', function (e) {
        e.preventDefault();

        const cpf = $('#cpf').val();
        const senha = $('#senha').val();

        fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cpf, senha })
        })
        .then(response => {
            if (!response.ok) throw new Error('CPF ou senha inválidos.');
            return response.json();
        })
        .then(usuario => {
            // Salva Email, CPF, Nivel, Area e outros dados recebidos do backend
            localStorage.setItem('usuarioLogado', JSON.stringify({
                CPF: usuario.CPF,
                Email: usuario.Email,
                Nivel: usuario.Nivel || usuario.nivel,
                Area: usuario.Area || usuario.area
            }));
            // Também armazena no window para uso imediato
            window.usuarioLogado = {
                CPF: usuario.CPF,
                Email: usuario.Email,
                Nivel: usuario.Nivel || usuario.nivel,
                Area: usuario.Area || usuario.area
            };
            $('#alertaLogin')
                .removeClass('d-none alert-danger')
                .addClass('alert-success')
                .text('Login realizado com sucesso!');
            setTimeout(() => window.location.href = '/index.html', 1000);
        })
        .catch(error => {
            $('#alertaLogin')
                .removeClass('d-none alert-success')
                .addClass('alert-danger')
                .text(error.message);
        });
    });

    // Botão Registrar
    $('#btnRegistrar').on('click', function () {
        window.location.href = '/page/usuario/registrar-2.html';
    });

    // Botão Trocar Senha
    $('#btnTrocarSenha').on('click', function () {
        window.location.href = '/page/usuario/trocar-senha-login.html';
    });
});
