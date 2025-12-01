# 📊 Resumo das Mudanças - Sistema de Email

## 🎯 Objetivo
Eliminar a necessidade de trocar tokens do Gmail frequentemente e permitir gerenciar credenciais pelo banco de dados.

---

## 📁 Arquivos Modificados

### ✏️ `back/emailService.js` (MODIFICADO)
**Antes:** Usava OAuth2 com token de refresh
**Depois:** Busca credenciais do banco de dados

```javascript
// ANTES
const oAuth2Client = new google.auth.OAuth2(...)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

// DEPOIS
async function obterCredenciaisEmail() {
  const [rows] = await pool.query(
    'SELECT email, senha FROM ConfiguracaoEmail WHERE ativo = 1 LIMIT 1'
  )
  return rows[0]
}
```

### ✏️ `back/index.js` (MODIFICADO)
- **Adicionado:** Import do novo router `emailConfigRouter`
- **Adicionado:** Registro da rota: `app.use(emailConfigRouter)`

---

## 📁 Novos Arquivos

### ✨ `back/emailConfigRouter.js` (NOVO)
Gerencia os 4 endpoints:
- `GET /api/email-config` - Consultar configuração
- `POST /api/email-config` - Salvar/atualizar credenciais
- `PUT /api/email-config/:id/ativo` - Ativar/desativar
- `DELETE /api/email-config/:id` - Remover configuração

### ✨ `extra/criar-tabela-email-config.sql` (NOVO)
Script SQL para criar a tabela `ConfiguracaoEmail` no banco

### ✨ `GUIA_EMAIL_CONFIG.md` (NOVO)
Documentação completa sobre como usar o novo sistema

### ✨ `extra/postman-email-config.json` (NOVO)
Collection do Postman para testar os endpoints

---

## 🗄️ Estrutura do Banco de Dados

```sql
CREATE TABLE ConfiguracaoEmail (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  senha VARCHAR(255) NOT NULL,
  ativo TINYINT(1) DEFAULT 1,
  dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  dataAtualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🚀 Como Usar

### 1. Executar SQL
```bash
# Via MySQL Workbench ou CLI
mysql -u root -p tcc < extra/criar-tabela-email-config.sql
```

### 2. Reiniciar Backend
```bash
cd back
npm start
```

### 3. Salvar Credenciais
```bash
curl -X POST http://localhost:3001/api/email-config \
  -H "Content-Type: application/json" \
  -d '{"email": "seu@gmail.com", "senha": "sua-senha-de-app"}'
```

### 4. Usar nos Controllers
```javascript
// Nenhuma mudança necessária! Funciona igual:
const { enviarEmail } = require('./emailService')

await enviarEmail('destinatario@email.com', 'Assunto', '<html>...</html>')
```

---

## ✅ Vantagens

| Aspecto | Antes | Depois |
|--------|-------|--------|
| Token expira? | Sim, frequente | Não |
| Onde ficam credenciais? | .env | Banco de dados |
| Precisa reiniciar? | Sim (mudar .env) | Não (atualiza via API) |
| Segurança | Média | Boa |
| Facilidade | Difícil | Fácil |

---

## ⚙️ Removidos do `.env` (Opcional)

```env
# ❌ NÃO MAIS NECESSÁRIOS
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REDIRECT_URI=
GMAIL_REFRESH_TOKEN=
EMAIL_USER=
```

---

## 🔍 Verificação Rápida

### Teste se tudo está funcionando:

1. **Criar tabela:**
   ```sql
   SELECT * FROM ConfiguracaoEmail;
   ```

2. **Salvar credenciais:**
   ```bash
   POST /api/email-config
   ```

3. **Consultar:**
   ```bash
   GET /api/email-config
   ```

4. **Enviar email de teste:**
   Use qualquer rota que chame `enviarEmail()`

---

## 📝 Próximos Passos Recomendados

- [ ] Adicionar autenticação aos endpoints de email
- [ ] Criptografar a senha no banco (bcrypt)
- [ ] Adicionar validação de email
- [ ] Criar interface web para gerenciar credenciais
- [ ] Adicionar logs de sucesso/erro de envios

---

## 💡 Dicas

✅ **Use senha de app do Gmail**, não a senha real da conta
✅ **Remova espaços** da senha de app
✅ **Mantenha seguro** o acesso à API de configuração
✅ **Teste antes** de publicar em produção
