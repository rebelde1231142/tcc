# Sistema de Gestão de Materiais Escolares

Este projeto faz parte do Trabalho de Conclusão de Curso (TCC) e tem como objetivo otimizar o controle de materiais utilizados no ambiente escolar, permitindo registrar movimentações, acompanhar estoque e manter histórico de auditoria. A proposta visa oferecer uma solução simples, funcional e eficiente para melhorar a gestão interna da instituição.

---

## 🚀 Tecnologias Utilizadas

--Backend:--
- Node.js  
- Express  
- MySQL

--Frontend:--
- HTML  
- CSS / Bootstrap  
- JavaScript

---

## 📦 Estrutura do Projeto

/back → Servidor Node.js + API + Banco de Dados
/front → Interface Web

yaml
Copiar código

---

## ⚙️ Como Executar o Projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/SEU_USUARIO/tcc.git
2. Configurar variáveis de ambiente
bash
Copiar código
cd back
cp .env.example .env
Preencha com os dados do seu banco MySQL:

env
Copiar código
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_DATABASE=
ADMIN_CPFS=

3. Instalar dependências e iniciar backend
bash
Copiar código
npm install
npm start
Após isso, o sistema estará disponível em:3030


🗄️ Banco de Dados
O sistema utiliza MySQL para persistência de dados.
As tabelas incluem:

materiais

movimentos

usuarios

auditoria

etc.

Um script SQL de criação da base pode ser adicionado futuramente para facilitar deploy e avaliação.

🔐 Segurança e Auditoria
Operações são registradas em log

Controle de acesso via CPF administrador

Dados sigilosos tratados via .env

📌 Funcionalidades Principais
Cadastro e controle de materiais

Registro de retirada e devolução

Histórico rastreável por usuário

Consulta de estoque atualizado

Relatórios de auditoria

👨‍💻 Autor
Leonel Breno da Silva Ramos de Paula e Felipe Julio Berton
Desenvolvimento full-stack do projeto

🎯 Objetivo Acadêmico
Este sistema demonstra na prática conceitos de:

desenvolvimento web

arquitetura cliente-servidor

integração com banco de dados relacional

controle de segurança e auditoria

documentação e versionamento de software

📜 Licença
Projeto desenvolvido para fins acadêmicos.
Uso público permitido apenas para estudo ou referência.
