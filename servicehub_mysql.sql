-- =======================================================
-- SERVICEHUB FULL MYSQL DATABASE SCRIPT WITH LIVE DATA
-- Project: ServiceHub (BCA Sem-V, SEC205-3C, Group F10)
-- =======================================================

CREATE DATABASE IF NOT EXISTS `servicehub_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `servicehub_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- ServiceHub: Hyperlocal On-Demand Service Marketplace
-- MySQL 8.0+ Relational DDL Architecture

CREATE DATABASE IF NOT EXISTS servicehub_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE servicehub_db;

-- 1. Master Table: Users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(20) UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'worker', 'admin') DEFAULT 'customer',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Master Table: Service Categories
CREATE TABLE IF NOT EXISTS service_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50) DEFAULT 'wrench',
    description TEXT,
    base_price FLOAT DEFAULT 299.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Master Table: Worker Profiles
CREATE TABLE IF NOT EXISTS worker_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    category_id INT NOT NULL,
    experience_years INT DEFAULT 1,
    hourly_rate FLOAT DEFAULT 300.0,
    bio TEXT,
    city VARCHAR(50) DEFAULT 'Ahmedabad',
    locality VARCHAR(100) DEFAULT 'Navrangpura',
    id_proof_url VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    rating_avg FLOAT DEFAULT 5.0,
    total_reviews INT DEFAULT 0,
    total_earnings FLOAT DEFAULT 0.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES service_categories(id)
) ENGINE=InnoDB;

-- 4. Transaction Table: Bookings
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_ref VARCHAR(32) NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    worker_id INT NOT NULL,
    category_id INT NOT NULL,
    service_address TEXT NOT NULL,
    city VARCHAR(50) DEFAULT 'Ahmedabad',
    locality VARCHAR(100) DEFAULT 'Navrangpura',
    scheduled_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_instant BOOLEAN DEFAULT TRUE,
    status ENUM('PENDING', 'ACCEPTED', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    total_amount FLOAT DEFAULT 350.0,
    payment_status ENUM('UNPAID', 'PAID') DEFAULT 'UNPAID',
    payment_method VARCHAR(50) NULL,
    transaction_ref VARCHAR(64) NULL,
    paid_at DATETIME NULL,
    problem_description TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (worker_id) REFERENCES worker_profiles(id),
    FOREIGN KEY (category_id) REFERENCES service_categories(id)
) ENGINE=InnoDB;

-- 5. Transaction Table: OTP Verifications (2-Stage Security)
CREATE TABLE IF NOT EXISTS otp_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    otp_type ENUM('START', 'END') NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Transaction Table: Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    worker_id INT NOT NULL,
    rating INT DEFAULT 5,
    review_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (worker_id) REFERENCES worker_profiles(id)
) ENGINE=InnoDB;


-- =======================================================
-- INSERT LIVE PRODUCTION RECORDS
-- =======================================================

-- Records for table `users`
INSERT INTO `users` (`id`, `email`, `phone`, `full_name`, `hashed_password`, `role`, `is_active`, `created_at`) VALUES (1, 'admin@servicehub.com', '9900000001', 'ServiceHub System Admin', '$2b$12$htMBuew9GMcjuX5ajZ4e6OccpHNeIK.6uHOWBCWCJQ1knUwZ/aEnS', 'admin', 1, '2026-08-26 05:52:33.254381');
INSERT INTO `users` (`id`, `email`, `phone`, `full_name`, `hashed_password`, `role`, `is_active`, `created_at`) VALUES (2, 'rahul@gmail.com', '9876543210', 'Rahul Sharma', '$2b$12$SE3dqafNT4fWj2Z.aR7NTupCtj3BjtzwoRphlAqUvDjqePKKnFs0e', 'customer', 1, '2026-08-26 05:52:33.254387');
INSERT INTO `users` (`id`, `email`, `phone`, `full_name`, `hashed_password`, `role`, `is_active`, `created_at`) VALUES (3, 'priya@gmail.com', '9876543211', 'Priya Patel', '$2b$12$qMsppYBMmoiN4J1Ya0ensecDtvW2oNWP0BwbyveC.YyWQ4V7e0NE6', 'customer', 1, '2026-08-26 05:52:33.254389');
INSERT INTO `users` (`id`, `email`, `phone`, `full_name`, `hashed_password`, `role`, `is_active`, `created_at`) VALUES (4, 'ramesh.plumber@servicehub.com', '9825000001', 'Ramesh Mistri', '$2b$12$kMi/AXPPsLbue2UQgdRLbeIba4VnUnAB9XtnJ2IZcA1tGfekQWfy2', 'worker', 1, '2026-08-26 05:52:33.501263');
INSERT INTO `users` (`id`, `email`, `phone`, `full_name`, `hashed_password`, `role`, `is_active`, `created_at`) VALUES (5, 'mukesh.electrician@servicehub.com', '9825000002', 'Mukesh Solanki', '$2b$12$GtXMzv6ZWnI.qW5mu7t4oOY90USgI6bjLJECDeSSGPxZsYk0TliIC', 'worker', 1, '2026-08-26 05:52:33.739688');
INSERT INTO `users` (`id`, `email`, `phone`, `full_name`, `hashed_password`, `role`, `is_active`, `created_at`) VALUES (6, 'imran.ac@servicehub.com', '9825000003', 'Imran Khan', '$2b$12$w.vGp.3VO3MbNwYO3ZX3..jrIzPmlzCb.CoKaVftJDw0.WBJvRp1.', 'worker', 1, '2026-08-26 05:52:33.992479');
INSERT INTO `users` (`id`, `email`, `phone`, `full_name`, `hashed_password`, `role`, `is_active`, `created_at`) VALUES (7, 'savita.cleaning@servicehub.com', '9825000004', 'Savitaben Vaghela', '$2b$12$SWjvl3qflPFNd1nPP/2r/ehOqZv/1TjTD1JDBP3F.HF7vSQd7JWme', 'worker', 1, '2026-08-26 05:52:34.292520');
INSERT INTO `users` (`id`, `email`, `phone`, `full_name`, `hashed_password`, `role`, `is_active`, `created_at`) VALUES (8, 'dinesh.carpenter@servicehub.com', '9825000005', 'Dinesh Suthar', '$2b$12$cRVsDHGV9Hqjx0A/wslQ3.ConSsPez87CR0xk9rluppvxypXbmhyC', 'worker', 1, '2026-08-26 05:52:34.569705');
INSERT INTO `users` (`id`, `email`, `phone`, `full_name`, `hashed_password`, `role`, `is_active`, `created_at`) VALUES (9, 'vijay.painter@servicehub.com', '9825000006', 'Vijay Rajput', '$2b$12$cnlqU.ehq0lU/0ZyRG/20uubI.q7qplZicTkAc0Evbk0jhfE94MNK', 'worker', 1, '2026-08-26 05:52:34.818482');
INSERT INTO `users` (`id`, `email`, `phone`, `full_name`, `hashed_password`, `role`, `is_active`, `created_at`) VALUES (10, 'anil.applicant@servicehub.com', '9825000007', 'Anil Panchal (New Applicant)', '$2b$12$ixKWgSLYnj0507kqW7bs..gKkydh5oiOS9PeAEsi1JnYXmU1gCizW', 'worker', 1, '2026-08-26 05:52:35.092140');
INSERT INTO `users` (`id`, `email`, `phone`, `full_name`, `hashed_password`, `role`, `is_active`, `created_at`) VALUES (11, 'ketan.applicant@servicehub.com', '9825000008', 'Ketan Chauhan (New Applicant)', '$2b$12$Qb5wKX/6E5MX277kWcxdme6xXKgiBn8D5xIVynjCfgAZeQ7Y6cKN.', 'worker', 1, '2026-08-26 05:52:35.322997');
INSERT INTO `users` (`id`, `email`, `phone`, `full_name`, `hashed_password`, `role`, `is_active`, `created_at`) VALUES (12, 'jeet.barad91@gmail.com', '9726033435', 'jeet barad', '$2b$12$GSaHgDidpR4ftZI7i6PcOOJ5pCPTUvLXHBDNbGFMfM9qsUeyu2Ug6', 'customer', 1, '2026-08-30 16:01:44.042750');
INSERT INTO `users` (`id`, `email`, `phone`, `full_name`, `hashed_password`, `role`, `is_active`, `created_at`) VALUES (13, 'raju.k21@gmail.com', '5468561254', 'raju', '$2b$12$UtEbfGZarnIRIvMFRBKQ3OcXSqRXCM.Q3Q.j6.tjbGPLVPVzYdod6', 'customer', 1, '2026-09-24 17:22:20.022716');
INSERT INTO `users` (`id`, `email`, `phone`, `full_name`, `hashed_password`, `role`, `is_active`, `created_at`) VALUES (14, 'testworker@example.com', '9998887776', 'Test Worker', '$2b$12$ExHlLpPbw.UHeqcuPxKwX.pVgO5eIMUTy2oms2ja9Zs374h9Mj/e2', 'worker', 1, '2026-10-07 07:30:39.518286');
INSERT INTO `users` (`id`, `email`, `phone`, `full_name`, `hashed_password`, `role`, `is_active`, `created_at`) VALUES (15, 'pro_5ac3d5@servicehub.com', '9804721327', 'Santosh Sharma', '$2b$12$7lg51kOjvn4uXuM5XH1whui6MX9F18qUC3QKz3LEK5YwwZo3E5i7y', 'worker', 1, '2026-10-07 07:40:48.598486');
INSERT INTO `users` (`id`, `email`, `phone`, `full_name`, `hashed_password`, `role`, `is_active`, `created_at`) VALUES (16, 'jeet.barad@gmail.com', '97260334', 'jadugar', '$2b$12$ouvQBpuooliSVRz6KPPHwOnb6koCFWFwgWdjcOyz4VZ.gx7R1203a', 'customer', 1, '2026-10-07 07:44:35.136886');
INSERT INTO `users` (`id`, `email`, `phone`, `full_name`, `hashed_password`, `role`, `is_active`, `created_at`) VALUES (17, 'hare@gmail.com', '67231462', 'hare', '$2b$12$T4J6gSGm8BYMDcQ7SQNtdeszowLr..gj9JIlZbdIOSRXwRYXcEpQa', 'customer', 1, '2026-10-07 07:45:26.639413');
INSERT INTO `users` (`id`, `email`, `phone`, `full_name`, `hashed_password`, `role`, `is_active`, `created_at`) VALUES (18, 'testworker999@test.com', '9825099999', 'Test Worker', '$2b$12$brvMrL4d2H2WTV8Fk9inL.PATwGpCgZen4seYyjQ9dIZgGc01CH66', 'worker', 1, '2026-10-07 21:35:55.084847');
INSERT INTO `users` (`id`, `email`, `phone`, `full_name`, `hashed_password`, `role`, `is_active`, `created_at`) VALUES (19, 'praveen_215341@servicehub.com', '9825215341', 'Praveen Sharma 215341', '$2b$12$QTxFMcFfbhBmMN.8pEWLhOGqt7QsPzWSw.x0cYy06rC3GDZ8HhD8m', 'worker', 1, '2026-10-07 21:42:14.557446');

-- Records for table `service_categories`
INSERT INTO `service_categories` (`id`, `name`, `slug`, `icon`, `description`, `base_price`, `is_active`, `created_at`) VALUES (1, 'Plumbing Services', 'plumbing', 'wrench', 'Pipe leakage repair, tap fitting, bathroom installation, water tank cleaning', 299.0, 1, '2026-08-26 05:52:33.260803');
INSERT INTO `service_categories` (`id`, `name`, `slug`, `icon`, `description`, `base_price`, `is_active`, `created_at`) VALUES (2, 'Electrical Services', 'electrical', 'zap', 'Short circuit fixing, switchboard installation, wiring, fan & light setup', 249.0, 1, '2026-08-26 05:52:33.260806');
INSERT INTO `service_categories` (`id`, `name`, `slug`, `icon`, `description`, `base_price`, `is_active`, `created_at`) VALUES (3, 'AC & Appliance Repair', 'ac-appliance', 'snowflake', 'AC servicing, gas refill, washing machine, refrigerator & microwave repair', 499.0, 1, '2026-08-26 05:52:33.260807');
INSERT INTO `service_categories` (`id`, `name`, `slug`, `icon`, `description`, `base_price`, `is_active`, `created_at`) VALUES (4, 'Home Deep Cleaning', 'cleaning', 'sparkles', 'Full house deep cleaning, bathroom sanitization, kitchen chimney degreasing', 799.0, 1, '2026-08-26 05:52:33.260809');
INSERT INTO `service_categories` (`id`, `name`, `slug`, `icon`, `description`, `base_price`, `is_active`, `created_at`) VALUES (5, 'Carpentry & Furniture', 'carpentry', 'hammer', 'Door lock repair, furniture assembly, custom shelves, wooden polishing', 349.0, 1, '2026-08-26 05:52:33.260810');
INSERT INTO `service_categories` (`id`, `name`, `slug`, `icon`, `description`, `base_price`, `is_active`, `created_at`) VALUES (6, 'House Painting & Waterproofing', 'painting', 'paint-roller', 'Interior wall painting, touch-ups, exterior waterproofing, texture designs', 999.0, 1, '2026-08-26 05:52:33.260811');

-- Records for table `worker_profiles`
INSERT INTO `worker_profiles` (`id`, `user_id`, `category_id`, `experience_years`, `hourly_rate`, `bio`, `city`, `locality`, `id_proof_url`, `is_verified`, `is_available`, `is_featured`, `rating_avg`, `total_reviews`, `total_earnings`, `created_at`, `aadhaar_number`, `payment_qr_url`, `upi_id`) VALUES (1, 4, 1, 8, 350.0, 'Certified master plumber with 8+ years experience in CPVC piping and emergency leak fixes.', 'Ahmedabad', 'Navrangpura', '/uploads/sample_id_proof.png', 1, 1, 1, 5.0, 2, 16450.0, '2026-08-26 05:52:33.742309', NULL, '/static/images/payment_qr.png', 'ramesh.mistri@oksbi');
INSERT INTO `worker_profiles` (`id`, `user_id`, `category_id`, `experience_years`, `hourly_rate`, `bio`, `city`, `locality`, `id_proof_url`, `is_verified`, `is_available`, `is_featured`, `rating_avg`, `total_reviews`, `total_earnings`, `created_at`, `aadhaar_number`, `payment_qr_url`, `upi_id`) VALUES (2, 5, 2, 6, 300.0, 'Government licensed wireman. Expert in MCB triage, inverter setup and high-voltage lighting.', 'Ahmedabad', 'Satellite', '/uploads/sample_id_proof.png', 1, 1, 1, 4.8, 38, 11400.0, '2026-08-26 05:52:34.000563', NULL, NULL, NULL);
INSERT INTO `worker_profiles` (`id`, `user_id`, `category_id`, `experience_years`, `hourly_rate`, `bio`, `city`, `locality`, `id_proof_url`, `is_verified`, `is_available`, `is_featured`, `rating_avg`, `total_reviews`, `total_earnings`, `created_at`, `aadhaar_number`, `payment_qr_url`, `upi_id`) VALUES (3, 6, 3, 10, 550.0, 'Specialist in Split & Inverter AC deep jet cleaning, R32/R410 gas charging & compressor testing.', 'Ahmedabad', 'Vastrapur', '/uploads/sample_id_proof.png', 1, 1, 0, 5.0, 29, 15950.0, '2026-08-26 05:52:34.296104', NULL, NULL, NULL);
INSERT INTO `worker_profiles` (`id`, `user_id`, `category_id`, `experience_years`, `hourly_rate`, `bio`, `city`, `locality`, `id_proof_url`, `is_verified`, `is_available`, `is_featured`, `rating_avg`, `total_reviews`, `total_earnings`, `created_at`, `aadhaar_number`, `payment_qr_url`, `upi_id`) VALUES (4, 7, 4, 5, 800.0, 'Professional home sanitization lead with eco-friendly cleaning agents and modern vacuum gear.', 'Ahmedabad', 'Bodakdev', '/uploads/sample_id_proof.png', 1, 1, 1, 4.9, 51, 40800.0, '2026-08-26 05:52:34.572384', NULL, NULL, NULL);
INSERT INTO `worker_profiles` (`id`, `user_id`, `category_id`, `experience_years`, `hourly_rate`, `bio`, `city`, `locality`, `id_proof_url`, `is_verified`, `is_available`, `is_featured`, `rating_avg`, `total_reviews`, `total_earnings`, `created_at`, `aadhaar_number`, `payment_qr_url`, `upi_id`) VALUES (5, 8, 5, 12, 400.0, 'Expert carpenter specialized in modular hinges, Godrej lock installations & teak polish.', 'Ahmedabad', 'Maninagar', '/uploads/sample_id_proof.png', 1, 1, 0, 4.7, 24, 9600.0, '2026-08-26 05:52:34.823951', NULL, NULL, NULL);
INSERT INTO `worker_profiles` (`id`, `user_id`, `category_id`, `experience_years`, `hourly_rate`, `bio`, `city`, `locality`, `id_proof_url`, `is_verified`, `is_available`, `is_featured`, `rating_avg`, `total_reviews`, `total_earnings`, `created_at`, `aadhaar_number`, `payment_qr_url`, `upi_id`) VALUES (6, 9, 6, 7, 1100.0, 'Asian Paints certified master applicator with zero-dust airless spray equipment.', 'Ahmedabad', 'Chandkheda', '/uploads/sample_id_proof.png', 1, 1, 0, 4.8, 19, 20900.0, '2026-08-26 05:52:35.093540', NULL, NULL, NULL);
INSERT INTO `worker_profiles` (`id`, `user_id`, `category_id`, `experience_years`, `hourly_rate`, `bio`, `city`, `locality`, `id_proof_url`, `is_verified`, `is_available`, `is_featured`, `rating_avg`, `total_reviews`, `total_earnings`, `created_at`, `aadhaar_number`, `payment_qr_url`, `upi_id`) VALUES (7, 10, 1, 3, 280.0, 'Experienced local plumber seeking verified badge. Specializes in bathroom fittings.', 'Ahmedabad', 'Paldi', '/uploads/sample_id_proof.png', 1, 1, 0, 5.0, 0, 0.0, '2026-08-26 05:52:35.326837', NULL, NULL, NULL);
INSERT INTO `worker_profiles` (`id`, `user_id`, `category_id`, `experience_years`, `hourly_rate`, `bio`, `city`, `locality`, `id_proof_url`, `is_verified`, `is_available`, `is_featured`, `rating_avg`, `total_reviews`, `total_earnings`, `created_at`, `aadhaar_number`, `payment_qr_url`, `upi_id`) VALUES (8, 11, 2, 4, 320.0, 'Diploma in Electrical Eng. Certified in smart home switches & LED architectural profiles.', 'Ahmedabad', 'Gota', '/uploads/sample_id_proof.png', 1, 1, 0, 5.0, 0, 0.0, '2026-08-26 05:52:35.331612', NULL, NULL, NULL);
INSERT INTO `worker_profiles` (`id`, `user_id`, `category_id`, `experience_years`, `hourly_rate`, `bio`, `city`, `locality`, `id_proof_url`, `is_verified`, `is_available`, `is_featured`, `rating_avg`, `total_reviews`, `total_earnings`, `created_at`, `aadhaar_number`, `payment_qr_url`, `upi_id`) VALUES (9, 14, 1, 3, 350.0, 'Expert technician', 'Ahmedabad', 'Navrangpura', '/uploads/test.jpg', 0, 1, 0, 5.0, 0, 0.0, '2026-10-07 07:30:39.699946', '123456789012', NULL, NULL);
INSERT INTO `worker_profiles` (`id`, `user_id`, `category_id`, `experience_years`, `hourly_rate`, `bio`, `city`, `locality`, `id_proof_url`, `is_verified`, `is_available`, `is_featured`, `rating_avg`, `total_reviews`, `total_earnings`, `created_at`, `aadhaar_number`, `payment_qr_url`, `upi_id`) VALUES (10, 15, 1, 4, 350.0, 'Certified background-verified technician.', 'Ahmedabad', 'Navrangpura', '/uploads/sample_aadhaar_card.png', 1, 1, 0, 5.0, 0, 0.0, '2026-10-07 07:40:48.807424', '4291 8023 9104', NULL, NULL);
INSERT INTO `worker_profiles` (`id`, `user_id`, `category_id`, `experience_years`, `hourly_rate`, `bio`, `city`, `locality`, `id_proof_url`, `is_verified`, `is_available`, `is_featured`, `rating_avg`, `total_reviews`, `total_earnings`, `created_at`, `aadhaar_number`, `payment_qr_url`, `upi_id`) VALUES (11, 18, 1, 3, 350.0, 'Certified technician', 'Ahmedabad', 'Navrangpura', '/uploads/sample_aadhaar_card.png', 0, 1, 0, 5.0, 0, 0.0, '2026-10-07 21:35:55.314703', '429180239104', NULL, NULL);
INSERT INTO `worker_profiles` (`id`, `user_id`, `category_id`, `experience_years`, `hourly_rate`, `bio`, `city`, `locality`, `id_proof_url`, `is_verified`, `is_available`, `is_featured`, `rating_avg`, `total_reviews`, `total_earnings`, `created_at`, `aadhaar_number`, `payment_qr_url`, `upi_id`) VALUES (12, 19, 1, 4, 350.0, 'Certified background-verified plumbing specialist.', 'Ahmedabad', 'Navrangpura', '/uploads/sample_aadhaar_card.png', 0, 1, 0, 5.0, 0, 0.0, '2026-10-07 21:42:14.790535', '429180239104', NULL, NULL);

-- Records for table `bookings`
INSERT INTO `bookings` (`id`, `booking_ref`, `customer_id`, `worker_id`, `category_id`, `service_address`, `city`, `locality`, `scheduled_time`, `is_instant`, `status`, `total_amount`, `problem_description`, `notes`, `created_at`, `updated_at`, `payment_status`, `payment_method`, `transaction_ref`, `paid_at`) VALUES (1, 'SH-PLUMB842', 2, 1, 1, '402, Shivalik Highstreet, Near Keshavbaug, Vastrapur', 'Ahmedabad', 'Vastrapur', '2026-08-24 05:52:35.339581', 1, 'COMPLETED', 350.0, 'Severe bathroom pipe joint leakage under sink.', NULL, '2026-08-26 05:52:35.340695', '2026-08-26 05:52:35.340698', 'PAID', 'UPI (Google Pay)', 'TXN-SH-984210', NULL);
INSERT INTO `bookings` (`id`, `booking_ref`, `customer_id`, `worker_id`, `category_id`, `service_address`, `city`, `locality`, `scheduled_time`, `is_instant`, `status`, `total_amount`, `problem_description`, `notes`, `created_at`, `updated_at`, `payment_status`, `payment_method`, `transaction_ref`, `paid_at`) VALUES (2, 'SH-ELEC5913', 3, 2, 2, 'B-12, Orchid Harmony, Near Iscon Temple, Satellite', 'Ahmedabad', 'Satellite', '2026-08-26 05:52:35.348258', 1, 'IN_PROGRESS', 300.0, 'Main tripping MCB issue and spark in AC power switchboard.', NULL, '2026-08-26 05:52:35.348813', '2026-08-26 05:52:35.348816', 'UNPAID', NULL, NULL, NULL);
INSERT INTO `bookings` (`id`, `booking_ref`, `customer_id`, `worker_id`, `category_id`, `service_address`, `city`, `locality`, `scheduled_time`, `is_instant`, `status`, `total_amount`, `problem_description`, `notes`, `created_at`, `updated_at`, `payment_status`, `payment_method`, `transaction_ref`, `paid_at`) VALUES (3, 'SH-9C1AC4CE', 2, 1, 1, 'Flat 502, Shivalik Heights, Vastrapur, Ahmedabad', 'Ahmedabad', 'Vastrapur', '2026-08-26 05:57:27.147700', 1, 'COMPLETED', 350.0, 'Water pipe burst under kitchen sink.', ' [Payment: Direct cash received by technician]', '2026-08-26 05:57:27.149576', '2026-10-06 15:14:22.211962', 'PAID', 'Cash on Service', 'TXN-SH-E7E04CCD', '2026-10-06 15:14:22.210995');
INSERT INTO `bookings` (`id`, `booking_ref`, `customer_id`, `worker_id`, `category_id`, `service_address`, `city`, `locality`, `scheduled_time`, `is_instant`, `status`, `total_amount`, `problem_description`, `notes`, `created_at`, `updated_at`, `payment_status`, `payment_method`, `transaction_ref`, `paid_at`) VALUES (4, 'SH-2955290A', 13, 4, 4, 'jadugar appart', 'Ahmedabad', 'vaishalinagar', '2026-10-06 15:09:04.023716', 1, 'PENDING', 800.0, 'clean houseee ', NULL, '2026-10-06 15:09:04.027419', '2026-10-06 15:09:04.027425', 'UNPAID', NULL, NULL, NULL);
INSERT INTO `bookings` (`id`, `booking_ref`, `customer_id`, `worker_id`, `category_id`, `service_address`, `city`, `locality`, `scheduled_time`, `is_instant`, `status`, `total_amount`, `problem_description`, `notes`, `created_at`, `updated_at`, `payment_status`, `payment_method`, `transaction_ref`, `paid_at`) VALUES (5, 'SH-E8BB8D0E', 2, 1, 1, 'fsdf sdf ', 'Ahmedabad', 'sdfsdfs', '2026-10-06 15:11:09.071996', 1, 'COMPLETED', 350.0, 'fsdfsdfsd', NULL, '2026-10-06 15:11:09.072869', '2026-10-07 08:38:42.292550', 'PAID', 'Card ending in 8912 (CVV Verified)', 'CARD-98217341', '2026-10-07 08:38:42.291026');
INSERT INTO `bookings` (`id`, `booking_ref`, `customer_id`, `worker_id`, `category_id`, `service_address`, `city`, `locality`, `scheduled_time`, `is_instant`, `status`, `total_amount`, `problem_description`, `notes`, `created_at`, `updated_at`, `payment_status`, `payment_method`, `transaction_ref`, `paid_at`) VALUES (6, 'SH-1664DDA1', 2, 1, 1, 'dasdsad sdd asd a', 'Ahmedabad', 'sdasda dssad', '2026-10-07 06:22:08.928128', 1, 'IN_PROGRESS', 350.0, 'muje a saudasdj ', NULL, '2026-10-07 06:22:08.929674', '2026-10-07 21:49:43.374627', 'UNPAID', NULL, NULL, NULL);
INSERT INTO `bookings` (`id`, `booking_ref`, `customer_id`, `worker_id`, `category_id`, `service_address`, `city`, `locality`, `scheduled_time`, `is_instant`, `status`, `total_amount`, `problem_description`, `notes`, `created_at`, `updated_at`, `payment_status`, `payment_method`, `transaction_ref`, `paid_at`) VALUES (7, 'SH-E637F4DB', 2, 1, 1, 'jagdashduash d', 'Ahmedabad', 'skjdnlkasl d', '2026-10-07 07:24:09.666606', 1, 'IN_PROGRESS', 350.0, ' lkasjdlkajld cjalxj lc', NULL, '2026-10-07 07:24:09.673212', '2026-10-07 07:25:36.359000', 'UNPAID', NULL, NULL, NULL);
INSERT INTO `bookings` (`id`, `booking_ref`, `customer_id`, `worker_id`, `category_id`, `service_address`, `city`, `locality`, `scheduled_time`, `is_instant`, `status`, `total_amount`, `problem_description`, `notes`, `created_at`, `updated_at`, `payment_status`, `payment_method`, `transaction_ref`, `paid_at`) VALUES (8, 'SH-10748A12', 2, 1, 1, 'jg,kbvfghgjhjhjb vhvhjvhj', 'Ahmedabad', 'jjklhkjgkjgkj', '2026-10-07 09:01:02.913377', 1, 'COMPLETED', 350.0, 'hwergdchghg', NULL, '2026-10-07 09:01:02.917077', '2026-10-07 21:48:06.979678', 'PAID', 'UPI QR Code (Google Pay)', 'UPI-545197245079', '2026-10-07 21:48:06.972552');
INSERT INTO `bookings` (`id`, `booking_ref`, `customer_id`, `worker_id`, `category_id`, `service_address`, `city`, `locality`, `scheduled_time`, `is_instant`, `status`, `total_amount`, `problem_description`, `notes`, `created_at`, `updated_at`, `payment_status`, `payment_method`, `transaction_ref`, `paid_at`) VALUES (9, 'SH-8CE4E28F', 2, 1, 1, 'Flat 402, Navrangpura, Ahmedabad', 'Ahmedabad', 'Navrangpura', '2026-10-07 21:59:03.814075', 1, 'IN_PROGRESS', 350.0, 'Test End OTP generation instant speed', NULL, '2026-10-07 21:59:03.815282', '2026-10-07 21:59:10.599264', 'UNPAID', NULL, NULL, NULL);
INSERT INTO `bookings` (`id`, `booking_ref`, `customer_id`, `worker_id`, `category_id`, `service_address`, `city`, `locality`, `scheduled_time`, `is_instant`, `status`, `total_amount`, `problem_description`, `notes`, `created_at`, `updated_at`, `payment_status`, `payment_method`, `transaction_ref`, `paid_at`) VALUES (10, 'SH-5A6064CF', 2, 1, 1, 'Flat 101, Ahmedabad', 'Ahmedabad', 'Navrangpura', '2026-10-07 22:01:23.017947', 1, 'COMPLETED', 350.0, 'Instant End OTP verification test', ' [Payment: Direct cash received by technician]', '2026-10-07 22:01:23.018294', '2026-10-07 22:12:57.430214', 'PAID', 'Cash on Service', 'TXN-SH-E4199277', '2026-10-07 22:12:57.428265');
INSERT INTO `bookings` (`id`, `booking_ref`, `customer_id`, `worker_id`, `category_id`, `service_address`, `city`, `locality`, `scheduled_time`, `is_instant`, `status`, `total_amount`, `problem_description`, `notes`, `created_at`, `updated_at`, `payment_status`, `payment_method`, `transaction_ref`, `paid_at`) VALUES (11, 'SH-7AE222AF', 2, 1, 1, 'Test Flat 501, Ahmedabad', 'Ahmedabad', 'Navrangpura', '2026-10-07 22:07:07.046975', 1, 'COMPLETED', 350.0, 'End OTP speed verification', ' [Payment: Direct cash received by technician]', '2026-10-07 22:07:07.049114', '2026-10-07 22:13:07.482625', 'PAID', 'Cash on Service', 'TXN-SH-B4697803', '2026-10-07 22:13:07.482078');
INSERT INTO `bookings` (`id`, `booking_ref`, `customer_id`, `worker_id`, `category_id`, `service_address`, `city`, `locality`, `scheduled_time`, `is_instant`, `status`, `total_amount`, `problem_description`, `notes`, `created_at`, `updated_at`, `payment_status`, `payment_method`, `transaction_ref`, `paid_at`) VALUES (12, 'SH-92FA2C90', 2, 2, 2, 'dasd sad', 'Ahmedabad', 'asdadads dd', '2026-10-07 22:13:56.462541', 1, 'ACCEPTED', 300.0, 'ssd gsfgdf d fd fsd fd s ', NULL, '2026-10-07 22:13:56.464012', '2026-10-07 22:14:00.627927', 'UNPAID', NULL, NULL, NULL);

-- Records for table `otp_verifications`
INSERT INTO `otp_verifications` (`id`, `booking_id`, `otp_type`, `otp_code`, `is_verified`, `verified_at`, `created_at`) VALUES (1, 1, 'START', '4821', 1, '2026-08-24 04:52:35.345997', '2026-08-26 05:52:35.353568');
INSERT INTO `otp_verifications` (`id`, `booking_id`, `otp_type`, `otp_code`, `is_verified`, `verified_at`, `created_at`) VALUES (2, 1, 'END', '9134', 1, '2026-08-24 05:52:35.346051', '2026-08-26 05:52:35.353576');
INSERT INTO `otp_verifications` (`id`, `booking_id`, `otp_type`, `otp_code`, `is_verified`, `verified_at`, `created_at`) VALUES (3, 2, 'START', '7319', 1, '2026-08-26 05:52:35.359206', '2026-08-26 05:52:35.359652');
INSERT INTO `otp_verifications` (`id`, `booking_id`, `otp_type`, `otp_code`, `is_verified`, `verified_at`, `created_at`) VALUES (4, 3, 'START', '7895', 1, '2026-08-26 05:57:27.229475', '2026-08-26 05:57:27.205179');
INSERT INTO `otp_verifications` (`id`, `booking_id`, `otp_type`, `otp_code`, `is_verified`, `verified_at`, `created_at`) VALUES (5, 3, 'END', '2454', 1, '2026-08-26 05:57:27.264568', '2026-08-26 05:57:27.243746');
INSERT INTO `otp_verifications` (`id`, `booking_id`, `otp_type`, `otp_code`, `is_verified`, `verified_at`, `created_at`) VALUES (6, 5, 'START', '4169', 1, '2026-10-06 15:13:29.527322', '2026-10-06 15:11:34.643320');
INSERT INTO `otp_verifications` (`id`, `booking_id`, `otp_type`, `otp_code`, `is_verified`, `verified_at`, `created_at`) VALUES (7, 5, 'END', '1427', 1, '2026-10-06 15:40:45.771607', '2026-10-06 15:39:59.357707');
INSERT INTO `otp_verifications` (`id`, `booking_id`, `otp_type`, `otp_code`, `is_verified`, `verified_at`, `created_at`) VALUES (8, 7, 'START', '2882', 1, '2026-10-07 07:25:36.357752', '2026-10-07 07:24:49.165087');
INSERT INTO `otp_verifications` (`id`, `booking_id`, `otp_type`, `otp_code`, `is_verified`, `verified_at`, `created_at`) VALUES (9, 8, 'START', '1576', 1, '2026-10-07 09:06:46.066581', '2026-10-07 09:02:40.928424');
INSERT INTO `otp_verifications` (`id`, `booking_id`, `otp_type`, `otp_code`, `is_verified`, `verified_at`, `created_at`) VALUES (10, 8, 'END', '5702', 1, '2026-10-07 09:07:41.972718', '2026-10-07 09:06:56.779582');
INSERT INTO `otp_verifications` (`id`, `booking_id`, `otp_type`, `otp_code`, `is_verified`, `verified_at`, `created_at`) VALUES (11, 6, 'START', '1650', 1, '2026-10-07 21:49:43.374153', '2026-10-07 21:49:27.491509');
INSERT INTO `otp_verifications` (`id`, `booking_id`, `otp_type`, `otp_code`, `is_verified`, `verified_at`, `created_at`) VALUES (12, 9, 'START', '2234', 1, '2026-10-07 21:59:10.598910', '2026-10-07 21:59:08.396371');
INSERT INTO `otp_verifications` (`id`, `booking_id`, `otp_type`, `otp_code`, `is_verified`, `verified_at`, `created_at`) VALUES (13, 9, 'END', '1896', 0, NULL, '2026-10-07 22:00:24.143737');
INSERT INTO `otp_verifications` (`id`, `booking_id`, `otp_type`, `otp_code`, `is_verified`, `verified_at`, `created_at`) VALUES (14, 10, 'START', '1972', 1, '2026-10-07 22:01:29.685221', '2026-10-07 22:01:27.457206');
INSERT INTO `otp_verifications` (`id`, `booking_id`, `otp_type`, `otp_code`, `is_verified`, `verified_at`, `created_at`) VALUES (15, 2, 'END_TEST', '9999', 0, NULL, '2026-10-07 22:02:40.862252');
INSERT INTO `otp_verifications` (`id`, `booking_id`, `otp_type`, `otp_code`, `is_verified`, `verified_at`, `created_at`) VALUES (16, 11, 'START', '3610', 1, '2026-10-07 22:07:13.701961', '2026-10-07 22:07:11.495618');
INSERT INTO `otp_verifications` (`id`, `booking_id`, `otp_type`, `otp_code`, `is_verified`, `verified_at`, `created_at`) VALUES (17, 11, 'END', '4016', 1, '2026-10-07 22:07:18.154252', '2026-10-07 22:07:13.704800');
INSERT INTO `otp_verifications` (`id`, `booking_id`, `otp_type`, `otp_code`, `is_verified`, `verified_at`, `created_at`) VALUES (18, 10, 'END', '5916', 1, '2026-10-07 22:12:39.808816', '2026-10-07 22:07:15.921535');
INSERT INTO `otp_verifications` (`id`, `booking_id`, `otp_type`, `otp_code`, `is_verified`, `verified_at`, `created_at`) VALUES (19, 7, 'END', '5346', 0, NULL, '2026-10-07 22:07:15.921539');
INSERT INTO `otp_verifications` (`id`, `booking_id`, `otp_type`, `otp_code`, `is_verified`, `verified_at`, `created_at`) VALUES (20, 6, 'END', '4324', 0, NULL, '2026-10-07 22:07:15.921540');
INSERT INTO `otp_verifications` (`id`, `booking_id`, `otp_type`, `otp_code`, `is_verified`, `verified_at`, `created_at`) VALUES (21, 2, 'END', '1941', 0, NULL, '2026-10-07 22:13:37.217078');

-- Records for table `reviews`
INSERT INTO `reviews` (`id`, `booking_id`, `customer_id`, `worker_id`, `rating`, `review_text`, `created_at`) VALUES (1, 1, 2, 1, 5, 'Ramesh bhai arrived within 25 minutes! Fixed the pipe leakage quickly with proper spare parts. Highly recommended!', '2026-08-26 05:52:35.354847');
INSERT INTO `reviews` (`id`, `booking_id`, `customer_id`, `worker_id`, `rating`, `review_text`, `created_at`) VALUES (2, 3, 2, 1, 5, 'Excellent plumbing work! Fixed the pipe leakage in under 20 mins. Highly professional.', '2026-08-26 05:57:27.282476');

SET FOREIGN_KEY_CHECKS = 1;
