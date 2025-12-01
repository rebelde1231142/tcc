const express = require('express');
const pool = require('./db');
const router = express.Router();

// GET - Obter configuração de email atual
router.get('/api/email-config', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, email, ativo FROM ConfiguracaoEmail LIMIT 1'
    );

    if (rows.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhuma configuração de email encontrada' });
    }

    // Não retorna a senha por segurança
    return res.json({
      id: rows[0].id,
      email: rows[0].email,
      ativo: rows[0].ativo,
      configurado: true
    });
  } catch (error) {
    console.error('Erro ao obter configuração de email:', error);
    res.status(500).json({ erro: 'Erro ao obter configuração' });
  }
});

// POST - Atualizar configuração de email
router.post('/api/email-config', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  try {
    // Verificar se já existe configuração
    const [rows] = await pool.query('SELECT id FROM ConfiguracaoEmail LIMIT 1');

    if (rows.length === 0) {
      // Inserir nova configuração
      await pool.query(
        'INSERT INTO ConfiguracaoEmail (email, senha, ativo) VALUES (?, ?, 1)',
        [email, senha]
      );
      return res.status(201).json({ mensagem: 'Configuração de email salva com sucesso' });
    } else {
      // Atualizar configuração existente
      await pool.query(
        'UPDATE ConfiguracaoEmail SET email = ?, senha = ? WHERE id = ?',
        [email, senha, rows[0].id]
      );
      return res.json({ mensagem: 'Configuração de email atualizada com sucesso' });
    }
  } catch (error) {
    console.error('Erro ao salvar configuração de email:', error);
    res.status(500).json({ erro: 'Erro ao salvar configuração' });
  }
});

// PUT - Ativar/Desativar configuração
router.put('/api/email-config/:id/ativo', async (req, res) => {
  const { id } = req.params;
  const { ativo } = req.body;

  try {
    await pool.query(
      'UPDATE ConfiguracaoEmail SET ativo = ? WHERE id = ?',
      [ativo ? 1 : 0, id]
    );
    res.json({ mensagem: 'Status atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ erro: 'Erro ao atualizar status' });
  }
});

// DELETE - Remover configuração
router.delete('/api/email-config/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM ConfiguracaoEmail WHERE id = ?', [id]);
    res.json({ mensagem: 'Configuração removida com sucesso' });
  } catch (error) {
    console.error('Erro ao remover configuração:', error);
    res.status(500).json({ erro: 'Erro ao remover configuração' });
  }
});

module.exports = router;
