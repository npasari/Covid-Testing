-- MySQL dump 10.13  Distrib 8.0.18, for macos10.14 (x86_64)
--
-- Host: localhost    Database: finalprojectschema
-- ------------------------------------------------------
-- Server version	8.0.18

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Employee`
--

DROP TABLE IF EXISTS `Employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Employee` (
  `employeeID` varchar(20) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `passcode` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`employeeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Employee`
--

LOCK TABLES `Employee` WRITE;
/*!40000 ALTER TABLE `Employee` DISABLE KEYS */;
INSERT INTO `Employee` VALUES ('50','bob@gmail.com','bob','smith','bob'),('51','alice@gmail.com','alice','smith','alice'),('52','dan@gmail.com','dan','fish','dan'),('53','mark@gmail.com','mark','anthony','mark'),('54','hello@gmail.com','hello','kitty','hello'),('55','freddy@gmail.com','freddy','krueger','freddy'),('56','wolfgang@gmail.com','wolfgang','mozart','wolfgang'),('57','antonio@gmail.com','antonio','salieri','antonio'),('58','raffaello@gmail.com','raffaello','urbino','raffaello'),('59','donatello@gmail.com','donatello','bardi','donatello');
/*!40000 ALTER TABLE `Employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EmployeeTest`
--

DROP TABLE IF EXISTS `EmployeeTest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EmployeeTest` (
  `testBarcode` varchar(50) NOT NULL,
  `employeeID` varchar(20) DEFAULT NULL,
  `collectionTime` datetime NOT NULL,
  `collectedBy` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`testBarcode`),
  KEY `employeeID` (`employeeID`),
  KEY `collectedBy` (`collectedBy`),
  CONSTRAINT `collectedBy` FOREIGN KEY (`collectedBy`) REFERENCES `labemployee` (`labID`),
  CONSTRAINT `employeeID` FOREIGN KEY (`employeeID`) REFERENCES `employee` (`employeeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EmployeeTest`
--

LOCK TABLES `EmployeeTest` WRITE;
/*!40000 ALTER TABLE `EmployeeTest` DISABLE KEYS */;
/*!40000 ALTER TABLE `EmployeeTest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LabEmployee`
--

DROP TABLE IF EXISTS `LabEmployee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LabEmployee` (
  `labID` varchar(50) NOT NULL,
  `password` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`labID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LabEmployee`
--

LOCK TABLES `LabEmployee` WRITE;
/*!40000 ALTER TABLE `LabEmployee` DISABLE KEYS */;
/*!40000 ALTER TABLE `LabEmployee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Pool`
--

DROP TABLE IF EXISTS `Pool`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Pool` (
  `poolBarcode` varchar(50) NOT NULL,
  PRIMARY KEY (`poolBarcode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Pool`
--

LOCK TABLES `Pool` WRITE;
/*!40000 ALTER TABLE `Pool` DISABLE KEYS */;
INSERT INTO `Pool` VALUES ('ABC'),('BCD'),('CDE');
/*!40000 ALTER TABLE `Pool` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PoolMap`
--

DROP TABLE IF EXISTS `PoolMap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PoolMap` (
  `testBarcode` varchar(50) NOT NULL,
  `poolBarcode` varchar(50) DEFAULT NULL,
  KEY `testBarcode` (`testBarcode`),
  KEY `poolBarcode` (`poolBarcode`),
  CONSTRAINT `poolBarcode` FOREIGN KEY (`poolBarcode`) REFERENCES `pool` (`poolBarcode`),
  CONSTRAINT `testBarcode` FOREIGN KEY (`testBarcode`) REFERENCES `employeetest` (`testBarcode`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PoolMap`
--

LOCK TABLES `PoolMap` WRITE;
/*!40000 ALTER TABLE `PoolMap` DISABLE KEYS */;
/*!40000 ALTER TABLE `PoolMap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Well`
--

DROP TABLE IF EXISTS `Well`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Well` (
  `wellBarcode` varchar(50) NOT NULL,
  PRIMARY KEY (`wellBarcode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Well`
--

LOCK TABLES `Well` WRITE;
/*!40000 ALTER TABLE `Well` DISABLE KEYS */;
INSERT INTO `Well` VALUES ('W1'),('W2'),('W3'),('W4');
/*!40000 ALTER TABLE `Well` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WellTesting`
--

DROP TABLE IF EXISTS `WellTesting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WellTesting` (
  `poolBarcodeFK` varchar(50) NOT NULL,
  `wellBarcodeFK` varchar(50) NOT NULL,
  `testingStartTime` datetime DEFAULT NULL,
  `testingEndTime` datetime DEFAULT NULL,
  `result` varchar(20) DEFAULT NULL,
  KEY `poolBarcode` (`poolBarcodeFK`),
  KEY `wellBarcode` (`wellBarcodeFK`),
  CONSTRAINT `poolBarcodeFK` FOREIGN KEY (`poolBarcodeFK`) REFERENCES `pool` (`poolBarcode`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `wellBarcodeFK` FOREIGN KEY (`wellBarcodeFK`) REFERENCES `well` (`wellBarcode`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WellTesting`
--

LOCK TABLES `WellTesting` WRITE;
/*!40000 ALTER TABLE `WellTesting` DISABLE KEYS */;
/*!40000 ALTER TABLE `WellTesting` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-30 23:51:18
