-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 15, 2025 at 12:27 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tcc`
--

-- --------------------------------------------------------

--
-- Table structure for table `categoria`
--

CREATE TABLE `categoria` (
  `Id` int NOT NULL,
  `Nome` varchar(250) DEFAULT NULL,
  `Descricao` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categoria`
--

INSERT INTO `categoria` (`Id`, `Nome`, `Descricao`) VALUES
(1, 'Ds', 'itens de ds'),
(2, 'Administração', 'itens em geral'),
(3, 'Qui', 'Componentes do laboratório de quimica');

-- --------------------------------------------------------

--
-- Table structure for table `entrada`
--

CREATE TABLE `entrada` (
  `id` int NOT NULL,
  `fk_Itens_id` int DEFAULT NULL,
  `data` date DEFAULT NULL,
  `quantidade` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `itens`
--

CREATE TABLE `itens` (
  `id` int NOT NULL,
  `nome` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `quantidade` int DEFAULT NULL,
  `descricao` varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `fk_Categoria_id` int DEFAULT NULL,
  `local` varchar(50) DEFAULT NULL,
  `dataAdicionado` date DEFAULT NULL,
  `estado` enum('em uso','quebrado','parado') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `itens`
--

INSERT INTO `itens` (`id`, `nome`, `quantidade`, `descricao`, `fk_Categoria_id`, `local`, `dataAdicionado`, `estado`) VALUES
(4, 'Ssd', 20, 'Armazenamento veloz sendo utilizado no laboratorio de informatica 2', 1, 'Sala de Armazenamento Técnico', '2025-09-25', 'em uso'),
(5, 'Béquer', 20, 'Utensílio utiilizado e armazenado no laboratorio de quimica.', 3, 'Laboratório de Quimica', '2025-09-26', 'parado'),
(6, 'Mapa Mundi', 1, 'Mapa mundial utilizado nas aulas de geografia e historia.', 2, 'Sala de Aula', '2025-09-26', 'em uso'),
(7, 'Panos', 50, 'Panos utilizados para realizar a limpeza da escola.', 2, 'Almoxarifado', '2025-09-26', 'parado'),
(9, 'ESP-32', 20, 'USado nas aulas de sistemas embarcados', 1, 'Sala de Armazenamento Técnico', '2025-10-01', 'em uso'),
(10, 'HaspBerry', 20, 'Usado nas aulas de sitemas embarcados', 1, 'Sala de Armazenamento Técnico', '2025-10-01', 'em uso'),
(15, 'PenDrive', 12, 'armazenamento util', 1, 'Sala de Armazenamento Técnico', '2025-10-08', 'parado'),
(17, 'Tvs', 1, 'Aparelho televisorio', 2, 'Sala de Aula', '2025-10-14', 'parado'),
(18, 'Tvs', 1, 'Aparelho televisorio', 2, 'Sala de Aula', '2025-10-14', 'em uso'),
(19, 'Tvs', 1, 'Aparelho televisorio', 2, 'Sala de Aula', '2025-10-14', 'em uso'),
(20, 'Tvs', 1, 'Aparelho televisorio', 2, 'Sala de Aula', '2025-10-14', 'em uso'),
(21, 'Tvs', 1, 'Aparelho televisorio', 2, 'Sala de Aula', '2025-10-14', 'em uso'),
(22, 'Tvs', 1, 'Aparelho televisorio', 2, 'Sala de Aula', '2025-10-14', 'em uso'),
(23, 'Tvs', 1, 'Aparelho televisorio', 2, 'Sala de Aula', '2025-10-14', 'em uso'),
(24, 'Tvs', 1, 'Aparelho televisorio', 2, 'Sala de Aula', '2025-10-14', 'em uso'),
(25, 'Tvs', 1, 'Aparelho televisorio', 2, 'Sala de Aula', '2025-10-14', 'em uso'),
(26, 'Tvs', 1, 'Aparelho televisorio', 2, 'Sala de Armazenamento Técnico', '2025-10-14', 'em uso'),
(27, 'Tvs', 1, 'Aparelho televisorio', 2, 'Laboratório de Informática', '2025-10-14', 'em uso'),
(28, 'Tvs', 1, 'Aparelho televisorio', 2, 'Laboratório de Informática 2', '2025-10-14', 'em uso'),
(29, 'Alice no Pais das Maravilhas', 1, 'Livro novo', 2, 'Biblioteca', '2025-10-14', 'parado'),
(30, 'Alice no Pais das Maravilhas', 1, 'Livro novo', 2, 'Biblioteca', '2025-10-14', 'parado'),
(31, 'Alice no Pais das Maravilhas', 1, 'Livro novo', 2, 'Biblioteca', '2025-10-14', 'parado'),
(32, 'Alice no Pais das Maravilhas', 1, 'Livro novo', 2, 'Biblioteca', '2025-10-14', 'parado');

-- --------------------------------------------------------

--
-- Table structure for table `perfil`
--

CREATE TABLE `perfil` (
  `CPF` varchar(14) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Senha` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `perfil`
--

INSERT INTO `perfil` (`CPF`, `Email`, `Senha`) VALUES
('50316526336', 'fjberton@gmail.com', '$2b$10$DhKSmckghpCByA5qBr3QMu0KUbrgv9wwCvq3RKmgFI1k.kufw9piK'),
('52657628842', 'leonelbrenodasilvagithub@gmail.com', '$2b$10$b.AWwoBhboOIVLakWLZvluIyzrO8j.YKlxqBUPBNXECRrW9H8J2Le'),
('52657628846', 'leonelbrenodasilva@gmail.com', '$2b$10$y9XjPD8SEMtzsWSEijq0Y.VVEBs6k/Z6uXmV.d3CIfFcA7I6IrOEC');

-- --------------------------------------------------------

--
-- Table structure for table `saida`
--

CREATE TABLE `saida` (
  `id` int NOT NULL,
  `fk_Itens_id` int DEFAULT NULL,
  `data` date DEFAULT NULL,
  `quantidade` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `entrada`
--
ALTER TABLE `entrada`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_Itens_id` (`fk_Itens_id`);

--
-- Indexes for table `itens`
--
ALTER TABLE `itens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_Categoria_id` (`fk_Categoria_id`);

--
-- Indexes for table `perfil`
--
ALTER TABLE `perfil`
  ADD PRIMARY KEY (`CPF`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indexes for table `saida`
--
ALTER TABLE `saida`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_Itens_id` (`fk_Itens_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categoria`
--
ALTER TABLE `categoria`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `entrada`
--
ALTER TABLE `entrada`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `itens`
--
ALTER TABLE `itens`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `saida`
--
ALTER TABLE `saida`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `itens`
--
ALTER TABLE `itens`
  ADD CONSTRAINT `itens_ibfk_1` FOREIGN KEY (`fk_Categoria_id`) REFERENCES `categoria` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
