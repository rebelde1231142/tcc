-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 25, 2025 at 12:29 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

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
-- Table structure for table `auditoria`
--

CREATE TABLE `auditoria` (
  `id` int NOT NULL,
  `dataHora` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cpf` varchar(20) DEFAULT NULL,
  `acao` varchar(50) NOT NULL,
  `recurso` varchar(50) NOT NULL,
  `referencia` varchar(100) DEFAULT NULL,
  `grupo` varchar(100) DEFAULT NULL,
  `itemId` int DEFAULT NULL,
  `detalhes` json DEFAULT NULL,
  `endpoint` varchar(120) DEFAULT NULL,
  `ip` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `auditoria`
--

INSERT INTO `auditoria` (`id`, `dataHora`, `cpf`, `acao`, `recurso`, `referencia`, `grupo`, `itemId`, `detalhes`, `endpoint`, `ip`) VALUES
(1, '2025-10-16 14:19:12', NULL, 'deletar-grupo', 'item', 'PenDrive', 'PenDrive', NULL, '{\"grupo\": \"PenDrive\", \"qtdRemovida\": 1}', '/api/itens/grupo/PenDrive', '::1'),
(2, '2025-10-17 11:35:33', NULL, 'criar', 'item', 'Panos', 'Panos', NULL, '{\"nome\": \"Panos\", \"unidades\": [{\"local\": \"Almoxarifado\", \"estado\": \"em uso\"}], \"descricao\": \"utilizados na limpeza\", \"quantidade\": 1, \"fk_Categoria_id\": \"2\"}', '/api/itens', '::1'),
(3, '2025-10-20 19:53:24', '52657628842', 'criar', 'item', 'Alice no Pais das Maravilhas', 'Alice no Pais das Maravilhas', NULL, '{\"nome\": \"Alice no Pais das Maravilhas\", \"unidades\": null, \"descricao\": \"Livro novo\", \"quantidade\": 1, \"fk_Categoria_id\": 2}', '/api/itens', '::1'),
(4, '2025-10-20 19:53:43', '52657628842', 'editar', 'item', '45', 'Alice no Pais das Maravilhas', 45, '{\"antes\": {\"id\": 45, \"nome\": \"Alice no Pais das Maravilhas\", \"local\": null, \"estado\": null, \"descricao\": \"Livro novo\", \"quantidade\": 1, \"dataAdicionado\": \"2025-10-20T03:00:00.000Z\", \"fk_Categoria_id\": 2}, \"alteracoes\": {\"local\": \"Biblioteca\", \"estado\": \"em uso\"}}', '/api/itens/45', '::1'),
(5, '2025-10-20 20:11:17', NULL, 'editar', 'item', '33', 'Béquer', 33, '{\"antes\": {\"id\": 33, \"nome\": \"Béquer\", \"local\": \"Laboratório de Quimica\", \"estado\": \"em uso\", \"descricao\": \"Utensílio utiilizado e armazenado no laboratorio de quimica.\", \"quantidade\": 1, \"dataAdicionado\": \"2025-10-16T03:00:00.000Z\", \"fk_Categoria_id\": 3}, \"alteracoes\": {\"local\": \"Laboratório de Quimica\", \"estado\": \"parado\"}}', '/api/itens/33', '::1'),
(6, '2025-10-20 21:09:46', '52657628842', 'editar', 'item', '5', 'Béquer', 5, '{\"antes\": {\"id\": 5, \"nome\": \"Béquer\", \"local\": \"Laboratório de Quimica\", \"estado\": \"parado\", \"descricao\": \"Utensílio utiilizado e armazenado no laboratorio de quimica.\", \"quantidade\": 20, \"dataAdicionado\": \"2025-09-26T03:00:00.000Z\", \"fk_Categoria_id\": 3}, \"alteracoes\": {\"local\": \"Laboratório de Quimica\", \"estado\": \"em uso\"}}', '/api/itens/5', '::1'),
(7, '2025-10-20 21:11:28', '52657628846', 'editar', 'item', '6', 'Mapa Mundi', 6, '{\"antes\": {\"id\": 6, \"nome\": \"Mapa Mundi\", \"local\": \"Sala de Aula\", \"estado\": \"em uso\", \"descricao\": \"Mapa mundial utilizado nas aulas de geografia e historia.\", \"quantidade\": 1, \"dataAdicionado\": \"2025-09-26T03:00:00.000Z\", \"fk_Categoria_id\": 2}, \"alteracoes\": {\"local\": \"Sala de Aula\", \"estado\": \"parado\"}}', '/api/itens/6', '::1'),
(8, '2025-10-20 21:12:29', '52657628846', 'renomear-grupo', 'item', 'Mapa Mundi -> Mapa-Mundi', 'Mapa-Mundi', NULL, '{\"novoNome\": \"Mapa-Mundi\", \"antigoNome\": \"Mapa Mundi\"}', '/api/grupos/renomear', '::1'),
(9, '2025-10-21 19:02:03', '52657628846', 'renomear-grupo', 'item', 'Béquer -> Béquer1', 'Béquer1', NULL, '{\"novoNome\": \"Béquer1\", \"antigoNome\": \"Béquer\"}', '/api/grupos/renomear', '::1'),
(10, '2025-10-21 19:02:27', '52657628846', 'renomear-grupo', 'item', 'Béquer1 -> Béquer', 'Béquer', NULL, '{\"novoNome\": \"Béquer\", \"antigoNome\": \"Béquer1\"}', '/api/grupos/renomear', '::1'),
(11, '2025-11-13 14:03:45', NULL, 'criar', 'item', 'mdf', 'mdf', NULL, '{\"nome\": \"mdf\", \"unidades\": [{\"local\": \"Sala de Armazenamento Técnico\", \"estado\": \"parado\"}, {\"local\": \"Sala de Armazenamento Técnico\", \"estado\": \"parado\"}, {\"local\": \"Sala de Armazenamento Técnico\", \"estado\": \"quebrado\"}], \"descricao\": \"estruturas para corte\", \"quantidade\": 3, \"fk_Categoria_id\": \"2\"}', '/api/itens', '::1'),
(12, '2025-11-13 14:04:10', NULL, 'renomear-grupo', 'item', 'mdf -> mdfs', 'mdfs', NULL, '{\"novoNome\": \"mdfs\", \"antigoNome\": \"mdf\"}', '/api/grupos/renomear', '::1'),
(13, '2025-11-13 14:05:20', NULL, 'renomear-grupo', 'item', 'mdfs -> MDF', 'MDF', NULL, '{\"novoNome\": \"MDF\", \"antigoNome\": \"mdfs\"}', '/api/grupos/renomear', '::1'),
(14, '2025-11-13 14:05:32', NULL, 'editar', 'item', '46', 'MDF', 46, '{\"antes\": {\"id\": 46, \"nome\": \"MDF\", \"local\": \"Sala de Armazenamento Técnico\", \"estado\": \"parado\", \"descricao\": \"estruturas para corte\", \"quantidade\": 1, \"dataAdicionado\": \"2025-11-13T03:00:00.000Z\", \"fk_Categoria_id\": 2}, \"alteracoes\": {\"local\": \"Sala de Armazenamento Técnico\", \"estado\": \"em uso\"}}', '/api/itens/46', '::1'),
(15, '2025-11-13 14:18:24', NULL, 'deletar-grupo', 'item', 'MDF', 'MDF', NULL, '{\"grupo\": \"MDF\", \"qtdRemovida\": 3}', '/api/itens/grupo/MDF', '::1'),
(16, '2025-11-13 14:28:37', NULL, 'renomear-grupo', 'item', 'Alice no Pais das Maravilhas -> Alice no Pais das Kengas', 'Alice no Pais das Kengas', NULL, '{\"novoNome\": \"Alice no Pais das Kengas\", \"antigoNome\": \"Alice no Pais das Maravilhas\"}', '/api/grupos/renomear', '::1'),
(17, '2025-11-13 14:29:05', NULL, 'renomear-grupo', 'item', 'Alice no Pais das Kengas -> Alice no Pais das MAravilhas', 'Alice no Pais das MAravilhas', NULL, '{\"novoNome\": \"Alice no Pais das MAravilhas\", \"antigoNome\": \"Alice no Pais das Kengas\"}', '/api/grupos/renomear', '::1'),
(18, '2025-11-13 14:29:12', NULL, 'renomear-grupo', 'item', 'Alice no Pais das MAravilhas -> Alice no Pais das Mravilhas', 'Alice no Pais das Mravilhas', NULL, '{\"novoNome\": \"Alice no Pais das Mravilhas\", \"antigoNome\": \"Alice no Pais das MAravilhas\"}', '/api/grupos/renomear', '::1'),
(19, '2025-11-13 14:29:18', NULL, 'renomear-grupo', 'item', 'Alice no Pais das Mravilhas -> Alice no Pais das Maravilhas', 'Alice no Pais das Maravilhas', NULL, '{\"novoNome\": \"Alice no Pais das Maravilhas\", \"antigoNome\": \"Alice no Pais das Mravilhas\"}', '/api/grupos/renomear', '::1');

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

--
-- Dumping data for table `entrada`
--

INSERT INTO `entrada` (`id`, `fk_Itens_id`, `data`, `quantidade`) VALUES
(1, 44, '2025-10-17', 1),
(2, 45, '2025-10-20', 1),
(3, 46, '2025-11-13', 1),
(4, 47, '2025-11-13', 1),
(5, 48, '2025-11-13', 1);

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
(5, 'Béquer', 20, 'Utensílio utiilizado e armazenado no laboratorio de quimica.', 3, 'Laboratório de Quimica', '2025-09-26', 'em uso'),
(6, 'Mapa-Mundi', 1, 'Mapa mundial utilizado nas aulas de geografia e historia.', 2, 'Sala de Aula', '2025-09-26', 'parado'),
(9, 'ESP-32', 20, 'USado nas aulas de sistemas embarcados', 1, 'Sala de Armazenamento Técnico', '2025-10-01', 'em uso'),
(10, 'HaspBerry', 20, 'Usado nas aulas de sitemas embarcados', 1, 'Sala de Armazenamento Técnico', '2025-10-01', 'em uso'),
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
(32, 'Alice no Pais das Maravilhas', 1, 'Livro novo', 2, 'Biblioteca', '2025-10-14', 'parado'),
(33, 'Béquer', 1, 'Utensílio utiilizado e armazenado no laboratorio de quimica.', 3, 'Laboratório de Quimica', '2025-10-16', 'parado'),
(34, 'Béquer', 1, 'Utensílio utiilizado e armazenado no laboratorio de quimica.', 3, 'Laboratório de Quimica', '2025-10-16', 'parado'),
(35, 'Béquer', 1, 'Utensílio utiilizado e armazenado no laboratorio de quimica.', 3, 'Laboratório de Quimica', '2025-10-16', 'parado'),
(36, 'Béquer', 1, 'Utensílio utiilizado e armazenado no laboratorio de quimica.', 3, 'Laboratório de Quimica', '2025-10-16', 'quebrado'),
(37, 'Béquer', 1, 'Utensílio utiilizado e armazenado no laboratorio de quimica.', 3, 'Laboratório de Quimica', '2025-10-16', 'quebrado'),
(38, 'Béquer', 1, 'Utensílio utiilizado e armazenado no laboratorio de quimica.', 3, 'Laboratório de Quimica', '2025-10-16', 'quebrado'),
(39, 'Béquer', 1, 'Utensílio utiilizado e armazenado no laboratorio de quimica.', 3, 'Laboratório de Quimica', '2025-10-16', 'parado'),
(40, 'Béquer', 1, 'Utensílio utiilizado e armazenado no laboratorio de quimica.', 3, 'Laboratório de Quimica', '2025-10-16', 'quebrado'),
(41, 'Béquer', 1, 'Utensílio utiilizado e armazenado no laboratorio de quimica.', 3, 'Laboratório de Quimica', '2025-10-16', 'parado'),
(42, 'Béquer', 1, 'Utensílio utiilizado e armazenado no laboratorio de quimica.', 3, 'Laboratório de Quimica', '2025-10-16', 'em uso'),
(43, 'Béquer', 1, 'Utensílio utiilizado e armazenado no laboratorio de quimica.', 3, 'Laboratório de Quimica', '2025-10-16', 'em uso'),
(44, 'Panos', 1, 'utilizados na limpeza', 2, 'Almoxarifado', '2025-10-17', 'em uso'),
(45, 'Alice no Pais das Maravilhas', 1, 'Livro novo', 2, 'Biblioteca', '2025-10-20', 'em uso');

-- --------------------------------------------------------

--
-- Table structure for table `perfil`
--

CREATE TABLE `perfil` (
  `CPF` varchar(14) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Senha` varchar(255) NOT NULL,
  `nivel` varchar(30) NOT NULL DEFAULT 'aluno',
  `area` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
-- Dumping data for table `saida`
--

INSERT INTO `saida` (`id`, `fk_Itens_id`, `data`, `quantidade`) VALUES
(1, 15, '2025-10-16', 1),
(2, 7, '2025-10-17', 1),
(3, 46, '2025-11-13', 1),
(4, 47, '2025-11-13', 1),
(5, 48, '2025-11-13', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auditoria`
--
ALTER TABLE `auditoria`
  ADD PRIMARY KEY (`id`);

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
-- AUTO_INCREMENT for table `auditoria`
--
ALTER TABLE `auditoria`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `categoria`
--
ALTER TABLE `categoria`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `entrada`
--
ALTER TABLE `entrada`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `itens`
--
ALTER TABLE `itens`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `saida`
--
ALTER TABLE `saida`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
