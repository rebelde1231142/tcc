const { execFile } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const loginRouter = require('./loginRouter');
const usuarioRouter = require('./usuarioRouter');
const pool = require('./db');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, HeadingLevel, AlignmentType, BorderStyle } = require('docx');
const { enviarErro } = require('./utils/errorHandler');
require('dotenv').config();

const app = express();

// Rota para listar todas as modificações (registro)
app.options('/api/registro', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(204).end();
});

app.get('/api/registro', async (req, res) => {
  try {
    // Busca todos os registros da tabela Auditoria
    const [rows] = await pool.query('SELECT dataHora, referencia, acao, recurso, detalhes, grupo, itemId FROM Auditoria ORDER BY dataHora DESC LIMIT 100');
    // Garante formato esperado pelo front
    let result = Array.isArray(rows) ? rows.map(reg => {
      let detalhesParsed = null;
      let detalhesTexto = null;

      if (reg.detalhes !== null && reg.detalhes !== undefined) {
        if (typeof reg.detalhes === 'string') {
          const trimmed = reg.detalhes.trim();
          if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
            try {
              detalhesParsed = JSON.parse(trimmed);
            } catch (err) {
              detalhesTexto = reg.detalhes;
            }
          } else {
            detalhesTexto = reg.detalhes;
          }
        } else if (typeof reg.detalhes === 'object') {
          detalhesParsed = reg.detalhes;
        } else {
          detalhesTexto = String(reg.detalhes);
        }
      }

      if (detalhesParsed === null && detalhesTexto === null) {
        detalhesTexto = null;
      }

      return {
        dataHora: reg.dataHora || null,
        usuario: reg.referencia || '-',
        tipo: reg.acao || '-',
        recurso: reg.recurso || '-',
        detalhes: detalhesParsed,
        detalhesTexto,
        grupo: reg.grupo || null,
        itemId: reg.itemId != null ? reg.itemId : null
      };
    }) : [];
    // Se não houver registros, envia array vazio
    if (!result || !Array.isArray(result)) result = [];
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao consultar registro:', error);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json([]);
  }
});

// Rota para gerar relatório Excel (.xlsx) usando Python e dados reais do banco
app.get('/api/relatorio-excel', async (req, res) => {
  // Garante CORS para esta rota, inclusive em erro
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    // Consulta SQL para buscar itens organizados por grupo (nome)
    const [itens] = await pool.query(`
      SELECT 
        Itens.nome AS Grupo,
        Itens.nome AS Nome,
        Itens.quantidade AS Quantidade,
        Itens.descricao AS Descrição,
        Categoria.Nome AS Categoria,
        Itens.local AS Local,
        Itens.estado AS Estado,
        DATE(Itens.dataAdicionado) AS 'Data de Adição'
      FROM Itens
      JOIN Categoria ON Itens.fk_Categoria_id = Categoria.Id
      ORDER BY Categoria.Nome ASC, Itens.nome ASC
    `);
    if (!itens || itens.length === 0) {
      return res.status(404).json({ erro: 'Nenhum item encontrado no banco de dados.' });
    }
    // Salva dados em arquivo temporário JSON
    const tmpJson = path.join(os.tmpdir(), `relatorio_itens_${Date.now()}.json`);
    fs.writeFileSync(tmpJson, JSON.stringify(itens, null, 2), 'utf-8');
    // Define caminho de saída temporário para o Excel
    const tmpExcel = path.join(os.tmpdir(), `relatorio_itens_${Date.now()}.xlsx`);
    const scriptPath = path.join(__dirname, '../scripts/relatorio_excel.py');
    // Executa o script Python passando os caminhos dos arquivos
    execFile('python', [scriptPath, tmpJson, tmpExcel], (error, stdout, stderr) => {
      // Remove o arquivo JSON temporário após uso
      try { fs.unlinkSync(tmpJson); } catch (_) {}
      if (error) {
        console.error('Erro ao gerar relatório Excel:', error, stderr);
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(500).send('Erro ao gerar relatório Excel.');
      }
      // Lê o arquivo Excel gerado e envia para download
      fs.readFile(tmpExcel, (err, data) => {
        // Remove o arquivo Excel temporário após uso
        try { fs.unlinkSync(tmpExcel); } catch (_) {}
        if (err) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          return res.status(500).send('Erro ao ler o arquivo Excel.');
        }
        res.setHeader('Content-Disposition', 'attachment; filename=relatorio_itens.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(data);
      });
    });
  } catch (error) {
    console.error('Erro ao preparar relatório Excel:', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).send('Erro ao preparar relatório Excel.');
  }
});
// Lista de CPFs autorizados a ver auditoria (pode vir do .env depois)
const digitsOnly = (s) => (s ? String(s).replace(/\D/g, '') : '');
const ADMIN_CPF_WHITELIST = (process.env.ADMIN_CPFS || '')
  .split(',')
  .map(s => digitsOnly(s))
  .filter(Boolean);

// Cria tabela de auditoria se não existir e helper para registrar ações
async function ensureAuditTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Auditoria (
        id INT AUTO_INCREMENT PRIMARY KEY,
        dataHora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        cpf VARCHAR(20) NULL,
        acao VARCHAR(50) NOT NULL,
        recurso VARCHAR(50) NOT NULL,
        referencia VARCHAR(100) NULL,
        grupo VARCHAR(100) NULL,
        itemId INT NULL,
        detalhes JSON NULL,
        endpoint VARCHAR(120) NULL,
        ip VARCHAR(64) NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    // Garantir colunas adicionais caso a tabela já existisse
    try { await pool.query('ALTER TABLE Auditoria ADD COLUMN IF NOT EXISTS grupo VARCHAR(100) NULL'); } catch (_) {}
    try { await pool.query('ALTER TABLE Auditoria ADD COLUMN IF NOT EXISTS itemId INT NULL'); } catch (_) {}
  } catch (e) {
    console.error('Falha ao garantir tabela Auditoria:', e);
  }
}

async function logAuditoria({ cpf, acao, recurso, referencia, grupo, itemId, detalhes }, req) {
  try {
    await pool.query(
      'INSERT INTO Auditoria (acao, recurso, referencia, grupo, itemId, detalhes, endpoint, ip) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        acao,
        recurso,
        referencia || null,
        grupo || null,
        itemId != null ? Number(itemId) : null,
        JSON.stringify(detalhes || null),
        (req && req.originalUrl) || null,
        (req && (req.ip || (req.headers['x-forwarded-for']||'').split(',')[0] || req.connection?.remoteAddress)) || null
      ]
    );
  } catch (e) {
    console.error('Erro ao registrar auditoria:', e);
  }
}

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());
// Serve arquivos estáticos do front-end
app.use(express.static(path.join(__dirname, '..', 'front', 'public')));
app.use('/api', loginRouter);
app.use('/api', usuarioRouter);
// Garantir tabela de auditoria ao subir
ensureAuditTable();

// Middleware global de tratamento de erros (captura exceções não tratadas nas rotas)
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  // Reutiliza o utilitário para enviar resposta consistente
  const { enviarErro } = require('./utils/errorHandler');
  return enviarErro(res, 500, 'Ocorreu um erro no servidor. Tente novamente mais tarde.', err);
});

// Rotas explícitas de fallback para páginas de confirmação (garante entrega do arquivo)
app.get('/page/usuario/confirmar-troca-email.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front', 'public', 'page', 'usuario', 'confirmar-troca-email.html'));
});

app.get('/page/usuario/confirmar-troca.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front', 'public', 'page', 'usuario', 'confirmar-troca.html'));
});

// Rota para listar locais


// Exemplo de rota teste
app.get('/', (req, res) => {
  res.send('API rodando!');
});

// Rota para gerar relatório em PDF
app.get('/api/relatorio-pdf', async (req, res) => {
  try {
    const [itens] = await pool.query(`
      SELECT Categoria.Nome AS categoriaNome, Itens.nome AS itemNome, Itens.quantidade AS quantidade, Itens.local AS local, Itens.descricao AS descricao
      FROM Itens
      JOIN Categoria ON Itens.fk_Categoria_id = Categoria.Id
      ORDER BY Categoria.Nome ASC, Itens.nome ASC
    `);
    if (!itens || itens.length === 0) {
      return res.status(404).json({ erro: 'Nenhum item encontrado no banco de dados.' });
    }
    const doc = new PDFDocument();
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio-itens.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);
    doc.fontSize(18).text('Relatório de Itens', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Categoria', 50, doc.y, { continued: true, width: 100 });
    doc.text('Nome', 150, doc.y, { continued: true, width: 100 });
    doc.text('Local', 250, doc.y, { continued: true, width: 100 });
    doc.text('Quantidade', 350, doc.y, { continued: true, width: 80 });
    doc.text('Descrição', 430, doc.y, { width: 180 });
    doc.moveDown(0.5);
    doc.font('Helvetica');
    itens.forEach(item => {
      doc.text(item.categoriaNome, 50, doc.y, { continued: true, width: 100 });
      doc.text(item.itemNome, 150, doc.y, { continued: true, width: 100 });
      doc.text(item.local, 250, doc.y, { continued: true, width: 100 });
      doc.text(String(item.quantidade), 350, doc.y, { continued: true, width: 80 });
      doc.text(item.descricao || '', 430, doc.y, { width: 180 });
    });
    doc.end();
  } catch (error) {
    console.error('Erro ao gerar relatório PDF:', error);
    return enviarErro(res, 500, 'Não foi possível gerar o relatório no momento.', error);
  }
});

// Rota para gerar relatório em Word (.docx)
app.get('/api/relatorio-word', async (req, res) => {
  try {
    const [itens] = await pool.query(`
          SELECT 
            Categoria.Nome AS categoriaNome,
            Itens.nome AS itemNome,
            Itens.quantidade AS quantidade,
            Itens.local AS local
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
              width: { size: 25, type: WidthType.PERCENTAGE },
              shading: { fill: 'D9E1F2' },
            }),
            new TableCell({
              children: [new Paragraph({ text: 'Nome', bold: true })],
              width: { size: 25, type: WidthType.PERCENTAGE },
              shading: { fill: 'D9E1F2' },
            }),
            new TableCell({
                children: [new Paragraph({ text: 'Local', bold: true })],
              width: { size: 25, type: WidthType.PERCENTAGE },
              shading: { fill: 'D9E1F2' },
            }),
            new TableCell({
              children: [new Paragraph({ text: 'Quantidade', bold: true })],
              width: { size: 25, type: WidthType.PERCENTAGE },
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
              new TableCell({ children: [new Paragraph(item.categoriaNome)], width: { size: 25, type: WidthType.PERCENTAGE } }),
              new TableCell({ children: [new Paragraph(item.itemNome)], width: { size: 25, type: WidthType.PERCENTAGE } }),
              new TableCell({ children: [new Paragraph(item.local)], width: { size: 25, type: WidthType.PERCENTAGE } }),
              new TableCell({ children: [new Paragraph(String(item.quantidade))], width: { size: 25, type: WidthType.PERCENTAGE } }),
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
    return enviarErro(res, 500, 'Não foi possível gerar o relatório no momento.', error);
  }
});

// Rota de consulta à auditoria (somente CPFs autorizados)


// Rota para editar um item pelo id
app.put('/api/itens/:id', async (req, res) => {
  const { id } = req.params;
  // Permitimos atualização parcial: qualquer subconjunto dos campos abaixo
  const permitidos = ['nome', 'quantidade', 'descricao', 'fk_Categoria_id', 'local', 'estado'];
  const dados = req.body || {};
  let conn;
  try {
    console.log('PUT /api/itens/:id - Recebido:', { id, body: dados });
    conn = await pool.getConnection();
    await conn.beginTransaction();
    // Verifica se o item existe
    const [itemExistRows] = await conn.query('SELECT * FROM Itens WHERE id = ?', [id]);
    if (itemExistRows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ erro: 'Item não encontrado.' });
    }
    const itemExistente = itemExistRows[0];
    // Se vier categoria, valida
    if (dados.fk_Categoria_id) {
      const [categoria] = await conn.query('SELECT * FROM Categoria WHERE Id = ?', [dados.fk_Categoria_id]);
      if (categoria.length === 0) {
        await conn.rollback();
        return res.status(400).json({ erro: 'Categoria inválida.' });
      }
    }
    // Monta SQL dinâmico apenas com campos enviados
    const campos = [];
    const valores = [];
    for (const key of permitidos) {
      if (Object.prototype.hasOwnProperty.call(dados, key)) {
        campos.push(`${key} = ?`);
        valores.push(dados[key]);
      }
    }
    if (campos.length === 0) {
      await conn.rollback();
      return res.status(400).json({ erro: 'Nenhum campo válido para atualizar.' });
    }
    valores.push(id);
    const sql = `UPDATE Itens SET ${campos.join(', ')} WHERE id = ?`;
    const [updateResult] = await conn.query(sql, valores);
    console.log('Resultado UPDATE:', updateResult);

    // Registrar entrada/saida se houver alteração de quantidade
    if (Object.prototype.hasOwnProperty.call(dados, 'quantidade')) {
      const beforeQ = Number(itemExistente.quantidade) || 0;
      const afterQ = Number(dados.quantidade);
      if (!Number.isNaN(afterQ)) {
        const delta = afterQ - beforeQ;
        if (delta !== 0) {
          const hoje = new Date().toISOString().slice(0,10);
          if (delta > 0) {
            // Aumentou quantidade: registra entrada com delta
            await conn.query('INSERT INTO entrada (fk_Itens_id, data, quantidade) VALUES (?, ?, ?)', [id, hoje, delta]);
          } else {
            // Diminuiu quantidade: registra saída com |delta|
            await conn.query('INSERT INTO saida (fk_Itens_id, data, quantidade) VALUES (?, ?, ?)', [id, hoje, Math.abs(delta)]);
          }
        }
      }
    }

    await conn.commit();
    res.status(200).json({ mensagem: 'Item atualizado com sucesso.' });
    try {
      const cpf = (req.headers['x-user-cpf'] || '').trim();
      await logAuditoria({
        cpf,
        acao: 'editar',
        recurso: 'item',
        referencia: String(id),
        grupo: itemExistente && itemExistente.nome ? itemExistente.nome : null,
        itemId: Number(id),
        detalhes: { antes: itemExistente, alteracoes: dados }
      }, req);
    } catch (_) {}
  } catch (error) {
    if (conn) { try { await conn.rollback(); } catch (_) {} }
    console.error('Erro ao editar item:', error);
    return enviarErro(res, 500, 'Não foi possível editar o item no momento.', error);
  } finally {
    if (conn) { try { conn.release(); } catch (_) {} }
  }
});

// Adicionando verificação de duplicidade antes de inserir o item
app.post('/api/itens', async (req, res) => {
  let { nome, quantidade, descricao, fk_Categoria_id, local, estado, unidades } = req.body;
  const dataAdicionado = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
  nome = (nome || '').trim();
  quantidade = parseInt(quantidade, 10) || 1;
  if (quantidade < 1) quantidade = 1;
  let conn;
  try {
    // Verificar se a categoria existe
    const [categoria] = await pool.query('SELECT * FROM Categoria WHERE Id = ?', [fk_Categoria_id]);
    if (categoria.length === 0) {
      return res.status(400).json({ erro: 'Categoria inválida.' });
    }

    // Se vier um array de unidades, insere linha por unidade com local/estado específicos
    const insertValues = [];
    const normalizaEstado = (e) => {
      if (!e) return null;
      const v = String(e).toLowerCase().trim();
      return (v === 'em uso' || v === 'quebrado' || v === 'parado') ? v : null;
    };
    if (Array.isArray(unidades) && unidades.length > 0) {
      unidades.forEach(u => {
        insertValues.push([
          nome,
          1,
          descricao,
          fk_Categoria_id,
          u && u.local ? u.local : null,
          dataAdicionado,
          normalizaEstado(u && u.estado)
        ]);
      });
    } else {
      for (let i = 0; i < quantidade; i++) {
        insertValues.push([nome, 1, descricao, fk_Categoria_id, local || null, dataAdicionado, normalizaEstado(estado)]);
      }
    }

    // Usa transação para inserir Itens e registrar as respectivas entradas
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [result] = await conn.query(
      'INSERT INTO Itens (nome, quantidade, descricao, fk_Categoria_id, local, dataAdicionado, estado) VALUES ?'
      , [insertValues]
    );

    // Registra as entradas na tabela `entrada`: uma por item criado (quantidade=1)
    const firstId = Number(result.insertId) || 0;
    const total = insertValues.length;
    if (firstId > 0 && total > 0) {
      const entradaValues = [];
      for (let i = 0; i < total; i++) {
        entradaValues.push([firstId + i, dataAdicionado, 1]); // fk_Itens_id, data, quantidade
      }
      await conn.query('INSERT INTO entrada (fk_Itens_id, data, quantidade) VALUES ?', [entradaValues]);
    }

    await conn.commit();

    // Retorno simplificado; o front recarrega a lista após cadastrar
    res.status(201).json({ mensagem: 'Itens cadastrados com sucesso!', totalInseridos: insertValues.length });
    try {
      const cpf = (req.headers['x-user-cpf'] || '').trim();
      await logAuditoria({
        cpf,
        acao: 'criar',
        recurso: 'item',
        referencia: nome,
        grupo: nome,
        itemId: null,
        detalhes: { nome, quantidade, descricao, fk_Categoria_id, local, estado, unidades: Array.isArray(unidades) ? unidades : null }
      }, req);
    } catch (_) {}
  } catch (error) {
    if (conn) { try { await conn.rollback(); } catch (_) {} }
    console.error('Erro ao cadastrar item:', error);
    return enviarErro(res, 500, 'Não foi possível cadastrar o item no momento.', error);
  } finally {
    if (conn) { try { conn.release(); } catch (_) {} }
  }
});

app.get('/api/itens', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT Itens.*, Categoria.Nome AS categoriaNome, Itens.dataAdicionado
      FROM Itens
      JOIN Categoria ON Itens.fk_Categoria_id = Categoria.Id
      ORDER BY Categoria.Nome ASC, Itens.nome ASC
    `);
    res.json(rows);
  } catch (error) {
    return enviarErro(res, 500, 'Não foi possível buscar itens no momento.', error);
  }
});

// Itens por grupo (nome)
app.get('/api/itens/grupo/:nome', async (req, res) => {
  const { nome } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT Itens.*, Categoria.Nome AS categoriaNome
       FROM Itens
       JOIN Categoria ON Itens.fk_Categoria_id = Categoria.Id
       WHERE TRIM(Itens.nome) = TRIM(?)
       ORDER BY Itens.id ASC`,
      [nome]
    );
    res.json(rows);
  } catch (error) {
    return enviarErro(res, 500, 'Não foi possível buscar itens do grupo no momento.', error);
  }
});

// Renomear grupo (apenas altera o campo "nome" de todos os itens do grupo)
app.put('/api/grupos/renomear', async (req, res) => {
  const antigoNome = (req.body && req.body.antigoNome ? String(req.body.antigoNome) : '').trim();
  const novoNome = (req.body && req.body.novoNome ? String(req.body.novoNome) : '').trim();
  if (!antigoNome || !novoNome) {
    return res.status(400).json({ erro: 'Forneça antigoNome e novoNome.' });
  }
  if (antigoNome.toLowerCase() === novoNome.toLowerCase()) {
    return res.status(400).json({ erro: 'O novo nome deve ser diferente do antigo.' });
  }
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    const [[{ total: existeAntigo } = { total: 0 }]] = await conn.query('SELECT COUNT(*) AS total FROM Itens WHERE TRIM(nome) = TRIM(?)', [antigoNome]);
    if (!existeAntigo) {
      await conn.rollback();
      return res.status(404).json({ erro: 'Grupo não encontrado.' });
    }
    // Evita mesclar acidentalmente com outro grupo existente
    const [[{ total: existeNovo } = { total: 0 }]] = await conn.query('SELECT COUNT(*) AS total FROM Itens WHERE TRIM(nome) = TRIM(?)', [novoNome]);
    if (existeNovo) {
      await conn.rollback();
      return res.status(409).json({ erro: 'Já existe um grupo com esse nome.' });
    }
    const [result] = await conn.query('UPDATE Itens SET nome = ? WHERE TRIM(nome) = TRIM(?)', [novoNome, antigoNome]);
    await conn.commit();
    res.json({ mensagem: 'Grupo renomeado com sucesso.', afetados: result.affectedRows || 0 });
    try {
      const cpf = (req.headers['x-user-cpf'] || '').trim();
      await logAuditoria({
        cpf,
        acao: 'renomear-grupo',
        recurso: 'item',
        referencia: `${antigoNome} -> ${novoNome}`,
        grupo: novoNome,
        itemId: null,
        detalhes: { antigoNome, novoNome }
      }, req);
    } catch (_) {}
  } catch (error) {
    if (conn) { try { await conn.rollback(); } catch (_) {} }
    console.error('Erro ao renomear grupo:', error);
    return enviarErro(res, 500, 'Não foi possível renomear o grupo no momento.', error);
  } finally {
    if (conn) { try { conn.release(); } catch (_) {} }
  }
});

// Deletar todos os itens de um grupo (por nome)
app.delete('/api/itens/grupo/:nome', async (req, res) => {
  const { nome } = req.params;
  try {
    const conn = await pool.getConnection();
    let afetados = 0;
    try {
      await conn.beginTransaction();
      const [antes] = await conn.query('SELECT id FROM Itens WHERE TRIM(nome) = TRIM(?)', [nome]);
      if (!antes || antes.length === 0) {
        await conn.rollback();
        return res.status(404).json({ erro: 'Nenhum item encontrado para este grupo.' });
      }
      const ids = antes.map(r => r.id);
      const [result] = await conn.query(
        'DELETE FROM Itens WHERE TRIM(nome) = TRIM(?)',
        [nome]
      );
      afetados = result.affectedRows || 0;
      const hoje = new Date().toISOString().slice(0,10);
      if (ids.length > 0) {
        const saidas = ids.map(i => [i, hoje, 1]);
        await conn.query('INSERT INTO saida (fk_Itens_id, data, quantidade) VALUES ?', [saidas]);
      }
      await conn.commit();
    } catch (e) {
      try { await conn.rollback(); } catch (_) {}
      throw e;
    } finally {
      try { conn.release(); } catch (_) {}
    }
    try {
      const cpf = (req.headers['x-user-cpf'] || '').trim();
      await logAuditoria({
        cpf,
        acao: 'deletar-grupo',
        recurso: 'item',
        referencia: nome,
        grupo: nome,
        itemId: null,
        detalhes: { grupo: nome, qtdRemovida: afetados }
      }, req);
    } catch (_) {}
    return res.status(200).json({ mensagem: 'Grupo deletado com sucesso.', afetados });
  } catch (error) {
    console.error('Erro ao deletar grupo:', error);
    return enviarErro(res, 500, 'Não foi possível deletar o grupo no momento.', error);
  }
});

// Certifique-se de que a rota DELETE está definida corretamente
app.delete('/api/itens/:id', async (req, res) => {
  const { id } = req.params;
  console.log('ID recebido para exclusão:', id); // Log do ID recebido
  try {
    // Buscar antes para log e deletar o item do banco de dados, registrando saída
    const [antes] = await pool.query('SELECT * FROM Itens WHERE id = ?', [id]);
    if (!antes || antes.length === 0) {
      return res.status(404).json({ erro: 'Item não encontrado.' });
    }
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [result] = await conn.query('DELETE FROM Itens WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        await conn.rollback();
        return res.status(404).json({ erro: 'Item não encontrado.' });
      }
      const hoje = new Date().toISOString().slice(0,10);
      await conn.query('INSERT INTO saida (fk_Itens_id, data, quantidade) VALUES (?, ?, ?)', [id, hoje, 1]);
      await conn.commit();
    } catch (e) {
      try { await conn.rollback(); } catch (_) {}
      throw e;
    } finally {
      try { conn.release(); } catch (_) {}
    }

    if (result.affectedRows === 0) {
      console.error('Item não encontrado para exclusão:', id); // Log de item não encontrado
      return res.status(404).json({ erro: 'Item não encontrado.' });
    }

    res.status(200).json({ mensagem: 'Item deletado com sucesso.' });
    try {
      const cpf = (req.headers['x-user-cpf'] || '').trim();
      await logAuditoria({
        cpf,
        acao: 'deletar',
        recurso: 'item',
        referencia: String(id),
        grupo: (antes && antes[0] && antes[0].nome) || null,
        itemId: Number(id),
        detalhes: { antes: (antes && antes[0]) || null }
      }, req);
    } catch (_) {}
  } catch (error) {
    console.error('Erro ao deletar item:', error); // Log do erro completo
    return enviarErro(res, 500, 'Não foi possível deletar o item no momento.', error);
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
    return enviarErro(res, 500, 'Não foi possível obter dados para os gráficos no momento.', error);
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
    return enviarErro(res, 500, 'Não foi possível gerar o relatório no momento.', error);
  }
});

// Certifique-se de que o servidor está ouvindo corretamente
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
