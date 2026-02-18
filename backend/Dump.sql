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
('KES', 'Kenyan Shilling', 'KSh');

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
('Kenya', 'KE', 'KES');

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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (country_id) REFERENCES countries(id),
  FOREIGN KEY (currency_code) REFERENCES currencies(currency_code)
);

INSERT INTO users (full_name, email, password) VALUES
('Liam Johnson','liam.johnson@gmail.com','hashedpassword'),
('Olivia Smith','olivia.smith@email.com','hashedpassword'),
('Noah Williams','noah.williams@email.com','hashedpassword'),
('Emma Brown','emma.brown@email.com','hashedpassword'),
('Ava Jones','ava.jones@email.com','hashedpassword'),
('Sophia Garcia','sophia.garcia@email.com','hashedpassword'),
('Isabella Martinez','isabella.martinez@email.com','hashedpassword'),
('Mason Rodriguez','mason.rodriguez@email.com','hashedpassword'),
('Lucas Hernandez','lucas.hernandez@email.com','hashedpassword'),
('Mia Lopez','mia.lopez@email.com','hashedpassword'),
('Ethan Gonzalez','ethan.gonzalez@email.com','hashedpassword'),
('Amelia Wilson','amelia.wilson@email.com','hashedpassword'),
('Harper Anderson','harper.anderson@email.com','hashedpassword'),
('Elijah Thomas','elijah.thomas@email.com','hashedpassword'),
('Charlotte Taylor','charlotte.taylor@email.com','hashedpassword'),
('James Moore','james.moore@email.com','hashedpassword'),
('Benjamin Jackson','ben.jackson@email.com','hashedpassword'),
('Evelyn Martin','evelyn.martin@email.com','hashedpassword'),
('Alexander Lee','alex.lee@email.com','hashedpassword'),
('Abigail Perez','abigail.perez@email.com','hashedpassword'),
('Michael Thompson','michael.thompson@email.com','hashedpassword'),
('Daniel White','daniel.white@email.com','hashedpassword'),
('Matthew Harris','matthew.harris@email.com','hashedpassword'),
('Samuel Clark','samuel.clark@email.com','hashedpassword'),
('David Lewis','david.lewis@email.com','hashedpassword'),
('Joseph Robinson','joseph.robinson@email.com','hashedpassword'),
('Henry Walker','henry.walker@email.com','hashedpassword'),
('Sebastian Young','sebastian.young@email.com','hashedpassword'),
('Jack Allen','jack.allen@email.com','hashedpassword'),
('Owen King','owen.king@email.com','hashedpassword'),
('Gabriel Wright','gabriel.wright@email.com','hashedpassword'),
('Julian Scott','julian.scott@email.com','hashedpassword'),
('Levi Green','levi.green@email.com','hashedpassword'),
('Dylan Adams','dylan.adams@email.com','hashedpassword'),
('Nathan Baker','nathan.baker@email.com','hashedpassword'),
('Aaron Nelson','aaron.nelson@email.com','hashedpassword'),
('Isaac Carter','isaac.carter@email.com','hashedpassword'),
('Anthony Mitchell','anthony.mitchell@email.com','hashedpassword'),
('Hudson Perez','hudson.perez@email.com','hashedpassword'),
('Christopher Roberts','christopher.roberts@email.com','hashedpassword'),
('Zoey Turner','zoey.turner@email.com','hashedpassword'),
('Lily Phillips','lily.phillips@email.com','hashedpassword'),
('Hannah Campbell','hannah.campbell@email.com','hashedpassword'),
('Scarlett Parker','scarlett.parker@email.com','hashedpassword'),
('Victoria Evans','victoria.evans@email.com','hashedpassword'),
('Madison Edwards','madison.edwards@email.com','hashedpassword'),
('Grace Collins','grace.collins@email.com','hashedpassword'),
('Chloe Stewart','chloe.stewart@email.com','hashedpassword'),
('Penelope Sanchez','penelope.sanchez@email.com','hashedpassword'),
('Riley Morris','riley.morris@email.com','hashedpassword'),
('Layla Rogers','layla.rogers@email.com','hashedpassword'),
('Nora Reed','nora.reed@email.com','hashedpassword'),
('Hazel Cook','hazel.cook@email.com','hashedpassword'),
('Violet Morgan','violet.morgan@email.com','hashedpassword'),
('Aurora Bell','aurora.bell@email.com','hashedpassword'),
('Savannah Murphy','savannah.murphy@email.com','hashedpassword'),
('Audrey Bailey','audrey.bailey@email.com','hashedpassword'),
('Brooklyn Rivera','brooklyn.rivera@email.com','hashedpassword'),
('Bella Cooper','bella.cooper@email.com','hashedpassword'),
('Claire Richardson','claire.richardson@email.com','hashedpassword'),
('Skylar Cox','skylar.cox@email.com','hashedpassword'),
('Lucy Howard','lucy.howard@email.com','hashedpassword'),
('Paisley Ward','paisley.ward@email.com','hashedpassword'),
('Everly Torres','everly.torres@email.com','hashedpassword'),
('Anna Peterson','anna.peterson@email.com','hashedpassword'),
('Caroline Gray','caroline.gray@email.com','hashedpassword'),
('Genesis Ramirez','genesis.ramirez@email.com','hashedpassword'),
('Kennedy James','kennedy.james@email.com','hashedpassword'),
('Samantha Watson','samantha.watson@email.com','hashedpassword'),
('Allison Brooks','allison.brooks@email.com','hashedpassword'),
('Connor Kelly','connor.kelly@email.com','hashedpassword'),
('Caleb Sanders','caleb.sanders@email.com','hashedpassword'),
('Thomas Price','thomas.price@email.com','hashedpassword'),
('Wyatt Bennett','wyatt.bennett@email.com','hashedpassword'),
('Jayden Wood','jayden.wood@email.com','hashedpassword'),
('Ryan Barnes','ryan.barnes@email.com','hashedpassword'),
('Asher Ross','asher.ross@email.com','hashedpassword'),
('Brayden Henderson','brayden.henderson@email.com','hashedpassword'),
('Luke Coleman','luke.coleman@email.com','hashedpassword'),
('Isaiah Jenkins','isaiah.jenkins@email.com','hashedpassword'),
('Andrew Perry','andrew.perry@email.com','hashedpassword'),
('Joshua Powell','joshua.powell@email.com','hashedpassword'),
('Nathaniel Long','nathaniel.long@email.com','hashedpassword'),
('Christian Patterson','christian.patterson@email.com','hashedpassword'),
('Jonathan Hughes','jonathan.hughes@email.com','hashedpassword'),
('Eli Flores','eli.flores@email.com','hashedpassword'),
('Hunter Washington','hunter.washington@email.com','hashedpassword'),
('Cameron Butler','cameron.butler@email.com','hashedpassword'),
('Adrian Simmons','adrian.simmons@email.com','hashedpassword'),
('Jordan Foster','jordan.foster@email.com','hashedpassword');

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO categories (name) VALUES
('Electronics'),
('Accessories'),
('Fashion'),
('Home');

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price_usd DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(255),
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);


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
