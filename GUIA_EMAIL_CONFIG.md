# 📧 Guia de Configuração do Novo Sistema de Email

## O que mudou?

Antes você tinha que:
- ✗ Trocar o token de refresh do Gmail constantemente
- ✗ Guardar credenciais sensíveis nas variáveis de ambiente

Agora você:
- ✅ Armazena as credenciais de forma segura no banco de dados
- ✅ Pode atualizar as credenciais sem reiniciar o servidor
- ✅ Não precisa mexer em variáveis de ambiente

## 📋 Passos para Configurar

### 1️⃣ Criar a Tabela no Banco de Dados

Execute o SQL em seu banco MySQL:

```sql
CREATE TABLE IF NOT EXISTS ConfiguracaoEmail (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  senha VARCHAR(255) NOT NULL,
  ativo TINYINT(1) DEFAULT 1,
  dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  dataAtualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

Ou use o arquivo:
```
c:\Users\Aluno\Documents\GitHub\tcc\extra\criar-tabela-email-config.sql
```

### 2️⃣ Obter Senha de Aplicação do Gmail

1. Acesse: https://myaccount.google.com/apppasswords
2. Selecione: **Mail** e **Windows Computer** (ou seu SO)
3. Copie a senha gerada (será algo como: `abcd efgh ijkl mnop`)
4. **Não esqueça de remover os espaços!**

### 3️⃣ Salvar as Credenciais

Use a API para salvar as credenciais:

```bash
curl -X POST http://localhost:3001/api/email-config \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu-email@gmail.com",
    "senha": "sua-senha-de-app-sem-espacos"
  }'
```

**Resposta esperada:**
```json
{
  "mensagem": "Configuração de email salva com sucesso"
}
```

### 4️⃣ Verificar Configuração (Opcional)

```bash
curl http://localhost:3001/api/email-config
```

**Resposta:**
```json
{
  "id": 1,
  "email": "seu-email@gmail.com",
  "ativo": 1,
  "configurado": true
}
```

## 🔧 Endpoints da API

### GET `/api/email-config`
Retorna a configuração atual de email (sem senha por segurança)

### POST `/api/email-config`
Cria ou atualiza a configuração de email
```json
{
  "email": "seu-email@gmail.com",
  "senha": "sua-senha-de-app"
}
```

### PUT `/api/email-config/:id/ativo`
Ativa ou desativa a configuração
```json
{
  "ativo": true
}
```

### DELETE `/api/email-config/:id`
Remove a configuração

## 📝 Mudanças no Código

### ❌ Arquivos que NÃO são mais necessários:

No `.env`, remova:
```
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REDIRECT_URI=
GMAIL_REFRESH_TOKEN=
EMAIL_USER=
```

### ✅ Dependências Removidas

No `package.json`, a dependência `googleapis` não é mais necessária (mas pode deixar instalada)

### ✨ Novo arquivo:
- `emailConfigRouter.js` - Gerencia as rotas de configuração de email
- `emailService.js` - Atualizado para buscar credenciais do banco

## 🚀 Próximas Ações

1. Execute o SQL para criar a tabela
2. Reinicie o servidor backend: `npm start`
3. Use a API (curl ou Postman) para salvar as credenciais
4. Teste o envio de email através de qualquer rota que use `enviarEmail()`

## ⚠️ Dicas Importantes

- **Senha de App**: Use apenas a senha de aplicação do Gmail, NÃO a senha da sua conta
- **Sem espaços**: Remova todos os espaços da senha de app
- **Uma configuração por vez**: Só mantém 1 configuração ativa no banco
- **Segurança**: Não compartilhe a URL de acesso da API com credenciais

## 🔒 Segurança

- As senhas são armazenadas em texto plano no banco (considere criptografar em futuras versões)
- Recomenda-se usar a senha de app do Gmail, nunca a senha real da conta
- Adicione autenticação à rota de configuração de email em produção

## ❓ Dúvidas?

Se der erro ao enviar email, verifique:
1. ✓ A tabela foi criada no banco?
2. ✓ As credenciais foram salvas corretamente?
3. ✓ A senha de app está correta (sem espaços)?
4. ✓ O email está ativo (ativo = 1)?
