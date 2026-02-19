DROP DATABASE IF EXISTS `ecommerce_db`;
CREATE DATABASE `ecommerce_db`;
USE `ecommerce_db`;

-- =====================================
-- CURRENCIES
-- =====================================
CREATE TABLE `currencies` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `currency_code` VARCHAR(10) NOT NULL UNIQUE,
    `currency_name` VARCHAR(100) NOT NULL,
    `currency_symbol` VARCHAR(10) NOT NULL
);

INSERT INTO `currencies` (`currency_code`, `currency_name`, `currency_symbol`) VALUES
('USD', 'US Dollar', '$'),
('ZAR', 'South African Rand', 'R'),
('EUR', 'Euro', '€'),
('GBP', 'British Pound', '£'),
('NGN', 'Nigerian Naira', '₦'),
('KES', 'Kenyan Shilling', 'KSh'),
('CAD', 'Canadian Dollar', '$'),
('AUD', 'Australian Dollar', '$'),
('JPY', 'Japanese Yen', '¥'),
('CNY', 'Chinese Yuan', '¥'),
('INR', 'Indian Rupee', '₹'),
('BRL', 'Brazilian Real', 'R$'),
('MXN', 'Mexican Peso', '$'),
('RUB', 'Russian Ruble', '₽'),
('KRW', 'South Korean Won', '₩'),
('EGP', 'Egyptian Pound', '£'),
('SAR', 'Saudi Riyal', '﷼'),
('AED', 'UAE Dirham', 'د.إ');

-- =====================================
-- COUNTRIES
-- =====================================
CREATE TABLE `countries` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `country_name` VARCHAR(100) NOT NULL,
    `country_code` VARCHAR(10) NOT NULL UNIQUE,
    `currency_code` VARCHAR(10) NOT NULL,
    FOREIGN KEY (`currency_code`) REFERENCES `currencies`(`currency_code`)
);

INSERT INTO `countries` (`country_name`, `country_code`, `currency_code`) VALUES
('South Africa', 'ZA', 'ZAR'),
('United States', 'US', 'USD'),
('United Kingdom', 'GB', 'GBP'),
('France', 'FR', 'EUR'),
('Nigeria', 'NG', 'NGN'),
('Kenya', 'KE', 'KES'),
('Canada', 'CA', 'CAD'),
('Australia', 'AU', 'AUD'),
('Germany', 'DE', 'EUR'),
('Japan', 'JP', 'JPY'),
('China', 'CN', 'CNY'),
('India', 'IN', 'INR'),
('Brazil', 'BR', 'BRL'),
('Mexico', 'MX', 'MXN'),
('Russia', 'RU', 'RUB'),
('South Korea', 'KR', 'KRW'),
('Italy', 'IT', 'EUR'),
('Spain', 'ES', 'EUR'),
('Egypt', 'EG', 'EGP'),
('Saudi Arabia', 'SA', 'SAR'),
('United Arab Emirates', 'AE', 'AED');

-- =====================================
-- CURRENCY RATES
-- =====================================
CREATE TABLE `currency_rates` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `currency_code` VARCHAR(10) NOT NULL,
    `rate_from_usd` DECIMAL(15,6) NOT NULL,
    `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`currency_code`) REFERENCES `currencies`(`currency_code`)
);

INSERT INTO `currency_rates` (`currency_code`, `rate_from_usd`) VALUES
('USD', 1.000000),
('ZAR', 18.500000),
('EUR', 0.920000),
('GBP', 0.780000),
('NGN', 1500.000000),
('KES', 160.000000);

-- =====================================
-- USERS
-- =====================================
CREATE TABLE `users` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(20) DEFAULT 'user',
  `country_id` INT,
  `currency_code` VARCHAR(10),
  `gender` VARCHAR(20),
  `referral_source` VARCHAR(50),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`),
  FOREIGN KEY (`currency_code`) REFERENCES `currencies`(`currency_code`)
);

INSERT INTO `users`
(`full_name`, `email`, `password`, `role`, `country_id`, `currency_code`, `gender`, `referral_source`) 
VALUES ('Liam Johnson', 'liam.johnson@gmail.com', '$2b$10$6P4NSg/OHCNY9JrRg365JO/QTo3j1jkU1PTQ6IGJdlK/CNiqbhgfi','user', 21, 'AED', NULL, NULL),
       ('Olivia Smith', 'olivia.smith@email.com', '$2b$10$6P4NSg/OHCNY9JrRg365JO/QTo3j1jkU1PTQ6IGJdlK/CNiqbhgfi','user', 8, 'AUD', NULL, NULL),
	     ('Thomas Price', 'thomas.price@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
       ('Wyatt Bennett', 'wyatt.bennett@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
       ('Jordan Foster', 'jordan.foster@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
       ('Sam Smith', 'sam.smith@email.com', '$2b$10$MITQ1WD7vGUiFLnDNxykUOOVF1GYHeGJ.pM42c4s5I5CMXwvn5kYG','user', 15, 'RUB', 'Male', 'Other');

-- =====================================
-- CATEGORIES
-- =====================================
CREATE TABLE `categories` (
    `category_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO `categories` (`name`) 
VALUES ('Luggage & Travel'),
       ('Bags'),
       ('Electronics'),
       ('Travel Essentials');

-- =====================================
-- PRODUCTS
-- =====================================
CREATE TABLE `products` (
  `product_id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `stock` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`)
);

INSERT INTO `products`
(`category_id`, `name`, `description`, `price`, `stock`) 
VALUES (1, 'Horizon S1 Luggage', 'Carbon-fiber smart luggage with biometric lock and GPS.', 3400.00, 13),
       (2, 'Pulse B1 Backpack', 'Anti-theft backpack with USB-C charging and RFID pocket.', 2600.00, 14),
       (4, 'Aura T1 Flask Cup', 'Smart temperature flask with UV purification.', 750.00, 20),
       (3, 'Zenith Headset', 'Noise-cancelling headset with biometric monitoring.', 1300.00, 10), 
       (4, 'Zen N1 Neck Pillow ', '\r The Zen N1 is engineered to eliminate the \"stiff neck\" associated with long-haul travel. It combines structural support with active recovery technology to provide a spa-like experience at 35,000 feet.\r \r 3D Deep-Tissue Massage: Integrated micro-nodes perform a rhythmic Shiatsu massage to knead out muscle knots and tension.\r \r Graphene Heat Therapy: Carbon-fiber heating elements reach up to 45°C (113°F) to soothe muscles and improve blood circulation.\r \r Smart-Posture Sensor: Gently vibrates if your head slumps into a position that could cause strain, guiding you back to ergonomic alignment.\r \r The Zen Pulse: A central cyan LED ring pulses in sync with your selected massage mode, doubling as a soft ambient light for your immediate space.', '1599.00', '30'),
	     (4, 'Lume E1 Sleep Mask', 'The Lume E1 is a light-therapy visor designed to master your circadian rhythm. It creates a total blackout environment while using controlled light to help your body transition between time zones.\n\nCircadian Light Therapy: Internal LED panels simulate a gradual \"Sunset\" to trigger melatonin or a \"Sunrise\" to wake you up naturally, reducing jet lag.\n\nHaptic Silent Alarm: Instead of audio, the mask uses gentle pulses against your temples to wake you up without disturbing the cabin.\n\nZero-Pressure REM Cavities: Sculpted interior allows your eyes to move freely during deep sleep, preventing pressure on your eyelids or lashes.\n\nLume Status Strip: A sleek cyan LED line on the temple indicates battery life and sync status with the Arc Travel app.', '349.00', '20');


-- =====================================
-- CART
-- =====================================
CREATE TABLE `cart_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT DEFAULT 1,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE
);

-- =====================================
-- ORDERS
-- =====================================
CREATE TABLE `orders` (
  `order_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `total_price` DECIMAL(15,2),
  `currency_code` VARCHAR(10),
  `exchange_rate_used` DECIMAL(15,6),
  `status` ENUM('pending','paid','cancelled','refunded') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`currency_code`) REFERENCES `currencies`(`currency_code`)
);

-- =====================================
-- ORDER ITEMS
-- =====================================
CREATE TABLE `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `price_usd` DECIMAL(10,2) NOT NULL,
  `converted_price` DECIMAL(15,2),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE
);

-- =====================================
-- PAYMENTS
-- =====================================
CREATE TABLE `payments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT,
    `payment_method` VARCHAR(50),
    `payment_status` VARCHAR(50),
    `transaction_reference` VARCHAR(255),
    `paid_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`)
);

-- =====================================
-- REVIEWS
-- =====================================
CREATE TABLE `reviews` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT,
    `product_id` INT,
    `rating` INT CHECK (`rating` BETWEEN 1 AND 5),
    `comment` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`),
    FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`)
);

-- =====================================
-- WISHLIST
-- =====================================
CREATE TABLE `wishlist` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT,
    `product_id` INT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`),
    FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`)
);
