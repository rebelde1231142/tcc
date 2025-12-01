-- Criar tabela de configuração de email
CREATE TABLE IF NOT EXISTS ConfiguracaoEmail (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  senha VARCHAR(255) NOT NULL,
  ativo TINYINT(1) DEFAULT 1,
  dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  dataAtualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Exemplo de como inserir as credenciais (execute manualmente após criar a tabela):
-- INSERT INTO ConfiguracaoEmail (email, senha, ativo) 
-- VALUES ('seu-email@gmail.com', 'sua-senha-de-app', 1);
