# 🎯 Guia Prático Passo-a-Passo

## ⏱️ Tempo total: ~10 minutos

---

## PASSO 1: Criar a Tabela no Banco (1 min)

### Opção A: Via MySQL Workbench
1. Abra MySQL Workbench
2. Conecte ao banco `tcc`
3. Copie e cole o SQL abaixo
4. Execute (Ctrl+Enter)

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

### Opção B: Via MySQL CLI
```bash
mysql -u root -p tcc < "c:\Users\Aluno\Documents\GitHub\tcc\extra\criar-tabela-email-config.sql"
```

**Verificar:**
```sql
DESCRIBE ConfiguracaoEmail;
```

✅ Deve aparecer 5 colunas (id, email, senha, ativo, dataCriacao, dataAtualizacao)

---

## PASSO 2: Reiniciar Backend (2 min)

1. Abra PowerShell/Terminal
2. Navegue até a pasta backend:
```bash
cd "c:\Users\Aluno\Documents\GitHub\tcc\back"
```

3. Inicie o servidor:
```bash
npm start
```

**Esperado:**
```
Server is running on port 3001
```

✅ Deixe rodando enquanto testa

---

## PASSO 3: Obter Senha de Aplicação Gmail (3 min)

1. Acesse: https://myaccount.google.com/apppasswords
2. Faça login com sua conta Google
3. Selecione:
   - **App:** Mail
   - **Device:** Windows Computer

4. Google gera uma senha similar a: `xyzq dcba ijkl mnop`
5. **IMPORTANTE:** Remova todos os espaços!
   - Antes: `xyzq dcba ijkl mnop`
   - Depois: `xyzqdcbaijklmnop` ✅

6. Copie e guarde em um lugar seguro

---

## PASSO 4: Salvar Credenciais via API (2 min)

### Opção A: PowerShell

Abra novo PowerShell e execute:

```powershell
$email = "seu-email@gmail.com"
$senha = "sua-senha-de-app-sem-espacos"

$body = @{
    email = $email
    senha = $senha
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri "http://localhost:3001/api/email-config" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body
```

**Resposta esperada:**
```
mensagem : Configuração de email salva com sucesso
```

### Opção B: Postman

1. Abra Postman
2. Crie novo POST request
3. URL: `http://localhost:3001/api/email-config`
4. Body (JSON):
```json
{
  "email": "seu-email@gmail.com",
  "senha": "sua-senha-de-app-sem-espacos"
}
```

5. Clique "Send"

### Opção C: cURL

```bash
curl -X POST http://localhost:3001/api/email-config `
  -H "Content-Type: application/json" `
  -d "{\"email\": \"seu-email@gmail.com\", \"senha\": \"sua-senha\"}"
```

✅ Se receber `"mensagem": "Configuração de email salva com sucesso"`, funcionou!

---

## PASSO 5: Verificar Configuração (1 min)

### PowerShell

```powershell
Invoke-RestMethod `
    -Uri "http://localhost:3001/api/email-config" `
    -Method GET
```

**Resposta esperada:**
```
id           : 1
email        : seu-email@gmail.com
ativo        : 1
configurado  : True
```

### Browser

Simplesmente visite:
```
http://localhost:3001/api/email-config
```

✅ Deve retornar os dados em JSON

---

## PASSO 6: Testar Envio de Email (1-2 min)

### Teste com Qualquer Rota de Email Existente

Acesse qualquer rota que envia email na sua aplicação:
- Login com email inválido (se dispara recuperação)
- Cadastro novo (se envia confirmação)
- Recuperação de senha (se envia link)
- Troca de email/senha

**Verificar:**
- ✅ Email foi recebido?
- ✅ Sem erros no console?
- ✅ Funcionou? 🎉

---

## PASSO 7: Testar Atualização (Opcional - 1 min)

### Mudar Email SEM Reiniciar

1. Execute o POST novamente com email/senha diferentes:

```powershell
$body = @{
    email = "novo-email@gmail.com"
    senha = "nova-senha-de-app"
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri "http://localhost:3001/api/email-config" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body
```

2. Não precisa reiniciar! ✅
3. Próximo email usará as novas credenciais

---

## 🎉 PRONTO!

Se chegou até aqui, você conseguiu:

✅ Criar tabela de configuração  
✅ Inicializar backend  
✅ Obter senha de app do Gmail  
✅ Salvar credenciais via API  
✅ Verificar configuração  
✅ Testar envio de email  

---

## ❌ TROUBLESHOOTING

### Erro: "Credenciais de email não configuradas"

**Solução:**
1. Verifique tabela: `SELECT * FROM ConfiguracaoEmail;`
2. Se vazia, execute POST novamente
3. Se cheia, verifique se `ativo = 1`

```sql
UPDATE ConfiguracaoEmail SET ativo = 1;
```

### Erro: "Email ou senha inválidos"

**Solução:**
1. Verifique se usou **senha de app**, não senha real
2. Remova espaços da senha: `"xyzq dcba"` → `"xyzqdcba"`
3. Gere uma nova senha: https://myaccount.google.com/apppasswords

### Erro: "Connection refused"

**Solução:**
1. Backend não está rodando
2. Execute em terminal: `npm start` na pasta `back/`
3. Verifique se está na porta 3001: `http://localhost:3001`

### Erro: "Table doesn't exist"

**Solução:**
1. SQL não foi executado
2. Execute o `CREATE TABLE` novamente
3. Verifique: `SHOW TABLES;` deve incluir `ConfiguracaoEmail`

---

## 📋 Checklist Final

- [ ] Tabela criada no MySQL
- [ ] Backend rodando na porta 3001
- [ ] Credenciais salvas via API
- [ ] GET `/api/email-config` retorna dados
- [ ] Email recebido com sucesso
- [ ] Nenhum erro no console
- [ ] Você consegue atualizar sem reiniciar ✨

---

## 🚀 Próximos Passos (Opcional)

### Adicionar Autenticação
Protejer a rota de configuração com JWT ou token

### Criptografar Senha
Usar bcrypt para guardar senha encriptada no BD

### Interface Web
Criar página admin para gerenciar emails

### Logs de Auditoria
Registrar quem mudou as credenciais e quando

### Fallback para .env
Se banco cair, tentar credenciais do .env

---

## ✅ SUCESSO!

Parabéns! Você implementou com sucesso o novo sistema de email!

Agora você não precisa mais trocar tokens do Gmail, e tudo funciona via banco de dados.

**Quer resolver mais problemas? Estou aqui! 💪**
