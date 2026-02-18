DROP DATABASE IF EXISTS ecommerce_db;
CREATE DATABASE ecommerce_db;
USE ecommerce_db;

CREATE TABLE currencies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    currency_code VARCHAR(10) NOT NULL UNIQUE,
    currency_name VARCHAR(100) NOT NULL,
    currency_symbol VARCHAR(10) NOT NULL
);

INSERT INTO currencies (currency_code, currency_name, currency_symbol) VALUES
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

CREATE TABLE countries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    country_name VARCHAR(100) NOT NULL,
    country_code VARCHAR(10) NOT NULL UNIQUE,
    currency_code VARCHAR(10) NOT NULL,
    FOREIGN KEY (currency_code) REFERENCES currencies(currency_code)
);

INSERT INTO countries (country_name, country_code, currency_code) VALUES
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

CREATE TABLE currency_rates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    currency_code VARCHAR(10) NOT NULL,
    rate_from_usd DECIMAL(15,6) NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (currency_code) REFERENCES currencies(currency_code)
);

INSERT INTO currency_rates (currency_code, rate_from_usd) VALUES
('USD', 1.000000),
('ZAR', 18.500000),
('EUR', 0.920000),
('GBP', 0.780000),
('NGN', 1500.000000),
('KES', 160.000000);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  country_id INT,
  currency_code VARCHAR(10),
  gender VARCHAR(20),
  referral_source VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (country_id) REFERENCES countries(id),
  FOREIGN KEY (currency_code) REFERENCES currencies(currency_code)
);

INSERT INTO users (full_name, email, password, role, country_id, currency_code, gender, referral_source) VALUES
('Liam Johnson', 'liam.johnson@gmail.com', '$2b$10$6P4NSg/OHCNY9JrRg365JO/QTo3j1jkU1PTQ6IGJdlK/CNiqbhgfi', 'user', 27, 'AED', NULL, NULL),
('Olivia Smith', 'olivia.smith@email.com', '$2b$10$6P4NSg/OHCNY9JrRg365JO/QTo3j1jkU1PTQ6IGJdlK/CNiqbhgfi', 'user', 11, 'AUD', NULL, NULL),
('Noah Williams', 'noah.williams@email.com', '$2b$10$6P4NSg/OHCNY9JrRg365JO/QTo3j1jkU1PTQ6IGJdlK/CNiqbhgfi', 'user', 17, 'BRL', NULL, NULL),
('Emma Brown', 'emma.brown@email.com', '$2b$10$6P4NSg/OHCNY9JrRg365JO/QTo3j1jkU1PTQ6IGJdlK/CNiqbhgfi', 'user', 10, 'CAD', NULL, NULL),
('Ava Jones', 'ava.jones@email.com', '$2b$10$6P4NSg/OHCNY9JrRg365JO/QTo3j1jkU1PTQ6IGJdlK/CNiqbhgfi', 'user', 15, 'CNY', NULL, NULL),
('Sophia Garcia', 'sophia.garcia@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Isabella Martinez', 'isabella.martinez@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Mason Rodriguez', 'mason.rodriguez@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Lucas Hernandez', 'lucas.hernandez@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Mia Lopez', 'mia.lopez@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Ethan Gonzalez', 'ethan.gonzalez@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Amelia Wilson', 'amelia.wilson@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Harper Anderson', 'harper.anderson@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Elijah Thomas', 'elijah.thomas@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Charlotte Taylor', 'charlotte.taylor@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('James Moore', 'james.moore@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Benjamin Jackson', 'ben.jackson@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Evelyn Martin', 'evelyn.martin@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Alexander Lee', 'alex.lee@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Abigail Perez', 'abigail.perez@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Michael Thompson', 'michael.thompson@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Daniel White', 'daniel.white@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Matthew Harris', 'matthew.harris@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Samuel Clark', 'samuel.clark@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('David Lewis', 'david.lewis@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Joseph Robinson', 'joseph.robinson@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Henry Walker', 'henry.walker@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Sebastian Young', 'sebastian.young@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Jack Allen', 'jack.allen@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Owen King', 'owen.king@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Gabriel Wright', 'gabriel.wright@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Julian Scott', 'julian.scott@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Levi Green', 'levi.green@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Dylan Adams', 'dylan.adams@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Nathan Baker', 'nathan.baker@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Aaron Nelson', 'aaron.nelson@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Isaac Carter', 'isaac.carter@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Anthony Mitchell', 'anthony.mitchell@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Hudson Perez', 'hudson.perez@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Christopher Roberts', 'christopher.roberts@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Zoey Turner', 'zoey.turner@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Lily Phillips', 'lily.phillips@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Hannah Campbell', 'hannah.campbell@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Scarlett Parker', 'scarlett.parker@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Victoria Evans', 'victoria.evans@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Madison Edwards', 'madison.edwards@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Grace Collins', 'grace.collins@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Chloe Stewart', 'chloe.stewart@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Penelope Sanchez', 'penelope.sanchez@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Riley Morris', 'riley.morris@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Layla Rogers', 'layla.rogers@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Nora Reed', 'nora.reed@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Hazel Cook', 'hazel.cook@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Violet Morgan', 'violet.morgan@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Aurora Bell', 'aurora.bell@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Savannah Murphy', 'savannah.murphy@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Audrey Bailey', 'audrey.bailey@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Brooklyn Rivera', 'brooklyn.rivera@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Bella Cooper', 'bella.cooper@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Claire Richardson', 'claire.richardson@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Skylar Cox', 'skylar.cox@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Lucy Howard', 'lucy.howard@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Paisley Ward', 'paisley.ward@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Everly Torres', 'everly.torres@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Anna Peterson', 'anna.peterson@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Caroline Gray', 'caroline.gray@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Genesis Ramirez', 'genesis.ramirez@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Kennedy James', 'kennedy.james@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Samantha Watson', 'samantha.watson@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Allison Brooks', 'allison.brooks@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Connor Kelly', 'connor.kelly@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Caleb Sanders', 'caleb.sanders@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Thomas Price', 'thomas.price@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Wyatt Bennett', 'wyatt.bennett@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Jayden Wood', 'jayden.wood@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Ryan Barnes', 'ryan.barnes@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Asher Ross', 'asher.ross@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Brayden Henderson', 'brayden.henderson@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Luke Coleman', 'luke.coleman@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Isaiah Jenkins', 'isaiah.jenkins@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Andrew Perry', 'andrew.perry@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Joshua Powell', 'joshua.powell@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Nathaniel Long', 'nathaniel.long@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Christian Patterson', 'christian.patterson@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Jonathan Hughes', 'jonathan.hughes@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Eli Flores', 'eli.flores@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Hunter Washington', 'hunter.washington@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Cameron Butler', 'cameron.butler@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Adrian Simmons', 'adrian.simmons@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Jordan Foster', 'jordan.foster@email.com', 'hashedpassword', 'user', NULL, NULL, NULL, NULL),
('Sam Smith', 'sam.smith@email.com', '$2b$10$MITQ1WD7vGUiFLnDNxykUOOVF1GYHeGJ.pM42c4s5I5CMXwvn5kYG', 'user', 19, 'RUB', 'Male', 'Other');

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);
INSERT INTO `ecommerce_db`.`categories` (`id`, `name`) VALUES ('1', 'Luggage & Travel');
INSERT INTO `ecommerce_db`.`categories` (`id`, `name`) VALUES ('2', 'Bags');
INSERT INTO `ecommerce_db`.`categories` (`id`, `name`) VALUES ('3', 'Eletronics');
INSERT INTO `ecommerce_db`.`categories` (`id`, `name`) VALUES ('4', 'Travel Essentials');

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(255),
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

INSERT INTO `ecommerce_db`.`products` (`category_id`, `name`, `description`, `price`, `image_url`, `stock`) VALUES ('1', 'Horizon  S1 Luggage', 'The Horizon S1 is the foundation of the ecosystem. Designed with a carbon-fiber shell and an aerodynamic profile, it is built to endure the rigors of global transit while keeping your belongings in a high-tech vault.\n\nBiometric Security: Integrated fingerprint scanner eliminates the need for keys or combinations.\n\nSelf-Weighing Handle: Built-in digital scale in the top handle ensures you never face unexpected baggage fees.\n\nActive Tracking: Global GPS connectivity allows you to track your luggage in real-time via the Arc app.\n\nThe Signature Glow: A proximity-based LED ring at the base illuminates when you approach, helping you find your bag on a crowded carousel.', '3400.00', 'https://unsplash.com/photos/a-group-of-suitcases-stacked-on-top-of-each-other-eOUtprtGgV8', '13');
INSERT INTO `ecommerce_db`.`products` (`category_id`, `name`, `description`, `price`, `image_url`, `stock`) VALUES ('2', 'Pulse  B1 Backpack', 'The Pulse B1 is designed for the transition from the airport terminal to the city streets. It offers a streamlined, \"limited feature\" design compared to the luggage, focusing on the essentials of daily commuting.\n\nAnti-Slash Tech: Military-grade carbon weave fabric that resists theft attempts.\n\nPower Passthrough: Integrated USB-C charging ports connected to an internal power bank sleeve.\n\nShield Pocket: Dedicated RFID-blocking compartment for passports, wallets, and digital keys.\n\nLumbar Glow: A slim LED strip at the base for visibility during night travel, doubling as a status indicator for the bag’s \"Armed\" mode.', '2600', 'https://lh3.googleusercontent.com/gg-dl/AOI_d_8GkUTSB2ACA9A136Lnq6qiIUCT9Ba_rRj2MvX1MzBQPUebcJyfuswDZExekhDWV5EE13R6uO6EV48YZj_HoSnImRoWiXdV4NWoK_mKVIQTTjyR9NyMNuFSzVveQS_qOB_-QhXOlFrDnnMExMDU34gHtHXpIUfn3XKlGcMKFVF3bBFg-g=s1024-rj', '14');
INSERT INTO `ecommerce_db`.`products` (`category_id`, `name`, `description`, `price`, `image_url`, `stock`) VALUES ('4', 'Aura T1 Flask Cup', 'The Aura T1 isn\'t just a container; it’s a smart health device. It ensures your beverages are at the exact temperature you desire while maintaining total purity.\n\nOLED Smart Lid: Displays the real-time internal temperature and hydration progress with a single touch.\n\nUV-C Purification: Built-in ultraviolet light in the lid neutralizes 99.9% of bacteria, making water safe anywhere in the world.\n\nTemperature Aura: The base ring pulses Red for hot, Green for ideal, and Cyan for cold.\n\nFind My Flask: Bluetooth and GPS integration ensures you never leave your premium flask behind in a lounge or hotel room.', '750.00', 'https://lh3.googleusercontent.com/gg-dl/AOI_d_82xFBQzwjjZXy05b-F7LvdRGhBzxLvScDlQhaO0oIvO9NiR3S88oFk7-X0JAAHXmchJS0vj6nSBs2Wm5cZQtexztpzOABnW3eQ-Fvo2tqb0n1fRzb40KuleIjLB6U8Kx4arxqbjpS40YwNbHpUg4y-qBmTcCCVyHWihg-Zv2xfGiS29A=s1024-rj', '20');
INSERT INTO `ecommerce_db`.`products` (`category_id`, `name`, `description`, `price`, `image_url`, `stock`) VALUES ('3', 'Zenith  Headset', 'The Zenith is the ultimate travel companion for the ears. It is engineered to create a private sanctuary in the middle of a chaotic environment.\n\nWi-Fi 6E Connectivity: Supports standalone high-fidelity streaming and real-time gate/flight updates without needing a phone.\n\nSolar-Filament Headband: Trickle-charges the battery using ambient light from plane windows or terminal sun-decks.\n\nTransparency Glow: The exterior cyan rings pulse when \"Transparency Mode\" is active, signaling to others that you are open to conversation.\n\nBiometric Stress Monitor: Internal sensors track heart rate and suggest guided meditation or noise-cancellation adjustments based on your travel anxiety levels.', '1300.00', 'https://lh3.googleusercontent.com/gg-dl/AOI_d__Cwlo-oXOBF8fcsk_XzM-3snxHGC8SYdy13AiittRAdyZFWWEKHXIhw6bDi19XOozB7LL-IEL-kQdwBkZi2hac39mrBZtnaD6hO-TqGyBJSjFWveYd2WbWZnEDphCbMpmQF0fQcdAg5GAUoa4kaeX2YyIFXmj4wclWiWb6nuiaMQRK=s1024-rj', '10');


CREATE TABLE cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_price DECIMAL(15,2),
  currency_code VARCHAR(10),
  exchange_rate_used DECIMAL(15,6),
  status ENUM('pending','paid','failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (currency_code) REFERENCES currencies(currency_code)
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price_usd DECIMAL(10,2) NOT NULL,
  converted_price DECIMAL(15,2),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50),
    transaction_reference VARCHAR(255),
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
