const express = require('express');
const loginRouter = require('./loginRouter');
const usuarioRouter = require('./usuarioRouter');
const pool = require('./db');
const { Parser } = require('json2csv'); // Biblioteca para converter JSON para CSV
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json()); // Para aceitar JSON no body das requisições
app.use('/api', loginRouter);
app.use('/api', usuarioRouter);

// Exemplo de rota teste
app.get('/', (req, res) => {
  res.send('API rodando!');
});

// Adicionando verificação de duplicidade antes de inserir o item
app.post('/api/itens', async (req, res) => {
  const { nome, quantidade, descricao, fk_Categoria_id } = req.body;
  console.log('Dados recebidos:', { nome, quantidade, descricao, fk_Categoria_id }); // Log dos dados recebidos
  try {
    // Verificar se o item já existe no banco de dados
    const [itemExistente] = await pool.query('SELECT * FROM Itens WHERE nome = ?', [nome]);
    if (itemExistente.length > 0) {
      return res.status(400).json({ erro: `O item com o nome "${nome}" já existe no banco de dados.` });
    }

    // Verificar se a categoria existe
    const [categoria] = await pool.query('SELECT * FROM Categoria WHERE Id = ?', [fk_Categoria_id]);
    if (categoria.length === 0) {
      console.error('Categoria inválida:', fk_Categoria_id); // Log de categoria inválida
      return res.status(400).json({ erro: 'Categoria inválida.' });
    }

    // Inserir o item no banco
    const [result] = await pool.query(
      'INSERT INTO Itens (nome, quantidade, descricao, fk_Categoria_id) VALUES (?, ?, ?, ?)',
      [nome, quantidade, descricao, fk_Categoria_id]
    );

    // Buscar o item recém-adicionado com a categoria
    const [item] = await pool.query(
      `SELECT Itens.id, Itens.nome, Itens.descricao, Itens.quantidade, Categoria.Nome AS categoriaNome
       FROM Itens
       JOIN Categoria ON Itens.fk_Categoria_id = Categoria.Id
       WHERE Itens.id = ?`,
      [result.insertId]
    );

    console.log('Item retornado:', item[0]); // Log do item retornado
    res.status(201).json({ mensagem: 'Item cadastrado com sucesso!', item: item[0] }); // Retorna o item com a categoria e mensagem de sucesso
  } catch (error) {
    console.error('Erro ao cadastrar item:', error); // Log do erro completo
    res.status(500).json({ erro: 'Erro ao cadastrar item', detalhes: error.message });
  }
});

app.get('/api/itens', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Itens');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar itens', detalhes: error.message });
  }
});

// Certifique-se de que a rota DELETE está definida corretamente
app.delete('/api/itens/:id', async (req, res) => {
  const { id } = req.params;
  console.log('ID recebido para exclusão:', id); // Log do ID recebido
  try {
    // Deletar o item do banco de dados
    const [result] = await pool.query('DELETE FROM Itens WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      console.error('Item não encontrado para exclusão:', id); // Log de item não encontrado
      return res.status(404).json({ erro: 'Item não encontrado.' });
    }

    res.status(200).json({ mensagem: 'Item deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar item:', error); // Log do erro completo
    res.status(500).json({ erro: 'Erro ao deletar item', detalhes: error.message });
  }
});

app.get('/api/itens/categorias', async (req, res) => {
  try {
    const [result] = await pool.query(
      `SELECT 
        SUM(CASE WHEN fk_Categoria_id = 1 THEN 1 ELSE 0 END) AS ds,
        SUM(CASE WHEN fk_Categoria_id = 2 THEN 1 ELSE 0 END) AS administracao,
        SUM(CASE WHEN fk_Categoria_id = 3 THEN 1 ELSE 0 END) AS qui
      FROM Itens`
    );

    res.json(result[0]);
  } catch (error) {
    console.error('Erro ao buscar dados para o gráfico:', error);
    res.status(500).json({ erro: 'Erro ao buscar dados para o gráfico.' });
  }
});

app.get('/api/relatorio', async (req, res) => {
  try {
    // Consulta SQL para buscar itens organizados por categoria e nome
    const [itens] = await pool.query(`
      SELECT 
        Categoria.Nome AS categoriaNome,
        Itens.nome AS itemNome,
        Itens.quantidade AS quantidade,
        Itens.descricao AS descricao
      FROM Itens
      JOIN Categoria ON Itens.fk_Categoria_id = Categoria.Id
      ORDER BY Categoria.Nome ASC, Itens.nome ASC
    `);

    if (itens.length === 0) {
      return res.status(404).json({ erro: 'Nenhum item encontrado no banco de dados.' });
    }

    // Configuração dos campos do CSV com cabeçalhos mais descritivos
    const fields = [
      { label: 'Categoria', value: 'categoriaNome' },
      { label: 'Nome do Item', value: 'itemNome' },
      { label: 'Quantidade', value: 'quantidade' },
      { label: 'Descrição', value: 'descricao' }
    ];

    // Gerar o CSV usando json2csv
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(itens);

    // Configurar o cabeçalho para download do arquivo
    res.header('Content-Type', 'text/csv');
    res.attachment('relatorio-itens.csv');
    res.send(csv);
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ erro: 'Erro ao gerar relatório.', detalhes: error.message });
  }
});

// Certifique-se de que o servidor está ouvindo corretamente
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
