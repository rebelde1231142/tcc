const express = require('express');
const path = require('path');
const app = express();

// Middleware para redirecionar HTTPS para HTTP (opcional)
app.use((req, res, next) => {
    if (req.secure) {
        return res.redirect(301, `http://${req.headers.host}${req.url}`);
    }
    next();
});

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));


// Página inicial: visitantes veem index-visitante.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index-visitante.html'));
});

// Roteamento SPA: demais rotas caem no index.html (após login)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar o servidor
const PORT = 3030; // Altere a porta se necessário
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// ...existing code...
