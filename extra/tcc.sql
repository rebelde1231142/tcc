-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Tempo de geração: 30/09/2025 às 11:38
-- Versão do servidor: 8.0.30
-- Versão do PHP: 8.3.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `tcc`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `categoria`
--

CREATE TABLE `categoria` (
  `Id` int NOT NULL,
  `Nome` varchar(250) DEFAULT NULL,
  `Descricao` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `categoria`
--

INSERT INTO `categoria` (`Id`, `Nome`, `Descricao`) VALUES
(1, 'Ds', 'itens de ds'),
(2, 'Administração', 'itens em geral'),
(3, 'Qui', 'Componentes do laboratório de quimica');

-- --------------------------------------------------------

--
-- Estrutura para tabela `entrada`
--

CREATE TABLE `entrada` (
  `id` int NOT NULL,
  `fk_Itens_id` int DEFAULT NULL,
  `data` date DEFAULT NULL,
  `quantidade` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `itens`
--

CREATE TABLE `itens` (
  `id` int NOT NULL,
  `nome` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `quantidade` int DEFAULT NULL,
  `descricao` varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `fk_Categoria_id` int DEFAULT NULL,
  `local` varchar(50) DEFAULT NULL,
  `dataAdicionado` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `itens`
--

INSERT INTO `itens` (`id`, `nome`, `quantidade`, `descricao`, `fk_Categoria_id`, `local`, `dataAdicionado`) VALUES
(4, 'ssd2', 20, 'armazenamento veloz sendo utilizado no laboratorio de informatica 2', 1, 'Sala de Aula', '2025-09-25'),
(5, 'béquer', 20, 'utensílio utiilizado e armazenado no laboratorio de quimica.', 3, 'Laboratório', '2025-09-26'),
(6, 'mapa mundi', 1, 'Mapa mundial utilizado nas aulas de geografia e historia.', 2, 'Sala de Aula', '2025-09-26'),
(7, 'panos', 50, 'Panos utilizados para realizar a limpeza da escola.', 2, 'Almoxarifado', '2025-09-26'),
(8, 'alice no pais das maravilhas', 1, 'livro novo', 2, 'Biblioteca', '2025-09-30');

-- --------------------------------------------------------

--
-- Estrutura para tabela `perfil`
--

CREATE TABLE `perfil` (
  `CPF` varchar(14) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Senha` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `perfil`
--

INSERT INTO `perfil` (`CPF`, `Email`, `Senha`) VALUES
('50316526336', 'fjberton@gmail.com', '$2b$10$DhKSmckghpCByA5qBr3QMu0KUbrgv9wwCvq3RKmgFI1k.kufw9piK'),
('52657628842', 'leonelbrenodasilvagithub@gmail.com', '$2b$10$b.AWwoBhboOIVLakWLZvluIyzrO8j.YKlxqBUPBNXECRrW9H8J2Le'),
('52657628846', 'leonelbrenodasilva@gmail.com', '$2b$10$4Ai3qKiqcdnAzd.b7E.rW.vdW2dmj5scjjNmoTHMt2fEKN77CQhu6');

-- --------------------------------------------------------

--
-- Estrutura para tabela `saida`
--

CREATE TABLE `saida` (
  `id` int NOT NULL,
  `fk_Itens_id` int DEFAULT NULL,
  `data` date DEFAULT NULL,
  `quantidade` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`Id`);

--
-- Índices de tabela `entrada`
--
ALTER TABLE `entrada`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_Itens_id` (`fk_Itens_id`);

--
-- Índices de tabela `itens`
--
ALTER TABLE `itens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_Categoria_id` (`fk_Categoria_id`);

--
-- Índices de tabela `perfil`
--
ALTER TABLE `perfil`
  ADD PRIMARY KEY (`CPF`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Índices de tabela `saida`
--
ALTER TABLE `saida`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_Itens_id` (`fk_Itens_id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `categoria`
--
ALTER TABLE `categoria`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `entrada`
--
ALTER TABLE `entrada`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `itens`
--
ALTER TABLE `itens`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `saida`
--
ALTER TABLE `saida`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `itens`
--
ALTER TABLE `itens`
  ADD CONSTRAINT `itens_ibfk_1` FOREIGN KEY (`fk_Categoria_id`) REFERENCES `categoria` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
