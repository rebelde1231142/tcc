## ✅ BANCO DE DADOS MODIFICADO!

Pronto! Já coloquei a tabela de email no arquivo `tcc.sql`.

---

## 📊 O Que foi Adicionado?

Adicionei ao final do `tcc.sql`:

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

## 🚀 Próxima Ação: Importar no phpMyAdmin

### Jeito Rápido (3 passos):

1. **Abra phpMyAdmin**
   ```
   http://localhost/phpmyadmin
   ```

2. **Selecione banco "tcc"** → **Aba "Importar"**

3. **Escolha arquivo** → `tcc\extra\tcc.sql` → **Importar**

✅ **Pronto! Tabela criada automaticamente!**

---

## 📝 Verificar se Funcionou

Após importar:

1. Abra phpMyAdmin
2. Selecione banco "tcc"
3. Procure na lista: deve aparecer `ConfiguracaoEmail` ✅

---

## 🎯 Depois de Importar:

1. Reinicie backend: `npm start`
2. Obtenha senha de app do Gmail
3. Salve credenciais via API
4. Teste email

---

## 📍 Arquivo Modificado

📂 **`extra/tcc.sql`** - Adicionada tabela de email config

📄 **`extra/COMO_IMPORTAR_PHPMYADMIN.md`** - Guia de importação

---

**Pronto? Vá para phpMyAdmin e importe! 🚀**
