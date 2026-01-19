SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS `db_plapi_dev`;
USE `db_plapi_dev`;

-- Borramos tablas antiguas para limpiar
DROP TABLE IF EXISTS `pis`;
DROP TABLE IF EXISTS `professors`;
DROP TABLE IF EXISTS `alumnes`;
DROP TABLE IF EXISTS `centres`;

-- 1. Tabla CENTRES
CREATE TABLE `centres` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codi_centre` varchar(10) NOT NULL,
  `denominacio_completa` varchar(255) NOT NULL,
  `email_centre` varchar(100) DEFAULT NULL,
  `telefon` varchar(20) DEFAULT NULL,
  `nom_naturalesa` varchar(50) DEFAULT NULL,
  `codi_postal` varchar(10) DEFAULT NULL,
  `adreca` varchar(255) DEFAULT NULL,
  `nom_municipi` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 2. Tabla ALUMNES (Corregida: RALC es la Primary Key)
CREATE TABLE `alumnes` (
  `ralc` varchar(20) NOT NULL, -- Clave primaria tipo texto
  `nom` varchar(50) NOT NULL,
  `cognom` varchar(100) NOT NULL,
  `dni` varchar(15) NOT NULL,
  `data_naixement` date NOT NULL,
  `curs` varchar(20) NOT NULL,
  `grup` varchar(10) DEFAULT NULL,
  `centre_procedencia_id` int(11) NOT NULL DEFAULT '835',
  PRIMARY KEY (`ralc`), -- Definimos RALC como PK
  KEY `centre_procedencia_id` (`centre_procedencia_id`),
  CONSTRAINT `alumnes_ibfk_1` FOREIGN KEY (`centre_procedencia_id`) REFERENCES `centres` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 3. Tabla PROFESSORS
CREATE TABLE `professors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `centre_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `centre_id` (`centre_id`),
  CONSTRAINT `professors_ibfk_1` FOREIGN KEY (`centre_id`) REFERENCES `centres` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 4. Tabla PIS
CREATE TABLE `pis` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alumne_ralc` varchar(20) NOT NULL, -- CAMBIO IMPORTANTE: Ahora es varchar para coincidir con alumnes.ralc
  `professor_id` int(11), -- NOT NULL,
  
  -- Nuevos campos
  `dificultat` text COLLATE utf8mb4_general_ci,
  `gravetat` text COLLATE utf8mb4_general_ci,
  `justificacio` text COLLATE utf8mb4_general_ci,
  `proposta_educativa` text COLLATE utf8mb4_general_ci,
  `observacio` text COLLATE utf8mb4_general_ci,
  
  -- Campos originales
  `ruta_pdf` varchar(255) COLLATE utf8mb4_general_ci, -- NOT NULL,
  `data_creacio` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  KEY `alumne_ralc` (`alumne_ralc`),
  KEY `professor_id` (`professor_id`),
  
  -- Relaciones corregidas
  CONSTRAINT `pis_ibfk_1` FOREIGN KEY (`alumne_ralc`) REFERENCES `alumnes` (`ralc`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pis_ibfk_2` FOREIGN KEY (`professor_id`) REFERENCES `professors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SET foreign_key_checks = 1;