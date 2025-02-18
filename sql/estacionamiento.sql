CREATE DATABASE  IF NOT EXISTS `estacionamiento-alt` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `estacionamiento-alt`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: estacionamiento-alt
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `lugares`
--

DROP TABLE IF EXISTS `lugares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lugares` (
  `id_lugar` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(45) NOT NULL,
  `ocupado` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_lugar`),
  UNIQUE KEY `id_lugar_UNIQUE` (`id_lugar`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lugares`
--

LOCK TABLES `lugares` WRITE;
/*!40000 ALTER TABLE `lugares` DISABLE KEYS */;
INSERT INTO `lugares` VALUES (1,'Lugar 1',0),(2,'Lugar 2',0),(3,'Lugar 3',0),(4,'Lugar 4',0);
/*!40000 ALTER TABLE `lugares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registros`
--

DROP TABLE IF EXISTS `registros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registros` (
  `id_registro` int NOT NULL AUTO_INCREMENT,
  `id_lugar` int NOT NULL,
  `matricula` varchar(20) NOT NULL,
  `cliente` varchar(100) NOT NULL,
  `inicio` datetime NOT NULL,
  `fin` datetime DEFAULT NULL,
  `id_tarifa` int NOT NULL,
  `precio_final` float DEFAULT NULL,
  PRIMARY KEY (`id_registro`),
  UNIQUE KEY `id_registro_UNIQUE` (`id_registro`),
  KEY `registros_ibfk_1` (`id_lugar`),
  KEY `registros_ibfk_3` (`id_tarifa`),
  CONSTRAINT `registros_ibfk_1` FOREIGN KEY (`id_lugar`) REFERENCES `lugares` (`id_lugar`),
  CONSTRAINT `registros_ibfk_3` FOREIGN KEY (`id_tarifa`) REFERENCES `tarifas` (`id_tarifa`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registros`
--

LOCK TABLES `registros` WRITE;
/*!40000 ALTER TABLE `registros` DISABLE KEYS */;
INSERT INTO `registros` VALUES (33,1,'AAA 123','Nacho','2024-11-26 18:06:04','2024-11-26 19:46:48',7,400),(34,2,'AAA 123','Nacho','2024-11-26 19:46:48','2024-11-26 19:47:04',7,400),(35,3,'AAA 123','Nacho','2024-11-26 19:47:04','2024-11-26 19:47:12',7,400),(36,2,'CCC 123','Nacho','2024-11-28 15:59:19','2024-11-28 16:28:29',7,400),(37,2,'DDD 123','Nacho','2024-11-28 16:56:46','2024-11-28 16:58:40',10,250),(38,1,'DDD 123','Nacho','2024-11-28 16:58:47','2024-11-28 16:59:27',10,500),(39,3,'DDD 123','Nacho','2024-11-28 16:59:26','2024-11-28 16:59:41',7,400),(40,2,'DDD 123','Nacho','2024-11-28 16:59:41','2024-11-28 17:14:50',7,400),(41,1,'DDD 123','Nacho','2024-11-28 17:14:50','2024-11-28 17:21:06',8,15000),(42,2,'FRE 456','Gaspar','2024-11-28 17:37:43','2024-11-28 17:37:59',13,20),(43,2,'FRE 456','Gaspar','2024-11-28 17:38:07','2024-11-28 17:40:19',13,10),(44,3,'KLK 450','Nacho','2024-11-28 17:48:33','2024-11-28 17:49:14',7,800),(45,2,'ASW 236','Gaspar','2024-11-28 18:08:24','2024-11-28 18:08:36',14,10),(46,2,'SEG 123','Franco','2024-11-28 19:36:54','2024-11-28 19:37:54',14,10),(47,2,'DSA 123','Alejandro','2024-11-28 20:30:59','2024-11-28 20:31:15',14,20),(48,3,'FAS 241','Franco','2024-11-28 20:31:08','2024-11-28 20:31:16',14,20),(49,2,'XCA 123','Alejandro','2024-11-28 21:01:44','2024-11-28 21:02:01',13,20),(50,3,'GSW 231','Franco','2024-11-28 21:01:50','2024-11-28 21:01:59',13,10);
/*!40000 ALTER TABLE `registros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarifas`
--

DROP TABLE IF EXISTS `tarifas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarifas` (
  `id_tarifa` int NOT NULL AUTO_INCREMENT,
  `tipo_tarifa` varchar(50) NOT NULL,
  `precio` float NOT NULL,
  PRIMARY KEY (`id_tarifa`),
  UNIQUE KEY `id_tarifa_UNIQUE` (`id_tarifa`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarifas`
--

LOCK TABLES `tarifas` WRITE;
/*!40000 ALTER TABLE `tarifas` DISABLE KEYS */;
INSERT INTO `tarifas` VALUES (7,'Auto p/día',400),(8,'Auto p/mes',15000),(10,'Moto p/día',250),(13,'Moto p/hora',10),(14,'Auto p/minuto',10);
/*!40000 ALTER TABLE `tarifas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(80) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `password` varchar(80) NOT NULL,
  `superusuario` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `id_usuario_UNIQUE` (`id_usuario`),
  UNIQUE KEY `telefono_UNIQUE` (`telefono`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (19,'Usuario','Comun','ejemplo@gmail.com','3804666606','$2b$10$dGfSnIqz7MuOa2sUcVpAveyzygtO9BD6QxJ5BPhCBvRvCgCHuXVDi',0),(20,'Admin','Admin','admin@gmail.com','3804442366','$2b$10$WCijsEVjWdRw7QkNBINd/uG4zD0voabbSgBIWGatvQfjM2sy/ewCy',1),(23,'Taric','Soporte','riotgames@gmail.com','3804534224','$2b$10$mSL4qaxsM.dNuxUykLZLvec1z1FvGQrfQ4CVDuuRjvYKaHbivtN4K',1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehiculos`
--

DROP TABLE IF EXISTS `vehiculos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehiculos` (
  `id_vehiculo` int NOT NULL AUTO_INCREMENT,
  `matricula` varchar(20) NOT NULL,
  `id_tipo_vehiculo` int NOT NULL,
  `estacionado` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_vehiculo`),
  UNIQUE KEY `matricula` (`matricula`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehiculos`
--

LOCK TABLES `vehiculos` WRITE;
/*!40000 ALTER TABLE `vehiculos` DISABLE KEYS */;
INSERT INTO `vehiculos` VALUES (8,'AAA 123',1,0),(9,'BBB 321',2,1),(10,'CCC 123',1,1),(11,'DDD 123',2,1),(12,'FRE 456',2,1),(13,'KLK 450',1,1),(14,'ASW 236',1,1),(15,'SEG 123',1,0),(16,'DSA 123',1,0),(17,'FAS 241',1,0),(18,'XCA 123',2,0),(19,'GSW 231',2,0);
/*!40000 ALTER TABLE `vehiculos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-28 21:17:03
