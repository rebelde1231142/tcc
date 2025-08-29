-- Criação do banco de dados completo com email
DROP DATABASE IF EXISTS tcc;
CREATE DATABASE tcc;
USE tcc;

-- Tabela categoria
CREATE TABLE categoria (
  Id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Nome varchar(250) DEFAULT NULL,
  Descricao varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela itens
CREATE TABLE itens (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  quantidade int DEFAULT NULL,
  descricao varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  fk_Categoria_id int DEFAULT NULL,
  KEY fk_Categoria_id (fk_Categoria_id),
  CONSTRAINT itens_ibfk_1 FOREIGN KEY (fk_Categoria_id) REFERENCES categoria (Id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela Perfil (agora com email)
CREATE TABLE Perfil (
  CPF varchar(14) NOT NULL PRIMARY KEY,
  Email varchar(255) NOT NULL UNIQUE,
  Senha varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela entrada
CREATE TABLE entrada (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  fk_Itens_id int DEFAULT NULL,
  data date DEFAULT NULL,
  quantidade int DEFAULT NULL,
  KEY fk_Itens_id (fk_Itens_id),
  CONSTRAINT entrada_ibfk_1 FOREIGN KEY (fk_Itens_id) REFERENCES itens (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela saida
CREATE TABLE saida (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  fk_Itens_id int DEFAULT NULL,
  data date DEFAULT NULL,
  quantidade int DEFAULT NULL,
  KEY fk_Itens_id (fk_Itens_id),
  CONSTRAINT saida_ibfk_1 FOREIGN KEY (fk_Itens_id) REFERENCES itens (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Inserts de exemplo
INSERT INTO categoria (Id, Nome, Descricao) VALUES
  (1, 'Ds', 'itens de ds'),
  (2, 'Administração', 'itens em geral'),
  (3, 'Qui', 'Componentes do laboratório de quimica');

INSERT INTO itens (id, nome, quantidade, descricao, fk_Categoria_id) VALUES
  (32, 'Lampada 1', 1, 'lampada da sala 1', 2),
  (33, 'notebook 202', 1, 'notebook 2', 1),
  (36, 'béquer', 1, 'asasssasaas', 3),
  (40, 'ssd', 12, 'safsdfsdfs', 1),
  (42, 'alura', 134, 'egfdgfgdfgfd', 2),
  (44, 'uber', 40, 'adm chorão', 2),
  (45, 'agua', 20, 'sgfsdgfsdg', 3),
  (46, 'pedra', 20, '20 kilos de pedra', 3),
  (47, 'clash', 12, 'sfgdgdfgfd', 1);

-- Exemplo de insert de usuário (senha deve ser hash, não número)
-- INSERT INTO Perfil (CPF, Email, Senha) VALUES ('52657628842', 'teste@email.com', '$2b$10$hash...');
