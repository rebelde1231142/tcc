-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           8.4.3 - MySQL Community Server - GPL
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para tcc
CREATE DATABASE IF NOT EXISTS `tcc` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `tcc`;

-- Copiando estrutura para tabela tcc.categoria
CREATE TABLE IF NOT EXISTS `categoria` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Nome` varchar(250) DEFAULT NULL,
  `Descricao` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela tcc.categoria: ~2 rows (aproximadamente)
INSERT INTO `categoria` (`Id`, `Nome`, `Descricao`) VALUES
	(1, 'Ds', 'itens de ds'),
	(2, 'Administração', 'itens em geral'),
	(3, 'Qui', 'Componentes do laboratório de quimica');
-- Copiando dados para a tabela tcc.saida: ~0 rows (aproximadamente)

-- Copiando dados para a tabela tcc.entrada: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela tcc.itens
CREATE TABLE IF NOT EXISTS `itens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `quantidade` int DEFAULT NULL,
  `descricao` varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `fk_Categoria_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_Categoria_id` (`fk_Categoria_id`),
  CONSTRAINT `itens_ibfk_1` FOREIGN KEY (`fk_Categoria_id`) REFERENCES `categoria` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela tcc.itens: ~3 rows (aproximadamente)
INSERT INTO `itens` (`id`, `nome`, `quantidade`, `descricao`, `fk_Categoria_id`) VALUES
	(32, 'Lampada 1', 1, 'lampada da sala 1', 2),
	(33, 'notebook 202', 1, 'notebook 2', 1),
	(36, 'béquer', 1, 'asasssasaas', 3);

-- Copiando estrutura para tabela tcc.perfil
CREATE TABLE IF NOT EXISTS `perfil` (
  `CPF` varchar(11) NOT NULL DEFAULT '',
  `Senha` int DEFAULT NULL,
  PRIMARY KEY (`CPF`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando dados para a tabela tcc.perfil: ~0 rows (aproximadamente)
INSERT INTO `perfil` (`CPF`, `Senha`) VALUES
	('52657628842', 1234);

-- Copiando estrutura para tabela tcc.entrada
CREATE TABLE IF NOT EXISTS `entrada` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_Itens_id` int DEFAULT NULL,
  `data` date DEFAULT NULL,
  `quantidade` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_Itens_id` (`fk_Itens_id`),
  CONSTRAINT `entrada_ibfk_1` FOREIGN KEY (`fk_Itens_id`) REFERENCES `itens` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Copiando estrutura para tabela tcc.saida
CREATE TABLE IF NOT EXISTS `saida` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_Itens_id` int DEFAULT NULL,
  `data` date DEFAULT NULL,
  `quantidade` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_Itens_id` (`fk_Itens_id`),
  CONSTRAINT `saida_ibfk_1` FOREIGN KEY (`fk_Itens_id`) REFERENCES `itens` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
