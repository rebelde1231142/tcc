# ✅ CHECKLIST DE IMPLEMENTAÇÃO - NOVO SISTEMA DE EMAIL

## 🎯 Objetivo
Implementar novo sistema de email com credenciais armazenadas no banco de dados (sem token expirando)

**Tempo estimado:** 10 minutos  
**Dificuldade:** Fácil ⭐⭐

---

## ✋ PRÉ-REQUISITOS

- [ ] Node.js instalado
- [ ] MySQL rodando
- [ ] Backend Node.js parado (para reiniciar depois)
- [ ] Conta Gmail ativa
- [ ] MySQL Workbench ou acesso ao banco via terminal

---

## 📋 PASSO 1: PREPARAÇÃO DO BANCO (2 MIN)

### Opção A: MySQL Workbench

- [ ] Abra MySQL Workbench
- [ ] Conecte ao banco `tcc`
- [ ] Copie o SQL abaixo:

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

- [ ] Cole no editor SQL
- [ ] Execute (Ctrl+Enter)
- [ ] Verifique: `SELECT * FROM ConfiguracaoEmail;` (deve estar vazio)

### Opção B: Terminal MySQL

```bash
cd c:\Users\Aluno\Documents\GitHub\tcc\extra
mysql -u root -p tcc < criar-tabela-email-config.sql
```

- [ ] Digite sua senha do MySQL (se tiver)
- [ ] Pressione Enter
- [ ] Se não aparecer erro, tabela foi criada ✅

---

## ⚙️ PASSO 2: VERIFICAR CÓDIGO (2 MIN)

Os arquivos já foram atualizados automaticamente. Apenas verifique:

- [ ] `back/emailService.js` - Não usa mais OAuth2
- [ ] `back/emailConfigRouter.js` - Novo arquivo existe
- [ ] `back/index.js` - Registrou o novo router

**Você não precisa fazer nada aqui - apenas confirmar que os arquivos existem!**

---

## 🚀 PASSO 3: INICIAR BACKEND (1 MIN)

### Terminal 1 - Backend

```bash
cd c:\Users\Aluno\Documents\GitHub\tcc\back
npm start
```

- [ ] Aguarde aparecer: `Server is running on port 3001`
- [ ] **Deixe rodando!**

```
Example app listening on port 3001
```

---

## 📧 PASSO 4: OBTER SENHA DO GMAIL (3 MIN)

1. [ ] Abra navegador
2. [ ] Acesse: https://myaccount.google.com/apppasswords
3. [ ] Faça login (se solicitado)
4. [ ] Selecione:
   - [ ] App: **Mail**
   - [ ] Device: **Windows Computer**

5. [ ] Google vai gerar uma senha como: `xyzq dcba ijkl mnop`
6. [ ] **IMPORTANTE:** Remova os espaços!
   ```
   Antes: xyzq dcba ijkl mnop
   Depois: xyzqdcbaijklmnop ✅
   ```
7. [ ] Copie a senha SEM espaços
8. [ ] Guarde em local seguro

---

## 💾 PASSO 5: SALVAR CREDENCIAIS (2 MIN)

### Terminal 2 - PowerShell (Novo!)

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

- [ ] Substitua `seu-email@gmail.com` pelo seu email
- [ ] Substitua `sua-senha-de-app-sem-espacos` pela senha do passo anterior
- [ ] Execute (Ctrl+Enter)

**Resposta esperada:**
```
mensagem : Configuração de email salva com sucesso
```

- [ ] Se viu a mensagem acima, sucesso! ✅

---

## 🔍 PASSO 6: VERIFICAR CONFIGURAÇÃO (1 MIN)

### PowerShell - Verificar

```powershell
Invoke-RestMethod `
    -Uri "http://localhost:3001/api/email-config" `
    -Method GET
```

- [ ] Execute
- [ ] Deve retornar algo como:

```
id           : 1
email        : seu-email@gmail.com
ativo        : 1
configurado  : True
```

- [ ] Confirm que o email está correto
- [ ] Confirme que `ativo` é `1`

---

## 📨 PASSO 7: TESTAR ENVIO DE EMAIL (2 MIN)

Tente fazer algo que envie email na sua app:

### Opções de teste:
- [ ] Fazer login com email errado (se dispara recuperação)
- [ ] Cadastrar novo usuário (se envia confirmação)
- [ ] Solicitar resetar senha (se envia link)
- [ ] Trocar email (se envia confirmação)

### Verificar resultado:
- [ ] Email foi recebido na sua caixa de entrada?
- [ ] Sem erros no console do Node.js?
- [ ] Funcionou? 🎉

**SE SIM - PARABÉNS, TUDO FUNCIONANDO!**

---

## 🆘 PASSO 8: TROUBLESHOOTING (SE NECESSÁRIO)

### ❌ Erro: "Tabela não existe"
- [ ] Execute SQL novamente
- [ ] Verifique: `SHOW TABLES;` no MySQL
- [ ] Deve aparecer `ConfiguracaoEmail`

### ❌ Erro: "Connection refused" (porta 3001)
- [ ] Verifique se backend está rodando
- [ ] Terminal 1 deve mostrar: `Server is running on port 3001`
- [ ] Se não, execute `npm start` novamente

### ❌ Erro: "Credenciais inválidas"
- [ ] Verifique email está correto
- [ ] Verifique se removeu TODOS os espaços da senha
- [ ] Gere nova senha: https://myaccount.google.com/apppasswords

### ❌ Erro: "Email configuration not found"
- [ ] Verifique se POST foi executado com sucesso
- [ ] Execute GET para confirmar que foi salvo
- [ ] Verifique banco: `SELECT * FROM ConfiguracaoEmail;`

### ❌ Email não é recebido
- [ ] Verifique se está enviando para email correto
- [ ] Verifique pasta de SPAM
- [ ] Verifique console do Node.js para erros

---

## 📊 PASSO 9: VALIDAÇÃO FINAL

Marque tudo que funcionou:

- [ ] Tabela criada no MySQL ✅
- [ ] Backend iniciado com sucesso ✅
- [ ] POST `/api/email-config` funcionou ✅
- [ ] GET `/api/email-config` retorna dados ✅
- [ ] Email foi recebido com sucesso ✅
- [ ] Sem erros no console ✅
- [ ] Você consegue atualizar sem reiniciar ✅

**SE TODOS MARCADOS = IMPLEMENTAÇÃO 100% COMPLETA! 🎉**

---

## 🎓 PASSO 10: PRÓXIMOS PASSOS (OPCIONAL)

### Testes adicionais:
- [ ] Teste atualizar credenciais (sem reiniciar)
- [ ] Teste desativar/ativar via PUT
- [ ] Teste com Postman (importar collection)
- [ ] Teste com cURL (executar exemplos)

### Melhorias futuras:
- [ ] Adicione autenticação à rota de configuração
- [ ] Criptografe senha com bcrypt
- [ ] Crie interface web para gerenciar
- [ ] Implemente logs de auditoria

---

## 📞 SUPORTE

### Se algo deu errado:

1. **Primeiro:** Leia [GUIA_PASSO_A_PASSO.md](GUIA_PASSO_A_PASSO.md)
2. **Depois:** Consulte seção "TROUBLESHOOTING"
3. **Finalmente:** Verifique [GUIA_EMAIL_CONFIG.md](../GUIA_EMAIL_CONFIG.md)

### Documentação completa:

- 📖 [INDEX.md](INDEX.md) - Índice de todos arquivos
- 🎯 [SUMARIO_IMPLEMENTACAO.md](SUMARIO_IMPLEMENTACAO.md) - Resumo
- 📊 [DIAGRAMA_FLUXO_EMAIL.md](DIAGRAMA_FLUXO_EMAIL.md) - Diagramas

---

## 💾 BACKUP (IMPORTANTE!)

Antes de continuar, faça backup:

```sql
-- Backup suas credenciais (execute se quiser guardar cópia):
CREATE TABLE ConfiguracaoEmailBackup AS 
SELECT * FROM ConfiguracaoEmail WHERE id = 1;
```

---

## 📝 ASSINATURA

**Data de Conclusão:** _____________  
**Implementado por:** _________________  
**Aprovado por:** _________________  

---

## ✅ RESULTADO FINAL

```
✅ Tabela criada no MySQL
✅ Backend atualizado e rodando
✅ Credenciais armazenadas no banco
✅ Emails sendo enviados com sucesso
✅ Token NUNCA mais expira
✅ Sem necessidade de trocar .env
✅ Sem necessidade de reiniciar

🎉 IMPLEMENTAÇÃO 100% COMPLETA!
```

---

**Parabéns! Você resolveu o problema de expiração de token! 🚀**

Qualquer dúvida, consulte a documentação ou releia este checklist.

**Boa sorte! 💪**
