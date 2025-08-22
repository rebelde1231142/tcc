const cors = require('cors');
const express = require('express');
const loginRouter = require('./loginRouter');
const usuarioRouter = require('./usuarioRouter');
const pool = require('./db');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, HeadingLevel, AlignmentType, BorderStyle } = require('docx');
const app = express(); // <-- ESTA LINHA TEM QUE VIR ANTES DAS ROTAS

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/api', loginRouter);
app.use('/api', usuarioRouter);

// Exemplo de rota teste
app.get('/', (req, res) => {
  res.send('API rodando!');
});

// Rota para gerar relatório em PDF
app.get('/api/relatorio-pdf', async (req, res) => {
  try {
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

    // Criar documento PDF
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio-itens.pdf');
    doc.pipe(res);

    doc.fontSize(18).text('Relatório de Itens', { align: 'center' });
    doc.moveDown();

    // Cabeçalho da tabela
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Categoria', 50, doc.y, { continued: true, width: 120 });
    doc.text('Nome', 170, doc.y, { continued: true, width: 120 });
    doc.text('Quantidade', 290, doc.y, { continued: true, width: 80 });
    doc.text('Descrição', 370, doc.y, { width: 180 });
    doc.moveDown(0.5);
    doc.font('Helvetica');

    // Linhas da tabela
    itens.forEach(item => {
      doc.text(item.categoriaNome, 50, doc.y, { continued: true, width: 120 });
      doc.text(item.itemNome, 170, doc.y, { continued: true, width: 120 });
      doc.text(String(item.quantidade), 290, doc.y, { continued: true, width: 80 });
      doc.text(item.descricao || '', 370, doc.y, { width: 180 });
    });

    doc.end();
  } catch (error) {
    console.error('Erro ao gerar relatório PDF:', error);
    res.status(500).json({ erro: 'Erro ao gerar relatório PDF.', detalhes: error.message });
  }
});

// Rota para gerar relatório em Word (.docx)
app.get('/api/relatorio-word', async (req, res) => {
  try {
    const [itens] = await pool.query(`
      SELECT 
        Categoria.Nome AS categoriaNome,
        Itens.nome AS itemNome,
        Itens.quantidade AS quantidade
      FROM Itens
      JOIN Categoria ON Itens.fk_Categoria_id = Categoria.Id
      ORDER BY Categoria.Nome ASC, Itens.nome ASC
    `);

    if (itens.length === 0) {
      return res.status(404).json({ erro: 'Nenhum item encontrado no banco de dados.' });
    }

    // Cabeçalho da tabela
    const tableRows = [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: 'Categoria', bold: true })],
            width: { size: 33, type: WidthType.PERCENTAGE },
            shading: { fill: 'D9E1F2' },
          }),
          new TableCell({
            children: [new Paragraph({ text: 'Nome', bold: true })],
            width: { size: 34, type: WidthType.PERCENTAGE },
            shading: { fill: 'D9E1F2' },
          }),
          new TableCell({
            children: [new Paragraph({ text: 'Quantidade', bold: true })],
            width: { size: 33, type: WidthType.PERCENTAGE },
            shading: { fill: 'D9E1F2' },
          }),
        ],
        tableHeader: true,
      })
    ];

    // Linhas da tabela
    itens.forEach(item => {
      tableRows.push(new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(item.categoriaNome)], width: { size: 33, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph(item.itemNome)], width: { size: 34, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph(String(item.quantidade))], width: { size: 33, type: WidthType.PERCENTAGE } }),
        ]
      }));
    });

    // Criar documento Word
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: 'Relatório de Itens',
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 }
            }),
            new Table({
              rows: tableRows,
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
                left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
                right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
                insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
                insideVertical: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              },
            })
          ]
        }
      ]
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio-itens.docx');
    res.send(buffer);
  } catch (error) {
    console.error('Erro ao gerar relatório Word:', error);
    res.status(500).json({ erro: 'Erro ao gerar relatório Word.', detalhes: error.message });
  }
});

// Rota para editar um item pelo id
app.put('/api/itens/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, quantidade, descricao, fk_Categoria_id } = req.body;
  try {
    console.log('PUT /api/itens/:id - Recebido:', { id, nome, quantidade, descricao, fk_Categoria_id });
    // Verifica se o item existe
    const [itemExistente] = await pool.query('SELECT * FROM Itens WHERE id = ?', [id]);
    console.log('Resultado SELECT:', itemExistente);
    if (itemExistente.length === 0) {
      console.log('Item não encontrado para edição:', id);
      return res.status(404).json({ erro: 'Item não encontrado.' });
    }
    // Verifica se a categoria existe
    if (fk_Categoria_id) {
      const [categoria] = await pool.query('SELECT * FROM Categoria WHERE Id = ?', [fk_Categoria_id]);
      if (categoria.length === 0) {
        console.log('Categoria inválida:', fk_Categoria_id);
        return res.status(400).json({ erro: 'Categoria inválida.' });
      }
    }
    // Atualiza o item
    const [updateResult] = await pool.query(
      'UPDATE Itens SET nome = ?, quantidade = ?, descricao = ?, fk_Categoria_id = ? WHERE id = ?',
      [nome, quantidade, descricao, fk_Categoria_id, id]
    );
    console.log('Resultado UPDATE:', updateResult);
    res.status(200).json({ mensagem: 'Item atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao editar item:', error);
    res.status(500).json({ erro: 'Erro ao editar item', detalhes: error.message });
  }
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
      { label: 'categoria', value: 'categoriaNome' },
      { label: 'nome', value: 'itemNome' },
      { label: 'quantidade', value: 'quantidade' }
    ];

    // Gerar o CSV usando json2csv, forçando separador de coluna como ponto e vírgula e quebra de linha como \r\n
    const json2csvParser = new Parser({ fields, delimiter: ';', eol: '\r\n' });
    let csv = json2csvParser.parse(itens);

    // Corrigir possíveis problemas de quebra de linha duplicada
    csv = csv.replace(/\r?\n/g, '\r\n');

    // Configurar o cabeçalho para download do arquivo
    res.header('Content-Type', 'text/csv; charset=utf-8');
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
