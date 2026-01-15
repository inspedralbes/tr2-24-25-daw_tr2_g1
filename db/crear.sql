SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

USE `db_plapi_dev`;

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `pis`;
DROP TABLE IF EXISTS `professors`;
DROP TABLE IF EXISTS `alumnes`;
DROP TABLE IF EXISTS `centres`;

CREATE TABLE `centres` (
  `id` int NOT NULL AUTO_INCREMENT, /*no hace falta*/
  `codi_centre` varchar(10) NOT NULL,
  `denominacio_completa` varchar(255) NOT NULL,
  `email_centre` varchar(100),
  `telefon` varchar(20),
  `nom_naturalesa` varchar(50),
  `codi_postal` varchar(10),
  `adreca` varchar(255),
  `nom_municipi` varchar(100),
  PRIMARY KEY (`id`) /*sustituir la primary key y la relacion*/
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `alumnes` (
  `id` int NOT NULL AUTO_INCREMENT, /*no hace falta*/
  `nom` varchar(50) NOT NULL,
  `cognom` varchar(100) NOT NULL,
  `ralc` varchar(20) NOT NULL, /*en primer lugar*/
  `dni` varchar(15) NOT NULL,
  `data_naixement` date NOT NULL,
  `centre_procedencia_id` int NOT NULL DEFAULT '835',
  /*añadir curso*/
  /*añadir grupo*/
  PRIMARY KEY (`id`),
  KEY `centre_procedencia_id` (`centre_procedencia_id`),
  CONSTRAINT `alumnes_ibfk_1` FOREIGN KEY (`centre_procedencia_id`) REFERENCES `centres` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `professors` (
  `id` int NOT NULL AUTO_INCREMENT, 
  `nom` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `centre_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `centre_id` (`centre_id`),
  CONSTRAINT `professors_ibfk_1` FOREIGN KEY (`centre_id`) REFERENCES `centres` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `pis` (
  `id` int NOT NULL AUTO_INCREMENT, 
  `alumne_id` int NOT NULL, /*el del ralc*/
  `professor_id` int NOT NULL, 
  `estat` varchar(20) NOT NULL, 
  `ruta_pdf` varchar(255) NOT NULL,
  `dades_ia` longtext NOT NULL,
  `data_creacio` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `alumne_id` (`alumne_id`),
  KEY `professor_id` (`professor_id`),
  CONSTRAINT `pis_ibfk_1` FOREIGN KEY (`alumne_id`) REFERENCES `alumnes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pis_ibfk_2` FOREIGN KEY (`professor_id`) REFERENCES `professors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*arreglar las relaciones de la tabla pis*/