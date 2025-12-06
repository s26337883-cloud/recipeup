CREATE DATABASE IF NOT EXISTS recipeshare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE recipeshare;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password CHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    ingredients TEXT NOT NULL,
    steps TEXT NOT NULL,
    image VARCHAR(255) NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recipes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT NOT NULL,
    user_id INT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comments_recipe FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (name, email, password) VALUES
('Demo Chef', 'chef@example.com', 'd3ad9315b7be5dd53b31a273b3b3aba5defe700808305aa16a3062b76658a791'); -- password: demo123

INSERT INTO recipes (title, ingredients, steps, image, user_id) VALUES
('Classic Pancakes', '2 cups flour\n2 eggs\n1.5 cups milk', 'Mix ingredients and cook on a skillet.', NULL, 1);

INSERT INTO comments (recipe_id, user_id, comment_text) VALUES
(1, 1, 'These pancakes are delicious!');
