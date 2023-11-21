-- MySQL dump 10.13  Distrib 8.1.0, for macos13.3 (arm64)
--
-- Host: localhost    Database: icms
-- ------------------------------------------------------
-- Server version	8.0.34

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
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add permission',1,'add_permission'),(2,'Can change permission',1,'change_permission'),(3,'Can delete permission',1,'delete_permission'),(4,'Can view permission',1,'view_permission'),(5,'Can add group',2,'add_group'),(6,'Can change group',2,'change_group'),(7,'Can delete group',2,'delete_group'),(8,'Can view group',2,'view_group'),(9,'Can add content type',3,'add_contenttype'),(10,'Can change content type',3,'change_contenttype'),(11,'Can delete content type',3,'delete_contenttype'),(12,'Can view content type',3,'view_contenttype'),(13,'Can add session',4,'add_session'),(14,'Can change session',4,'change_session'),(15,'Can delete session',4,'delete_session'),(16,'Can view session',4,'view_session'),(17,'Can add Token',5,'add_token'),(18,'Can change Token',5,'change_token'),(19,'Can delete Token',5,'delete_token'),(20,'Can view Token',5,'view_token'),(21,'Can add token',6,'add_tokenproxy'),(22,'Can change token',6,'change_tokenproxy'),(23,'Can delete token',6,'delete_tokenproxy'),(24,'Can view token',6,'view_tokenproxy'),(25,'Can add student',7,'add_student'),(26,'Can change student',7,'change_student'),(27,'Can delete student',7,'delete_student'),(28,'Can view student',7,'view_student'),(29,'Can add course',8,'add_course'),(30,'Can change course',8,'change_course'),(31,'Can delete course',8,'delete_course'),(32,'Can view course',8,'view_course'),(33,'Can add session',9,'add_session'),(34,'Can change session',9,'change_session'),(35,'Can delete session',9,'delete_session'),(36,'Can view session',9,'view_session'),(37,'Can add session hyperlink',10,'add_sessionhyperlink'),(38,'Can change session hyperlink',10,'change_sessionhyperlink'),(39,'Can delete session hyperlink',10,'delete_sessionhyperlink'),(40,'Can view session hyperlink',10,'view_sessionhyperlink'),(41,'Can add session file',11,'add_sessionfile'),(42,'Can change session file',11,'change_sessionfile'),(43,'Can delete session file',11,'delete_sessionfile'),(44,'Can view session file',11,'view_sessionfile'),(45,'Can add record',12,'add_record'),(46,'Can change record',12,'change_record'),(47,'Can delete record',12,'delete_record'),(48,'Can view record',12,'view_record'),(49,'Can add course hyperlink',13,'add_coursehyperlink'),(50,'Can change course hyperlink',13,'change_coursehyperlink'),(51,'Can delete course hyperlink',13,'delete_coursehyperlink'),(52,'Can view course hyperlink',13,'view_coursehyperlink'),(53,'Can add course file',14,'add_coursefile'),(54,'Can change course file',14,'change_coursefile'),(55,'Can delete course file',14,'delete_coursefile'),(56,'Can view course file',14,'view_coursefile'),(57,'Can add face label',15,'add_facelabel'),(58,'Can change face label',15,'change_facelabel'),(59,'Can delete face label',15,'delete_facelabel'),(60,'Can view face label',15,'view_facelabel'),(61,'Can add face',16,'add_face'),(62,'Can change face',16,'change_face'),(63,'Can delete face',16,'delete_face'),(64,'Can view face',16,'view_face');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authtoken_token`
--

DROP TABLE IF EXISTS `authtoken_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authtoken_token` (
  `key` varchar(40) NOT NULL,
  `created` datetime(6) NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`key`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `authtoken_token_user_id_35299eff_fk_core_student_id` FOREIGN KEY (`user_id`) REFERENCES `core_student` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authtoken_token`
--

LOCK TABLES `authtoken_token` WRITE;
/*!40000 ALTER TABLE `authtoken_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `authtoken_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `core_course`
--

DROP TABLE IF EXISTS `core_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `core_course` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(10) NOT NULL,
  `year` int unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `core_course_code_year_4b7a64b0_uniq` (`code`,`year`),
  CONSTRAINT `core_course_chk_1` CHECK ((`year` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `core_course`
--

LOCK TABLES `core_course` WRITE;
/*!40000 ALTER TABLE `core_course` DISABLE KEYS */;
INSERT INTO `core_course` VALUES (1,'COMP3278A',2023,'Introduction to database management systems','This course studies the principles, design, administration, and implementation of database management systems. Topics include: entity-relationship model, relational model, relational algebra, database design and normalization, database query languages, indexing schemes, integrity and concurrency control.'),(2,'COMP3322A',2023,'Modern Technologies on World Wide Web','Selected network protocols relevant to the World Wide Web (e.g., HTTP, DNS, IP); World Wide Web; technologies for programming the Web (e.g, HTML, XML, style sheets, PHP, JavaScript, Node.js.; other topics of current interest (AJAX, HTML5, web services, cloud computing).'),(3,'COMP3330A',2023,'Interactive Mobile Application Design and Programming','This course introduces the techniques for developing interactive mobile applications on Android platform. Topics include user interface design, graphics, parallel computing, database, network, multimedia, sensors and location service. Trends and tools for developing applications on various mobile platforms are also discussed. Students participate in both individual assignments and group projects to practice ideation, reading, writing, coding and presentation skills.'),(4,'COMP3314A',2023,'Machine Learning','This course introduces algorithms, tools, practices, and applications of machine learning. Topics include core methods such as supervised learning (classification and regression), unsupervised learning (clustering, principal component analysis), Bayesian estimation, neural networks; common practices in data pre-processing, hyper-parameter tuning, and model evaluation; tools/libraries/APIs such as scikit-learn, Theano/Keras, and multi/many-core CPU/GPU programming.');
/*!40000 ALTER TABLE `core_course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `core_course_students`
--

DROP TABLE IF EXISTS `core_course_students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `core_course_students` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `core_course_students_course_id_student_id_1e7aad5e_uniq` (`course_id`,`student_id`),
  KEY `core_course_students_student_id_913166c6_fk_core_student_id` (`student_id`),
  CONSTRAINT `core_course_students_course_id_f401f754_fk_core_course_id` FOREIGN KEY (`course_id`) REFERENCES `core_course` (`id`),
  CONSTRAINT `core_course_students_student_id_913166c6_fk_core_student_id` FOREIGN KEY (`student_id`) REFERENCES `core_student` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `core_course_students`
--

LOCK TABLES `core_course_students` WRITE;
/*!40000 ALTER TABLE `core_course_students` DISABLE KEYS */;
INSERT INTO `core_course_students` VALUES (1,1,3035931181),(2,2,3035931181),(3,3,3035931181),(4,4,3035931181);
/*!40000 ALTER TABLE `core_course_students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `core_coursefile`
--

DROP TABLE IF EXISTS `core_coursefile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `core_coursefile` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `file` varchar(100) NOT NULL,
  `course_id` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `order` int unsigned NOT NULL,
  `last_edit` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `core_coursefile_course_id_id_f73a2e96_uniq` (`course_id`,`id`),
  CONSTRAINT `core_coursefile_course_id_7f6d5572_fk_core_course_id` FOREIGN KEY (`course_id`) REFERENCES `core_course` (`id`),
  CONSTRAINT `core_coursefile_chk_1` CHECK ((`order` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `core_coursefile`
--

LOCK TABLES `core_coursefile` WRITE;
/*!40000 ALTER TABLE `core_coursefile` DISABLE KEYS */;
/*!40000 ALTER TABLE `core_coursefile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `core_coursehyperlink`
--

DROP TABLE IF EXISTS `core_coursehyperlink`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `core_coursehyperlink` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `url` varchar(2048) NOT NULL,
  `course_id` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `order` int unsigned NOT NULL,
  `last_edit` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `core_coursehyperlink_course_id_id_fb198634_uniq` (`course_id`,`id`),
  CONSTRAINT `core_coursehyperlink_course_id_834b7441_fk_core_course_id` FOREIGN KEY (`course_id`) REFERENCES `core_course` (`id`),
  CONSTRAINT `core_coursehyperlink_chk_1` CHECK ((`order` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `core_coursehyperlink`
--

LOCK TABLES `core_coursehyperlink` WRITE;
/*!40000 ALTER TABLE `core_coursehyperlink` DISABLE KEYS */;
/*!40000 ALTER TABLE `core_coursehyperlink` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `core_face`
--

DROP TABLE IF EXISTS `core_face`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `core_face` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image` varchar(100) NOT NULL,
  `label_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `core_face_label_id_id_eab73d40_uniq` (`label_id`,`id`),
  CONSTRAINT `core_face_label_id_02576c7f_fk_core_facelabel_student_id` FOREIGN KEY (`label_id`) REFERENCES `core_facelabel` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `core_face`
--

LOCK TABLES `core_face` WRITE;
/*!40000 ALTER TABLE `core_face` DISABLE KEYS */;
/*!40000 ALTER TABLE `core_face` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `core_facelabel`
--

DROP TABLE IF EXISTS `core_facelabel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `core_facelabel` (
  `label_id` int unsigned DEFAULT NULL,
  `student_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `label_id` (`label_id`),
  CONSTRAINT `core_facelabel_student_id_a7cbb53f_fk_core_student_id` FOREIGN KEY (`student_id`) REFERENCES `core_student` (`id`),
  CONSTRAINT `core_facelabel_chk_1` CHECK ((`label_id` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `core_facelabel`
--

LOCK TABLES `core_facelabel` WRITE;
/*!40000 ALTER TABLE `core_facelabel` DISABLE KEYS */;
/*!40000 ALTER TABLE `core_facelabel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `core_record`
--

DROP TABLE IF EXISTS `core_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `core_record` (
  `id` int NOT NULL AUTO_INCREMENT,
  `time` datetime(6) NOT NULL,
  `message` varchar(255) NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `core_record_student_id_id_5cefb5e4_uniq` (`student_id`,`id`),
  CONSTRAINT `core_record_student_id_49e8cd27_fk_core_student_id` FOREIGN KEY (`student_id`) REFERENCES `core_student` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `core_record`
--

LOCK TABLES `core_record` WRITE;
/*!40000 ALTER TABLE `core_record` DISABLE KEYS */;
/*!40000 ALTER TABLE `core_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `core_session`
--

DROP TABLE IF EXISTS `core_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `core_session` (
  `id` int NOT NULL AUTO_INCREMENT,
  `start_time` datetime(6) NOT NULL,
  `end_time` datetime(6) NOT NULL,
  `type` varchar(3) NOT NULL,
  `classroom` varchar(255) NOT NULL,
  `course_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `core_session_course_id_id_6d79412c_uniq` (`course_id`,`id`),
  UNIQUE KEY `core_session_course_id_start_time_1f4ef1a5_uniq` (`course_id`,`start_time`),
  CONSTRAINT `core_session_course_id_563f7018_fk_core_course_id` FOREIGN KEY (`course_id`) REFERENCES `core_course` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `core_session`
--

LOCK TABLES `core_session` WRITE;
/*!40000 ALTER TABLE `core_session` DISABLE KEYS */;
INSERT INTO `core_session` VALUES (1,'2023-11-13 01:30:00.000000','2023-11-13 03:20:00.000000','LEC','MWT2',2),(2,'2023-11-20 01:30:00.000000','2023-11-20 03:20:00.000000','LEC','MWT2',2),(3,'2023-11-27 01:30:00.000000','2023-11-27 03:20:00.000000','LEC','MWT2',2),(4,'2023-11-17 01:30:00.000000','2023-11-17 03:20:00.000000','LEC','CYPP3',2),(5,'2023-11-24 01:30:00.000000','2023-11-24 03:20:00.000000','LEC','CYPP3',2),(6,'2023-11-13 04:30:00.000000','2023-11-13 06:20:00.000000','LEC','CYCP1',3),(7,'2023-11-20 04:30:00.000000','2023-11-20 06:20:00.000000','LEC','CYCP1',3),(8,'2023-11-27 04:30:00.000000','2023-11-27 06:20:00.000000','LEC','CYCP1',3),(9,'2023-11-30 04:30:00.000000','2023-11-30 05:20:00.000000','TUT','CYCP1',3),(10,'2023-11-23 04:30:00.000000','2023-11-23 05:20:00.000000','TUT','CYCP1',3),(11,'2023-11-16 04:30:00.000000','2023-11-16 05:20:00.000000','TUT','CYCP1',3),(12,'2023-11-13 06:30:00.000000','2023-11-13 07:20:00.000000','TUT','MWT1',1),(13,'2023-11-20 06:30:00.000000','2023-11-20 07:20:00.000000','TUT','MWT1',1),(14,'2023-11-27 06:30:00.000000','2023-11-27 07:20:00.000000','TUT','MWT1',1),(15,'2023-11-30 05:30:00.000000','2023-11-30 07:20:00.000000','TUT','MWT1',1),(16,'2023-11-23 05:30:00.000000','2023-11-23 07:20:00.000000','TUT','MWT1',1),(17,'2023-11-16 05:30:00.000000','2023-11-16 07:20:00.000000','LEC','MWT1',1),(18,'2023-11-14 04:30:00.000000','2023-11-14 05:20:00.000000','LEC','MB167',4),(19,'2023-11-21 04:30:00.000000','2023-11-21 05:20:00.000000','LEC','MB167',4),(20,'2023-11-28 04:30:00.000000','2023-11-28 05:20:00.000000','LEC','MB167',4),(21,'2023-11-24 04:30:00.000000','2023-11-24 06:20:00.000000','LEC','MB167',4),(22,'2023-11-17 04:30:00.000000','2023-11-17 06:20:00.000000','LEC','KK201',4);
/*!40000 ALTER TABLE `core_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `core_sessionfile`
--

DROP TABLE IF EXISTS `core_sessionfile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `core_sessionfile` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `file` varchar(100) NOT NULL,
  `session_id` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `order` int unsigned NOT NULL,
  `last_edit` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `core_sessionfile_session_id_id_1a195007_uniq` (`session_id`,`id`),
  CONSTRAINT `core_sessionfile_session_id_694132c2_fk_core_session_id` FOREIGN KEY (`session_id`) REFERENCES `core_session` (`id`),
  CONSTRAINT `core_sessionfile_chk_1` CHECK ((`order` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `core_sessionfile`
--

LOCK TABLES `core_sessionfile` WRITE;
/*!40000 ALTER TABLE `core_sessionfile` DISABLE KEYS */;
/*!40000 ALTER TABLE `core_sessionfile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `core_sessionhyperlink`
--

DROP TABLE IF EXISTS `core_sessionhyperlink`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `core_sessionhyperlink` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `url` varchar(2048) NOT NULL,
  `session_id` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `order` int unsigned NOT NULL,
  `last_edit` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `core_sessionhyperlink_session_id_id_3fe7ae2d_uniq` (`session_id`,`id`),
  CONSTRAINT `core_sessionhyperlink_session_id_f4e142d5_fk_core_session_id` FOREIGN KEY (`session_id`) REFERENCES `core_session` (`id`),
  CONSTRAINT `core_sessionhyperlink_chk_1` CHECK ((`order` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `core_sessionhyperlink`
--

LOCK TABLES `core_sessionhyperlink` WRITE;
/*!40000 ALTER TABLE `core_sessionhyperlink` DISABLE KEYS */;
INSERT INTO `core_sessionhyperlink` VALUES (1,'Monday, November 20, 2023','Tutorial Recording','https://hku.zoom.us/rec/play/3b4wVLjknRSKSrZ63CTIS9rqsxznl-DzQ86X9Womhf-wS8_5r-wrVTrneQbx7DW-eUzwQuN2KZCmUnc.1ylbJGDrk_Wt0J2_?canPlayFromShare=true&from=share_recording_detail&continueMode=true&componentName=rec-play&originRequestUrl=https%3A%2F%2Fhku.zoom.us%2Frec%2Fshare%2Ft0YRId4mPI-G2LDNTXcd7Jpd-iI3gBHZW1VZJqWNvzAD1dE3lyVHEgJ4yz71lscs.e5rxtVr_Xpkq1ahl',13,'2023-11-21 17:04:47.048238',1,'2023-11-21 17:04:47.048306'),(2,'Monday, November 13, 2023','Tutorial Recording','https://hku.zoom.us/rec/play/_5dkbP4VRc7M3EuGjKa97Zaxw3X6JOksA6Zj7VyHPcMDW3iOlm3ysthipQ4ImkjHqEoi_ftjolAJEyad.YHnBr19cMjgL_JYJ?canPlayFromShare=true&from=share_recording_detail&continueMode=true&componentName=rec-play&originRequestUrl=https%3A%2F%2Fhku.zoom.us%2Frec%2Fshare%2FrL8Wi_MCezbdajIUfgaKswQRwn35fYhAiqqo_4zqsrl2NHdlJOqhovxRrbv-xFQJ.ncdlBah9A3TjwB6z',12,'2023-11-21 17:05:48.507389',1,'2023-11-21 17:05:48.507532');
/*!40000 ALTER TABLE `core_sessionhyperlink` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `core_student`
--

DROP TABLE IF EXISTS `core_student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `core_student` (
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `id` bigint unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(254) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  CONSTRAINT `core_student_chk_1` CHECK ((`id` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `core_student`
--

LOCK TABLES `core_student` WRITE;
/*!40000 ALTER TABLE `core_student` DISABLE KEYS */;
INSERT INTO `core_student` VALUES ('pbkdf2_sha256$600000$CTHoFZo18qEsHFkXokCYGa$D7WiWJsTYJS9JREVddBbw6hETWVUX04QcWbLQ3u6P5M=',NULL,'Timmy',3035931181,'Timmy823','cshtimmy@connect.hku.hk');
/*!40000 ALTER TABLE `core_student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (2,'auth','group'),(1,'auth','permission'),(5,'authtoken','token'),(6,'authtoken','tokenproxy'),(3,'contenttypes','contenttype'),(8,'core','course'),(14,'core','coursefile'),(13,'core','coursehyperlink'),(16,'core','face'),(15,'core','facelabel'),(12,'core','record'),(9,'core','session'),(11,'core','sessionfile'),(10,'core','sessionhyperlink'),(7,'core','student'),(4,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2023-11-21 16:09:52.101994'),(2,'contenttypes','0002_remove_content_type_name','2023-11-21 16:09:52.117469'),(3,'auth','0001_initial','2023-11-21 16:09:52.181932'),(4,'auth','0002_alter_permission_name_max_length','2023-11-21 16:09:52.194050'),(5,'auth','0003_alter_user_email_max_length','2023-11-21 16:09:52.197081'),(6,'auth','0004_alter_user_username_opts','2023-11-21 16:09:52.199826'),(7,'auth','0005_alter_user_last_login_null','2023-11-21 16:09:52.202943'),(8,'auth','0006_require_contenttypes_0002','2023-11-21 16:09:52.203767'),(9,'auth','0007_alter_validators_add_error_messages','2023-11-21 16:09:52.206428'),(10,'auth','0008_alter_user_username_max_length','2023-11-21 16:09:52.209206'),(11,'auth','0009_alter_user_last_name_max_length','2023-11-21 16:09:52.211858'),(12,'auth','0010_alter_group_name_max_length','2023-11-21 16:09:52.217124'),(13,'auth','0011_update_proxy_permissions','2023-11-21 16:09:52.220541'),(14,'auth','0012_alter_user_first_name_max_length','2023-11-21 16:09:52.223397'),(15,'core','0001_initial','2023-11-21 16:09:52.363154'),(16,'authtoken','0001_initial','2023-11-21 16:09:52.381644'),(17,'authtoken','0002_auto_20160226_1747','2023-11-21 16:09:52.394412'),(18,'authtoken','0003_tokenproxy','2023-11-21 16:09:52.395694'),(19,'core','0002_alter_course_name_alter_coursefile_name_and_more','2023-11-21 16:09:52.480884'),(20,'core','0003_alter_session_session_type','2023-11-21 16:09:52.494042'),(21,'core','0004_alter_coursehyperlink_url_alter_sessionhyperlink_url','2023-11-21 16:09:52.530019'),(22,'core','0005_alter_coursefile_description_and_more','2023-11-21 16:09:52.561165'),(23,'core','0006_alter_coursefile_file','2023-11-21 16:09:52.564530'),(24,'core','0007_alter_session_unique_together','2023-11-21 16:09:52.574267'),(25,'core','0008_rename_classroom_address_session_classroom_and_more','2023-11-21 16:09:52.591988'),(26,'core','0009_coursefile_created_at_coursefile_order_and_more','2023-11-21 16:09:52.682690'),(27,'core','0010_coursefile_last_edit_coursehyperlink_last_edit_and_more','2023-11-21 16:09:52.715520'),(28,'core','0011_facelabel_face','2023-11-21 16:09:52.749414'),(29,'core','0012_alter_course_students','2023-11-21 16:09:52.756939'),(30,'sessions','0001_initial','2023-11-21 16:09:52.764958');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-22  1:30:56
