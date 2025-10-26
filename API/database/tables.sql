USE usof_db CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    picture VARCHAR(255) NOT NULL DEFAULT 'default.png',
    rating INT DEFAULT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_email_confirmed BOOLEAN DEFAULT FALSE
);
CREATE TABLE posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    post_status ENUM('active', 'inactive') DEFAULT 'active',
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    publish_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE
);
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL UNIQUE,
    category_description TEXT NOT NULL
);
CREATE TABLE post_categories (
    post_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (post_id, category_id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);
CREATE TABLE comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT NOT NULL,
    publish_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE
);
CREATE TABLE likes (
    like_id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT NOT NULL,
    publish_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    target_type ENUM('post', 'comment') NOT NULL,
    target_id INT NOT NULL,
    like_type ENUM('like', 'dislike'),
    FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE
);
CREATE TABLE favorites (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT NOT NULL,
    add_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);