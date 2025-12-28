-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 26, 2025 at 09:38 PM
-- Server version: 8.0.44-0ubuntu0.24.04.2
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ISET_TRAINING`
--

-- --------------------------------------------------------

--
-- Table structure for table `candidates`
--

CREATE TABLE `candidates` (
  `id` int NOT NULL,
  `full_name` varchar(140) NOT NULL,
  `email` varchar(180) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `cin` varchar(30) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `candidates`
--

INSERT INTO `candidates` (`id`, `full_name`, `email`, `phone`, `cin`, `birth_date`, `created_at`, `updated_at`) VALUES
(1, 'Mehdi Ben Romdhane', 'mehdi.benromdhane@student.iset.tn', '+216 20 101 202', 'CIN100200', '2003-04-12', '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(2, 'Ines Jaziri', 'ines.jaziri@student.iset.tn', '+216 20 303 404', 'CIN100201', '2004-01-27', '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(3, 'Rami Kallel', 'rami.kallel@student.iset.tn', '+216 20 505 606', 'CIN100202', '2003-09-05', '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(4, 'Yasmine Ben Ali', 'yasmine.benali@student.iset.tn', '+216 20 707 808', 'CIN100203', '2004-06-19', '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(5, 'Achraf Saidi', 'achraf.saidi@student.iset.tn', '+216 20 909 010', 'CIN100204', '2003-11-23', '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(6, 'Nour Chaabane', 'nour.chaabane@student.iset.tn', '+216 21 111 121', 'CIN100205', '2004-03-14', '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(7, 'Farah Triki', 'farah.triki@student.iset.tn', '+216 21 131 415', 'CIN100206', '2003-07-29', '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(8, 'Skander Guesmi', 'skander.guesmi@student.iset.tn', '+216 21 161 718', 'CIN100207', '2004-10-03', '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(9, 'Ali Ben Salah', 'ali@example.com', NULL, NULL, NULL, '2025-12-26 14:35:00', '2025-12-26 14:35:00');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(120) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Software Development', 'Core programming, OOP, backend architecture.', '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(2, 'Web Development', 'Frontend & full-stack web technologies.', '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(3, 'Data Science', 'Data analysis, statistics, visualization.', '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(4, 'Cybersecurity', 'Ethical hacking, secure systems, defense.', '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(5, 'Cloud Computing', 'Cloud fundamentals, DevOps, deployment.', '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(6, 'Artificial Intelligence', 'ML, deep learning, AI applications.', '2025-12-26 13:05:06', '2025-12-26 13:05:06');

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `id` int NOT NULL,
  `session_id` int NOT NULL,
  `candidate_id` int NOT NULL,
  `status` enum('pending','accepted','rejected','cancelled') NOT NULL DEFAULT 'pending',
  `enrolled_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `notes` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`id`, `session_id`, `candidate_id`, `status`, `enrolled_at`, `notes`) VALUES
(1, 1, 1, 'accepted', '2025-12-26 13:05:06', 'Good attendance expected.'),
(2, 1, 2, 'accepted', '2025-12-26 13:05:06', 'Interested in frontend.'),
(3, 1, 3, 'pending', '2025-12-26 13:05:06', 'Waiting for confirmation.'),
(4, 2, 4, 'accepted', '2025-12-26 13:05:06', 'Backend track student.'),
(5, 2, 5, 'pending', '2025-12-26 13:05:06', 'Needs timetable confirmation.'),
(6, 3, 6, 'pending', '2025-12-26 13:05:06', 'First DS training.'),
(7, 4, 7, 'pending', '2025-12-26 13:05:06', 'Security club member.'),
(8, 5, 8, 'pending', '2025-12-26 13:05:06', 'Wants cloud basics.'),
(9, 6, 2, 'accepted', '2025-12-26 13:05:06', 'Already completed Angular Fundamentals.'),
(10, 6, 1, 'pending', '2025-12-26 13:05:06', 'Wants RxJS practice.'),
(11, 1, 9, 'pending', '2025-12-26 14:36:56', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` int NOT NULL,
  `training_id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `location` varchar(200) DEFAULT NULL,
  `capacity` int NOT NULL DEFAULT '20',
  `status` enum('planned','open','closed','cancelled') NOT NULL DEFAULT 'planned',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `training_id`, `start_date`, `end_date`, `start_time`, `end_time`, `location`, `capacity`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-01-06', '2025-01-17', '09:00:00', '12:00:00', 'ISET - Lab A1', 25, 'open', '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(2, 3, '2025-01-13', '2025-01-24', '13:30:00', '16:30:00', 'ISET - Lab B2', 20, 'open', '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(3, 5, '2025-02-03', '2025-02-14', '09:00:00', '12:00:00', 'ISET - Lab D1', 30, 'planned', '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(4, 7, '2025-02-10', '2025-02-14', '13:30:00', '16:30:00', 'ISET - Cyber Lab C3', 18, 'planned', '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(5, 8, '2025-02-17', '2025-02-21', '09:00:00', '12:00:00', 'ISET - Room E2', 35, 'planned', '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(6, 2, '2025-03-03', '2025-03-07', '13:30:00', '16:30:00', 'ISET - Lab A2', 22, 'planned', '2025-12-26 13:05:06', '2025-12-26 13:05:06');

-- --------------------------------------------------------

--
-- Table structure for table `session_trainers`
--

CREATE TABLE `session_trainers` (
  `session_id` int NOT NULL,
  `trainer_id` int NOT NULL,
  `role` enum('main','assistant') DEFAULT 'main'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `session_trainers`
--

INSERT INTO `session_trainers` (`session_id`, `trainer_id`, `role`) VALUES
(1, 1, 'main'),
(2, 3, 'main'),
(3, 4, 'main'),
(4, 5, 'main'),
(5, 6, 'main'),
(6, 1, 'main'),
(6, 2, 'assistant');

--
-- Triggers `session_trainers`
--
DELIMITER $$
CREATE TRIGGER `trg_limit_trainers_per_session` BEFORE INSERT ON `session_trainers` FOR EACH ROW BEGIN
  DECLARE cnt INT$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int NOT NULL,
  `name` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`) VALUES
(8, 'ai'),
(3, 'api'),
(2, 'backend'),
(4, 'cloud'),
(10, 'database'),
(9, 'devops'),
(1, 'frontend'),
(7, 'javascript'),
(6, 'python'),
(5, 'security');

-- --------------------------------------------------------

--
-- Table structure for table `trainers`
--

CREATE TABLE `trainers` (
  `id` int NOT NULL,
  `full_name` varchar(140) NOT NULL,
  `email` varchar(180) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `bio` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `trainers`
--

INSERT INTO `trainers` (`id`, `full_name`, `email`, `phone`, `bio`, `created_at`, `updated_at`) VALUES
(1, 'Dr. Ahmed Ben Salah', 'ahmed.bensalah@iset.tn', '+216 22 111 222', 'Senior lecturer in web engineering, Angular & TypeScript.', '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(2, 'Sara Khemiri', 'sara.khemiri@iset.tn', '+216 23 333 444', 'Backend developer and instructor (Laravel, APIs, DB design).', '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(3, 'Youssef Trabelsi', 'youssef.trabelsi@iset.tn', '+216 24 555 666', 'Java/Spring Boot trainer focused on clean architecture.', '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(4, 'Dr. Mariem Haddad', 'mariem.haddad@iset.tn', '+216 25 777 888', 'Data science & ML lecturer, research in applied AI.', '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(5, 'Houssem Gharbi', 'houssem.gharbi@iset.tn', '+216 26 999 000', 'Cybersecurity engineer, CTF mentor, web security specialist.', '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(6, 'Amine Zribi', 'amine.zribi@iset.tn', '+216 27 123 456', 'Cloud & DevOps instructor (AWS, CI/CD, deployment).', '2025-12-26 13:05:06', '2025-12-26 13:05:06');

-- --------------------------------------------------------

--
-- Table structure for table `trainer_specialties`
--

CREATE TABLE `trainer_specialties` (
  `trainer_id` int NOT NULL,
  `category_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `trainer_specialties`
--

INSERT INTO `trainer_specialties` (`trainer_id`, `category_id`) VALUES
(2, 1),
(3, 1),
(1, 2),
(2, 2),
(4, 3),
(5, 4),
(6, 5),
(4, 6);

-- --------------------------------------------------------

--
-- Table structure for table `trainings`
--

CREATE TABLE `trainings` (
  `id` int NOT NULL,
  `title` varchar(180) NOT NULL,
  `description` text,
  `level` enum('beginner','intermediate','advanced') DEFAULT 'beginner',
  `duration_hours` int DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `trainings`
--

INSERT INTO `trainings` (`id`, `title`, `description`, `level`, `duration_hours`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Angular Fundamentals', 'Components, routing, forms, services, and best practices.', 'beginner', 40, 1, '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(2, 'Advanced Angular & RxJS', 'State management patterns, RxJS, performance, testing.', 'advanced', 30, 1, '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(3, 'Spring Boot for Backend', 'REST APIs, security basics, JPA, and clean architecture.', 'intermediate', 45, 1, '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(4, 'Laravel REST APIs', 'Build RESTful APIs with Laravel, auth, validation, and resources.', 'intermediate', 35, 1, '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(5, 'Python for Data Science', 'Numpy, Pandas, data cleaning, and visualization.', 'beginner', 50, 1, '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(6, 'Machine Learning Basics', 'Supervised learning, evaluation, feature engineering.', 'intermediate', 45, 1, '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(7, 'Ethical Hacking Essentials', 'Recon, vulnerabilities, web security, and labs.', 'beginner', 30, 1, '2025-12-26 13:05:06', '2025-12-26 13:05:06'),
(8, 'AWS Cloud Practitioner Prep', 'Cloud concepts, IAM, EC2, S3, billing, and exam prep.', 'beginner', 25, 1, '2025-12-26 13:05:06', '2025-12-26 13:05:06');

-- --------------------------------------------------------

--
-- Table structure for table `training_categories`
--

CREATE TABLE `training_categories` (
  `training_id` int NOT NULL,
  `category_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `training_categories`
--

INSERT INTO `training_categories` (`training_id`, `category_id`) VALUES
(3, 1),
(4, 1),
(1, 2),
(2, 2),
(5, 3),
(7, 4),
(8, 5),
(6, 6);

-- --------------------------------------------------------

--
-- Table structure for table `training_tags`
--

CREATE TABLE `training_tags` (
  `training_id` int NOT NULL,
  `tag_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `training_tags`
--

INSERT INTO `training_tags` (`training_id`, `tag_id`) VALUES
(1, 1),
(2, 1),
(3, 2),
(4, 2),
(3, 3),
(4, 3),
(7, 3),
(8, 4),
(7, 5),
(5, 6),
(6, 6),
(1, 7),
(2, 7),
(6, 8),
(8, 9),
(1, 10),
(3, 10),
(4, 10),
(5, 10);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `candidates`
--
ALTER TABLE `candidates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_candidates_email` (`email`),
  ADD UNIQUE KEY `uq_candidates_cin` (`cin`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_categories_name` (`name`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_candidate_session` (`session_id`,`candidate_id`),
  ADD KEY `idx_enrollments_session` (`session_id`),
  ADD KEY `idx_enrollments_candidate` (`candidate_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_sessions_training` (`training_id`),
  ADD KEY `idx_sessions_start_date` (`start_date`);

--
-- Indexes for table `session_trainers`
--
ALTER TABLE `session_trainers`
  ADD PRIMARY KEY (`session_id`,`trainer_id`),
  ADD KEY `fk_st_trainer` (`trainer_id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_tags_name` (`name`);

--
-- Indexes for table `trainers`
--
ALTER TABLE `trainers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_trainers_email` (`email`);

--
-- Indexes for table `trainer_specialties`
--
ALTER TABLE `trainer_specialties`
  ADD PRIMARY KEY (`trainer_id`,`category_id`),
  ADD KEY `fk_ts_category` (`category_id`);

--
-- Indexes for table `trainings`
--
ALTER TABLE `trainings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `training_categories`
--
ALTER TABLE `training_categories`
  ADD PRIMARY KEY (`training_id`,`category_id`),
  ADD KEY `fk_tc_category` (`category_id`);

--
-- Indexes for table `training_tags`
--
ALTER TABLE `training_tags`
  ADD PRIMARY KEY (`training_id`,`tag_id`),
  ADD KEY `fk_tt_tag` (`tag_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `candidates`
--
ALTER TABLE `candidates`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `trainers`
--
ALTER TABLE `trainers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `trainings`
--
ALTER TABLE `trainings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `fk_enroll_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_enroll_session` FOREIGN KEY (`session_id`) REFERENCES `sessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `fk_sessions_training` FOREIGN KEY (`training_id`) REFERENCES `trainings` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `session_trainers`
--
ALTER TABLE `session_trainers`
  ADD CONSTRAINT `fk_st_session` FOREIGN KEY (`session_id`) REFERENCES `sessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_st_trainer` FOREIGN KEY (`trainer_id`) REFERENCES `trainers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `trainer_specialties`
--
ALTER TABLE `trainer_specialties`
  ADD CONSTRAINT `fk_ts_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ts_trainer` FOREIGN KEY (`trainer_id`) REFERENCES `trainers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `training_categories`
--
ALTER TABLE `training_categories`
  ADD CONSTRAINT `fk_tc_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tc_training` FOREIGN KEY (`training_id`) REFERENCES `trainings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `training_tags`
--
ALTER TABLE `training_tags`
  ADD CONSTRAINT `fk_tt_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tt_training` FOREIGN KEY (`training_id`) REFERENCES `trainings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
