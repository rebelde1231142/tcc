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
- Recuperação de senha com token seguro
- Confirmação de troca de email
- Templates HTML profissionais e responsivos
- Links com expiração de 1 hora

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
│   ├── loginRouter.js      # Rotas de login
│   ├── usuarioRouter.js    # Rotas de usuário
│   ├── emailConfigRouter.js # Configuração de email
│   ├── emailService.js     # Serviço de envio de emails
│   ├── relatorioExcel.js   # Geração de Excel (exceljs)
│   ├── utils/
│   │   └── errorHandler.js # Tratamento de erros
│   └── package.json        # Dependências Node.js
│
├── front/                   # Frontend (Vanilla JS + Express)
│   ├── index.js            # Servidor estático
│   ├── public/
│   │   ├── index.html      # Dashboard principal
│   │   ├── modalGerenciarItens.html # Modal de gerenciamento
│   │   ├── route.js        # Roteamento frontend
│   │   ├── page/           # Páginas
│   │   │   ├── usuario/    # Páginas de usuário
│   │   │   │   ├── login.html
│   │   │   │   ├── registrar-2.html
│   │   │   │   ├── trocar-senha.html
│   │   │   │   ├── trocar-email.html
│   │   │   │   ├── esqueci-senha.html
│   │   │   │   ├── confirmar-troca.html
│   │   │   │   └── confirmar-troca-email.html
│   │   │   └── admin/      # Páginas de admin
│   │   └── assets/
│   │       ├── css/        # Estilos CSS
│   │       └── js/         # Scripts JavaScript
│   └── package.json
│
├── extra/                   # Arquivos extras
│   ├── tcc.sql             # Banco de dados
│   ├── postman-email-config.json # Configuração Postman
│   └── comandos.txt        # Comandos úteis
│
├── scripts/                 # Scripts (Python - não mais usado)
│   └── relatorio_excel.py  # Histórico apenas
│
└── README.md               # Este arquivo
```

---

## 🔌 API Principais

### Autenticação
- `POST /api/login` - Fazer login com CPF e senha
- `POST /api/usuarios/solicitar-troca-senha` - Solicitar recuperação de senha por email
- `POST /api/usuarios/confirmar-troca-senha` - Confirmar nova senha via token
- `POST /api/usuarios/solicitar-troca-email` - Solicitar mudança de email
- `POST /api/usuarios/confirmar-troca-email` - Confirmar novo email via token

### Gerenciamento de Usuários
- `POST /api/usuarios` - Cadastrar novo usuário
- `GET /api/usuarios/:cpf` - Buscar dados do usuário

### Itens & Categorias
- `GET /api/itens` - Listar itens (com filtros por nível e área)
- `GET /api/itens/:id` - Detalhar item específico
- `GET /api/itens/grupo/:nome` - Listar itens de um grupo
- `POST /api/itens` - Criar novo item
- `PUT /api/itens/:id` - Editar item
- `DELETE /api/itens/:id` - Deletar item
- `GET /api/itens/categorias` - Estatísticas por categoria

### Grupos
- `PUT /api/grupos/renomear` - Renomear um grupo
- `DELETE /api/itens/grupo/:nome` - Deletar um grupo inteiro

### Relatórios
- `GET /api/relatorio-excel?nivel=todos&area=` - Download Excel (.xlsx)
- `GET /api/relatorio-pdf?nivel=todos&area=` - Download PDF (.pdf)
- `GET /api/relatorio-word?nivel=todos&area=` - Download Word (.docx)
- `GET /api/relatorio?nivel=todos&area=` - Download CSV (.csv)

### Auditoria
- `GET /api/registro` - Histórico de todas as ações (admin only)

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
- ✅ Ver itens da sua categoria
- ✅ Criar/editar/deletar itens (sua categoria)
- ✅ Acessar grupos de itens
- ✅ Gerar relatórios (filtrados por sua área)

### 👥 Auxiliar Docente
- ✅ Mesmas permissões do Professor

### 📊 Coordenação
- ✅ Ver todos os itens
- ✅ Editar/deletar qualquer item
- ✅ Gerenciar todos os grupos
- ✅ Gerar relatórios completos
- ✅ Ver estatísticas gerais

### 👔 Direção
- ✅ Acesso total ao sistema
- ✅ **Consultar auditoria** (quem fez o quê, quando, onde)
- ✅ Gerenciar todos os dados
- ✅ Relatórios sem restrições

---

## 🔄 Fluxo de Autenticação

```
1. Usuário faz login com CPF + Senha
   ↓
2. Sistema valida CPF no banco de dados
   ↓
3. Valida senha (bcrypt)
   ↓
4. Retorna dados do usuário (CPF, Email, Nível, Área)
   ↓
5. Frontend armazena no sessionStorage
   ↓
6. Requisições incluem CPF no header (x-user-cpf)
   ↓
7. Backend valida permissões e registra na auditoria
```

## 🔄 Fluxo de Recuperação de Senha

```
1. Usuário clica "Esqueci minha senha"
   ↓
2. Informa seu CPF
   ↓
3. Sistema gera token e envia email
   ↓
4. Usuário clica link do email (expira em 1h)
   ↓
5. Página de confirmação valida token
   ↓
6. Usuário define nova senha
   ↓
7. Sistema atualiza senha (criptografada)
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
```

---

## 👨‍💻 Desenvolvedor

**Desenvolvido como Trabalho de Conclusão de Curso (TCC)**

- **GitHub**: [@rebelde1231142](https://github.com/rebelde1231142)
- **Repositório**: [tcc](https://github.com/rebelde1231142/tcc)
- **Licença**: ISC
- **Ano**: 2025

---

## 📄 Licença

ISC License - Sinta-se livre para usar, modificar e distribuir.

---

**Feito com ❤️ para melhorar a gestão de estoque escolar**

---

**Feito com ❤️ para melhorar a gestão de estoque escolar**
