SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

USE `db_plapi_dev`;

SET NAMES utf8mb4;

INSERT INTO `alumnes` (`id`, `nom`, `cognom`, `ralc`, `dni`, `data_naixement`, `centre_procedencia_id`) VALUES
(1,	'Pepe',	'Lopez',	'111222333',	'22222222N',	'2000-01-01',	1);

INSERT INTO `centres` (`id`, `nom`, `codi`) VALUES
(1,	'Institut Pedralbes',	8001234);

INSERT INTO `pis` (`id`, `alumne_id`, `professor_id`, `estat`, `ruta_pdf`, `dades_ia`, `data_creacio`) VALUES
(1,	1,	1,	'pendent',	'documento.pdf',	'test',	'2025-12-17 09:26:08');

INSERT INTO `professors` (`id`, `nom`, `email`, `password`, `centre_id`) VALUES
(1,	'Manolo',	'manologarcia@institut.cat',	'1234',	1);

