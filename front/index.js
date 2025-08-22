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

// Roteamento SPA: redireciona todas as requisições desconhecidas para index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar o servidor
const PORT = 3030; // Altere a porta se necessário
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

<!-- Modal de, Adicionar Item, -->
<div class="modal fade" id="modalAdicionarItem" tabindex="-1" aria-labelledby="modalAdicionarItemLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content text-dark">
      <div class="modal-header">
        <h5 class="modal-title" id="modalAdicionarItemLabel">Adicionar Novo Item</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
      </div>
      <div class="modal-body">
        <form id="formAdicionarItem">
          <div class="mb-3">
            <label for="nomeItem" class="form-label">Nome do Item</label>
            <input type="text" class="form-control" id="nomeItem" required>
          </div>
          <div class="mb-3">
            <label for="qtdItem" class="form-label">Quantidade</label>
            <input type="number" class="form-control" id="qtdItem" required>
          </div>
          <div class="mb-3">
            <label for="descItem" class="form-label">Descrição</label>
            <textarea class="form-control" id="descItem" rows="2" required></textarea>
          </div>
          <div class="mb-3">
            <label for="categoriaItem" class="form-label">Categoria</label>
            <select class="form-select" id="categoriaItem" required>
              <option value="">Selecione</option>
              <option value="1">Ds</option>
              <option value="2">Administração</option>
              <option value="3">Qui</option>
            </select>
          </div>
          <div id="alertaModal" class="alert d-none" role="alert"></div>
          <button type="submit" class="btn btn-primary w-100">Salvar</button>
        </form>
      </div>
    </div>
  </div>
</div>
