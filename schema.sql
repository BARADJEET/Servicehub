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
