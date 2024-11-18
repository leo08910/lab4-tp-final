CREATE DATABASE  IF NOT EXISTS `estacionamiento` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `estacionamiento`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: estacionamiento
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
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `id_cliente_UNIQUE` (`id_cliente`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Gaspar Ahumada'),(3,'Homero Simpson'),(2,'Pedro Picapiedra');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lugares`
--

LOCK TABLES `lugares` WRITE;
/*!40000 ALTER TABLE `lugares` DISABLE KEYS */;
INSERT INTO `lugares` VALUES (1,'Est. 1',0),(2,'Est. 2',0),(3,'Est. 3',1),(4,'Est. 4',1);
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
  `id_vehiculo` int NOT NULL,
  `inicio` datetime NOT NULL,
  `fin` datetime DEFAULT NULL,
  `id_tarifa` int NOT NULL,
  `precio_final` float DEFAULT NULL,
  PRIMARY KEY (`id_registro`),
  UNIQUE KEY `id_registro_UNIQUE` (`id_registro`),
  KEY `registros_ibfk_1` (`id_lugar`),
  KEY `registros_ibfk_2` (`id_vehiculo`),
  KEY `registros_ibfk_3` (`id_tarifa`),
  CONSTRAINT `registros_ibfk_1` FOREIGN KEY (`id_lugar`) REFERENCES `lugares` (`id_lugar`),
  CONSTRAINT `registros_ibfk_2` FOREIGN KEY (`id_vehiculo`) REFERENCES `vehiculos` (`id_vehiculo`),
  CONSTRAINT `registros_ibfk_3` FOREIGN KEY (`id_tarifa`) REFERENCES `tarifas` (`id_tarifa`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registros`
--

LOCK TABLES `registros` WRITE;
/*!40000 ALTER TABLE `registros` DISABLE KEYS */;
INSERT INTO `registros` VALUES (20,1,5,'2024-11-17 08:00:00','2024-11-17 12:00:00',2,500);
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
  `id_tipo_vehiculo` int NOT NULL,
  `precio` float NOT NULL,
  PRIMARY KEY (`id_tarifa`),
  UNIQUE KEY `id_tarifa_UNIQUE` (`id_tarifa`),
  KEY `tarifas_ibfk_1` (`id_tipo_vehiculo`),
  CONSTRAINT `tarifas_ibfk_1` FOREIGN KEY (`id_tipo_vehiculo`) REFERENCES `tipos_vehiculo` (`id_tipo_vehiculo`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarifas`
--

LOCK TABLES `tarifas` WRITE;
/*!40000 ALTER TABLE `tarifas` DISABLE KEYS */;
INSERT INTO `tarifas` VALUES (1,'Diaria',1,500),(2,'Diaria',2,300),(3,'Diaria',3,700),(4,'Mensual',1,10000),(5,'Mensual',2,6000),(6,'Mensual',3,12000);
/*!40000 ALTER TABLE `tarifas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_vehiculo`
--

DROP TABLE IF EXISTS `tipos_vehiculo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_vehiculo` (
  `id_tipo_vehiculo` int NOT NULL AUTO_INCREMENT,
  `tipo_vehiculo` varchar(50) NOT NULL,
  PRIMARY KEY (`id_tipo_vehiculo`),
  UNIQUE KEY `id_tipo_vehiculo_UNIQUE` (`id_tipo_vehiculo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_vehiculo`
--

LOCK TABLES `tipos_vehiculo` WRITE;
/*!40000 ALTER TABLE `tipos_vehiculo` DISABLE KEYS */;
INSERT INTO `tipos_vehiculo` VALUES (1,'Auto'),(2,'Moto'),(3,'Camioneta');
/*!40000 ALTER TABLE `tipos_vehiculo` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Juan','Pérez','juan.perez@email.com','123456789','password123',0),(2,'María','González','maria.gonzalez@email.com','987654321','password456',1),(3,'Carlos','López','carlos.lopez@email.com','1122334455','password789',0),(4,'Alejandro','Gómez','gmz248alejandro@gmail.com','3804442366','$2b$10$vTyd9vyYl.JCVIq39uxYxe9B9b3akRjDWjbdtDDj0fZ8v2Xt82876',1);
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
  `id_cliente` int NOT NULL,
  `id_tipo_vehiculo` int NOT NULL,
  `estacionado` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_vehiculo`),
  UNIQUE KEY `matricula` (`matricula`),
  KEY `vehiculos_ibfk_2` (`id_tipo_vehiculo`),
  KEY `vehiculos_ibfk_3_idx` (`id_cliente`),
  CONSTRAINT `vehiculos_ibfk_2` FOREIGN KEY (`id_tipo_vehiculo`) REFERENCES `tipos_vehiculo` (`id_tipo_vehiculo`),
  CONSTRAINT `vehiculos_ibfk_3` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehiculos`
--

LOCK TABLES `vehiculos` WRITE;
/*!40000 ALTER TABLE `vehiculos` DISABLE KEYS */;
INSERT INTO `vehiculos` VALUES (5,'ABC 123',2,1,0),(6,'ZXY 321',3,1,0);
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

-- Dump completed on 2024-11-17 23:52:17
