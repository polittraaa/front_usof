# back_usof

![alt text](USOF_backend.png)

# USOF Project – Forum API with Admin Panel

## Project Description

This project is a **RESTful API** built with **Node.js, Express, and MySQL**.  
It is implementation of a forum-like system with authentication, user management, posts, categories, comments, likes, and an **AdminJS** dashboard for administrators.

This API functionality:

- User registration, login, logout, password reset, and email verification
- CRUD operations for users, posts, categories, comments, and likes
- Likes/dislikes for posts and comments
- Locking/unlocking posts and comments
- Role-based access control (admin, author, authenticated user)
- Avatars upload

---

## Usage example

![alt text](<assets/images/Screenshot 2025-09-29 234017.png>)
![alt text](<assets/images/Screenshot 2025-09-29 234033.png>)
![alt text](<assets/images/Screenshot 2025-09-29 234111.png>)

## Requirements and Dependencies

### Requirements

- [Node.js](https://nodejs.org/) (>= 18.x)
- [MySQL](https://www.mysql.com/) (>= 8.0)

### Dependencies

The main npm packages used in the project:

- **express** – Web framework
- **mysql2** – Database driver
- **knex** – Query builder (if used in your db.js)
- **bcrypt** – Password hashing
- **express-session** – Session handling
- **jsonwebtoken** – JWT authentication and authorization
- **crypto** – Token generation
- **nodemailer** – Sending emails
- **multer** – File uploads (avatars)
- **dotenv** – Environment configuration
- **adminjs**, **@adminjs/express**, **@adminjs/sql** – Admin panel

## <sub>Full list in `package.json`.<sub>

## How to Run the Project

1.  **Clone the repository**

    ```bash
    git clone [https://github.com/polittraaa/back_usof](https://github.com/polittraaa/back_usof)
    ```

    ```bash
    cd back_usof
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Configure environment variables**  
    Create a .env file in the root folder with your database and session credentials:
    ```.env # SERVER_PORT=yourtPort

        # Secret for user sessions (use any long random string)
        TOKEN_SECRET=yourSecretKeyHere
        COOKIE_SECRET=yourCookieKey

        # Database configuration
        DATABASE_HOST=127.0.0.1
        DATABASE_PORT=3306
        DATABASE_USER=yourDbUser
        DATABASE_PASSWORD=yourDbPassword
        DATABASE_NAME=usof_db

        # Email configuration
        MAIL=yourEmail@example.com
        MAIL_PASS=yourAppPasswordOrToken
        ```

4.  **Run the server**

    ```bash
    npm start
    ```

    The server will run on:

    ```bash
    http://localhost:3001
    ```

5.  **Access AdminJS panel**  
    Navigate to:
    `bash
    http://localhost:3001/admin
    `

---

## Documentation

For extended documentation, see [DOCUMENTATION.md]().

It contains:

- Challenge Based Learning (CBL) stage reflections: Engage, Investigate, Act
- Algorithm description of the whole program
- Database schema and relations

---

## License

This project is licensed under the MIT License
