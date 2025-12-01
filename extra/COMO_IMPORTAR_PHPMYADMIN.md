# 📊 Como Importar no phpMyAdmin

## ✅ A tabela de email já foi adicionada ao `tcc.sql`!

Agora é só importar normalmente no phpMyAdmin e a tabela será criada automaticamente.

---

## 🚀 Passo-a-Passo para Importar

### 1️⃣ Abra phpMyAdmin
```
http://localhost/phpmyadmin
```

### 2️⃣ Selecione o banco `tcc`
- Clique em "tcc" na barra lateral esquerda

### 3️⃣ Vá para a aba "Importar"
- Clique em "Importar" no menu superior

### 4️⃣ Selecione o arquivo
- Clique em "Escolher arquivo"
- Navegue até: `tcc\extra\tcc.sql`
- Selecione o arquivo

### 5️⃣ Clique em "Importar"
- Botão azul "Importar" no final

### 6️⃣ Confirme
- Se aparecer "Importação realizada com sucesso", está pronto! ✅

---

## ✅ Verificar se Tabela foi Criada

Após importar, verifique:

1. Acesse phpMyAdmin
2. Selecione banco "tcc"
3. Procure na lista de tabelas:
   ```
   Auditoria
   Categoria
   ConfiguracaoEmail ← DEVE APARECER AQUI!
   Itens
   Usuario
   ```

4. Se aparecer `ConfiguracaoEmail`, está funcionando! 🎉

---

## 📝 Inserir Credenciais (Depois)

Após importar, insira suas credenciais:

1. Clique em `ConfiguracaoEmail`
2. Vá para aba "Inserir"
3. Preencha:
   - **email:** seu-email@gmail.com
   - **senha:** sua-senha-de-app (remova espaços!)
   - **ativo:** 1

4. Clique em "Executar"

---

## 🆘 Se Deu Erro

### Erro: "Arquivo muito grande"
- Se `tcc.sql` ficar muito grande, divida em 2 arquivos
- Importe primeiro o original, depois crie a tabela manualmente

### Erro: "Já existe"
- Tabela já foi criada (é normal!)
- Apenas ignore e continue

### Erro de Sintaxe
- Abra o arquivo e verifique o SQL
- Ou recrie manualmente com:

```sql
CREATE TABLE `ConfiguracaoEmail` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `ativo` tinyint(1) DEFAULT '1',
  `dataCriacao` timestamp DEFAULT CURRENT_TIMESTAMP,
  `dataAtualizacao` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## ✨ Próximas Ações

1. ✅ Importar `tcc.sql` no phpMyAdmin
2. ✅ Verificar se tabela foi criada
3. ✅ Reiniciar backend (npm start)
4. ✅ Obter senha de app do Gmail
5. ✅ Salvar credenciais via API POST
6. ✅ Testar email

Está tudo pronto! 🚀
