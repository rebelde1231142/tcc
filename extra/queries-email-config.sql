-- ==========================================
-- CONFIGURAÇÃO DE EMAIL
-- Sistema de Gerenciamento Dinâmico
-- ==========================================

-- 1. Criar tabela (execute uma vez)
CREATE TABLE IF NOT EXISTS ConfiguracaoEmail (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  senha VARCHAR(255) NOT NULL,
  ativo TINYINT(1) DEFAULT 1,
  dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  dataAtualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_ativo (ativo),
  INDEX idx_dataCriacao (dataCriacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Exemplos de INSERT (escolha um)

-- Exemplo 1: Gmail com senha de app (RECOMENDADO)
INSERT INTO ConfiguracaoEmail (email, senha, ativo) 
VALUES ('seu-email@gmail.com', 'sua-senha-de-app-sem-espacos', 1);

-- Exemplo 2: Outros provedores de email
-- INSERT INTO ConfiguracaoEmail (email, senha, ativo) 
-- VALUES ('seu-email@outlook.com', 'sua-senha', 1);

-- Exemplo 3: Email corporativo
-- INSERT INTO ConfiguracaoEmail (email, senha, ativo) 
-- VALUES ('noreply@seudominio.com', 'sua-senha', 1);

-- 3. Queries úteis

-- Listar todas as configurações:
SELECT * FROM ConfiguracaoEmail;

-- Listar apenas a ativa:
SELECT * FROM ConfiguracaoEmail WHERE ativo = 1;

-- Contar quantas configurações existem:
SELECT COUNT(*) as total FROM ConfiguracaoEmail;

-- Atualizar para desativado (sem deletar):
UPDATE ConfiguracaoEmail SET ativo = 0 WHERE id = 1;

-- Atualizar email mantendo ID:
UPDATE ConfiguracaoEmail SET email = 'novo-email@gmail.com' WHERE id = 1;

-- Atualizar senha:
UPDATE ConfiguracaoEmail SET senha = 'nova-senha' WHERE id = 1;

-- Deletar configuração:
DELETE FROM ConfiguracaoEmail WHERE id = 1;

-- Deletar todas (cuidado!):
DELETE FROM ConfiguracaoEmail;

-- Ver última atualização:
SELECT *, DATE_FORMAT(dataAtualizacao, '%d/%m/%Y %H:%i:%s') as ultima_atualizacao 
FROM ConfiguracaoEmail 
ORDER BY dataAtualizacao DESC;

-- Ver histórico (se ativar auditoria):
SELECT email, ativo, dataCriacao, dataAtualizacao 
FROM ConfiguracaoEmail 
ORDER BY dataAtualizacao DESC;

-- 4. Backup da configuração
-- USE ANTES DE DELETAR ACIDENTALMENTE:
-- CREATE TABLE ConfiguracaoEmailBackup AS 
-- SELECT * FROM ConfiguracaoEmail WHERE id = 1;

-- 5. Teste de integridade
SELECT 
  id,
  SUBSTRING(email, 1, 10) AS 'Email (primeiros 10)' ,
  CHAR_LENGTH(senha) AS 'Tamanho senha',
  IF(ativo = 1, 'ATIVA ✅', 'INATIVA ❌') AS Status,
  dataCriacao,
  dataAtualizacao
FROM ConfiguracaoEmail;

-- 6. Limpeza de dados sensíveis (NÃO DELETE ACIDENTALMENTE)
-- ⚠️ Executar apenas se sabe o que está fazendo:
-- UPDATE ConfiguracaoEmail SET senha = '[DELETADO]' WHERE id = 1;

-- ==========================================
-- INSTRUÇÕES DE USO
-- ==========================================

/*
PASSO 1: Criar a tabela
- Copie e execute a linha de CREATE TABLE acima

PASSO 2: Inserir credenciais (escolha um exemplo)
- Use Gmail com senha de app (RECOMENDADO)
- Obtenha a senha em: https://myaccount.google.com/apppasswords
- Remova os espaços: "xyzq dcba" → "xyzqdcba"

PASSO 3: Verificar inserção
- Execute: SELECT * FROM ConfiguracaoEmail;
- Deve aparecer uma linha com seus dados

PASSO 4: Usar na aplicação
- O backend buscará automaticamente
- Nenhuma mudança no código necessária

PASSO 5: Atualizar credenciais (sem reiniciar!)
- Atualize direto no banco ou via API POST
- O email funcionará imediatamente

*/

-- ==========================================
-- TROUBLESHOOTING
-- ==========================================

-- ❓ Sem credenciais configuradas?
-- Resposta: "Credenciais de email não configuradas no banco de dados"
SELECT * FROM ConfiguracaoEmail;

-- ❓ Preciso saber o ID?
-- Resposta: Execute SELECT * para ver o ID

-- ❓ Email inativo?
-- Resposta: Execute "UPDATE ConfiguracaoEmail SET ativo = 1 WHERE id = 1"

-- ❓ Sensor de senha incorreta?
-- Resposta: Use senha de app, não a senha real da conta Google

-- ❓ Quer voltar atrás?
-- Resposta: SELECT * FROM ConfiguracaoEmailBackup (se criado anteriormente)
