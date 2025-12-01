# 📦 Sistema de Gerenciamento de Estoque

Um sistema web completo para gerenciar inventário escolar com controle de acesso por níveis, relatórios automáticos e auditoria integrada.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C87?style=flat&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## ✨ Características Principais

✅ **Controle de Acesso Multiníveis**
- 👨‍🏫 Professor (acesso apenas sua área)
- 👥 Auxiliar Docente (acesso apenas sua área)
- 📊 Coordenação (acesso a todas as áreas)
- 👔 Direção (acesso administrativo completo)

✅ **Gerenciamento de Itens**
- Criar, editar e deletar itens
- Organizar em grupos/categorias
- Rastrear entrada e saída de materiais
- Estados: Operacional, Disponível, Inoperante

✅ **Relatórios Automáticos**
- 📊 Excel (.xlsx) - 100% Node.js
- 📄 PDF (.pdf)
- 📝 Word (.docx)
- 📋 CSV (.csv)
- Filtros por nível e área

✅ **Auditoria Completa**
- Registro de todas as ações (criar, editar, deletar)
- Rastreamento de usuário e IP
- Histórico detalhado de modificações
- Apenas admin vê auditoria

✅ **Segurança**
- Autenticação com CPF
- Senhas criptografadas (bcrypt)
- Recuperação de senha por email
- Confirmação de troca de email
- Tokens seguros com expiração

✅ **Comunicação por Email**
- Notificações automáticas
- Templates HTML profissionais
- Recuperação de conta
- Confirmação de mudanças

---

## 🚀 Como Começar

### Pré-requisitos

- **Node.js** (v14+)
- **MySQL** 5.7+
- **npm** (incluído com Node.js)

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/rebelde1231142/tcc.git
cd tcc
```

2. **Instale as dependências do backend**
```bash
cd back
npm install
cd ..
```

3. **Instale as dependências do frontend**
```bash
cd front
npm install
cd ..
```

4. **Configure o banco de dados**
- Abra o MySQL (Laragon, XAMPP, etc.)
- Importe o arquivo: `extra/tcc.sql`
```bash
mysql -u root -p < extra/tcc.sql
```

5. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na pasta `back`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=tcc
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=sua_senha_app
ADMIN_CPFS=12345678900,98765432100
```

6. **Inicie o servidor backend**
```bash
cd back
node index.js
```

7. **Inicie o frontend** (em outro terminal)
```bash
cd front
npm start
```

8. **Acesse a aplicação**
```
http://localhost:3000
```

---

## 📁 Estrutura do Projeto

```
tcc/
├── back/                    # Backend (Express + MySQL)
│   ├── index.js            # Servidor principal
│   ├── db.js               # Conexão MySQL
│   ├── usuarioRouter.js    # Rotas de usuário
│   ├── loginRouter.js      # Autenticação
│   ├── emailService.js     # Envio de emails
│   ├── relatorioExcel.js   # Geração de Excel
│   └── package.json        # Dependências Node.js
│
├── front/                   # Frontend (Vanilla JS)
│   ├── index.js            # Servidor estático
│   ├── public/
│   │   ├── index.html      # Home
│   │   ├── page/           # Páginas
│   │   └── assets/
│   │       ├── css/        # Estilos
│   │       └── js/         # Scripts
│   └── package.json
│
├── scripts/                 # Scripts utilitários
│   └── relatorio_excel.py  # (Obsoleto - Python não é mais usado)
│
├── extra/                   # Arquivos extras
│   ├── tcc.sql             # Banco de dados
│   ├── postman-email-config.json
│   └── comandos.txt
│
└── README.md               # Este arquivo
```

---

## 🔌 API Principais

### Autenticação
- `POST /api/login` - Fazer login
- `POST /api/logout` - Fazer logout
- `POST /api/usuarios/solicitar-troca-senha` - Solicitar recuperação de senha
- `POST /api/usuarios/confirmar-troca-senha` - Confirmar nova senha

### Itens
- `GET /api/itens` - Listar itens
- `GET /api/itens/:id` - Detalhar item
- `GET /api/itens/grupo/:nome` - Itens por grupo
- `POST /api/itens` - Criar item
- `PUT /api/itens/:id` - Editar item
- `DELETE /api/itens/:id` - Deletar item

### Relatórios
- `GET /api/relatorio-excel?nivel=todos&area=` - Download Excel
- `GET /api/relatorio-pdf?nivel=todos&area=` - Download PDF
- `GET /api/relatorio-word?nivel=todos&area=` - Download Word
- `GET /api/relatorio?nivel=todos&area=` - Download CSV

### Auditoria
- `GET /api/registro` - Histórico de ações (admin only)

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na pasta `back`:

```env
# Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=tcc

# Email (Gmail)
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=sua_senha_app

# Admin
ADMIN_CPFS=12345678900,98765432100

# URL (Produção)
BASE_URL=https://seu-dominio.com
```

**Para usar Gmail:**
1. Ative 2FA na sua conta Google
2. Gere uma [Senha de App](https://myaccount.google.com/apppasswords)
3. Use a senha de app no `.env`

---

## 💾 Dependências Principais

### Backend
- **Express** - Framework web
- **MySQL2** - Driver MySQL
- **bcrypt** - Criptografia de senhas
- **nodemailer** - Envio de emails
- **exceljs** - Geração de Excel (Node.js puro)
- **docx** - Geração de Word
- **pdfkit** - Geração de PDF
- **json2csv** - Geração de CSV

### Frontend
- **Vanilla JavaScript** - Sem frameworks pesados
- **Bootstrap 5** - Estilos
- **Flaticon** - Ícones

---

## 🎨 Funcionalidades por Nível

### 👨‍🏫 Professor
- Ver itens da sua categoria
- Criar grupos de itens
- Gerar relatórios (seus itens)

### 👥 Auxiliar Docente
- Mesmas permissões do Professor

### 📊 Coordenação
- Ver itens de todas as categorias
- Gerenciar itens
- Gerar relatórios gerais
- Exportar dados

### 👔 Direção
- Acesso total ao sistema
- Ver auditoria completa
- Gerenciar usuários
- Relatórios completos

---

## 🔄 Fluxo de Autenticação

```
1. Usuário faz login com CPF
   ↓
2. Sistema valida CPF no banco
   ↓
3. Valida senha (bcrypt)
   ↓
4. Retorna token de sessão
   ↓
5. Frontend armazena dados no sessionStorage
   ↓
6. Requisições incluem CPF no header (x-user-cpf)
   ↓
7. Backend registra ações na auditoria
```

---

## 📊 Relatórios Disponíveis

### Formatos Suportados

| Formato | Extensão | Características |
|---------|----------|-----------------|
| Excel | .xlsx | Formatado, congelado, bordas |
| PDF | .pdf | Tabelas, layout customizado |
| Word | .docx | Tabelas, formatação |
| CSV | .csv | Delimitado por ponto-e-vírgula |

### Filtros
- **Por Nível**: professor, auxiliar_docente, todos (coord/direção)
- **Por Área**: Desenvolvimento de Sistemas, Administração, Química

---

## 🐛 Troubleshooting

### Erro: "Conexão recusada (MySQL)"
```bash
# Verifique se MySQL está rodando
# Windows: Laragon, XAMPP
# Linux: sudo systemctl start mysql
# Verifique credenciais no .env
```

### Erro: "Email não enviado"
```bash
# Verifique credenciais Gmail
# Ative "Aplicativos menos seguros" OU use Senha de App
# Verifique se porta SMTP está liberada
```

### Erro: "Token expirado"
```bash
# Faça login novamente
# Tokens de recuperação expiram em 1 hora
```

### Relatório não gera
```bash
# Verifique permissões de pasta temporária
# Limpe cache do navegador
# Reinicie o servidor
```

---

## 📝 Logs

Os logs estão no console do servidor. Erros importantes também são registrados:

```bash
# Ver logs em tempo real
node index.js

# Ou com gerenciador de processo (recomendado para produção)
npm install -g pm2
pm2 start index.js
pm2 logs
```

---

## 🚀 Deploy em Produção

### Heroku
```bash
# Crie conta no Heroku
# Instale Heroku CLI
# Login
heroku login

# Crie app
heroku create seu-app-name

# Configure banco de dados
heroku addons:create cleardb:ignite

# Deploy
git push heroku main
```

### Docker
```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

```bash
docker build -t tcc-estoque .
docker run -p 3000:3000 tcc-estoque
```

---

## 👨‍💻 Desenvolvedor

Desenvolvido como projeto de conclusão de curso (TCC).

- **Repositório**: [github.com/rebelde1231142/tcc](https://github.com/rebelde1231142/tcc)
- **Licença**: ISC
- **Data**: 2025

---

## 📞 Suporte

Para reportar bugs ou sugerir melhorias, abra uma [issue no GitHub](https://github.com/rebelde1231142/tcc/issues).

---

## 📄 Licença

Este projeto está sob licença ISC.

```
ISC License

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.
```

---

**Feito com ❤️ para melhorar a gestão de estoque escolar**
