# USOF

This project is the **frontend part** of the **USOF (User Stack Overflow Forum)** application — a simplified web forum platform built with **React** and a custom **Node.js + Express + MySQL** backend.

Users can register, log in, create posts, comment, like/dislike content, manage profiles, and mark favorite posts.  
The frontend connects to the backend API and provides a clean, modern user interface for all features.

---

## Features

- **User Authentication** — register, login, logout with session cookies
- **Post Management** — create, edit, delete, and view posts
- **Comments System** — add and read comments under posts
- **Favorites** — save and view favorite posts
- **Categories** — filter and tag posts by category
- **Profile Management** — update personal info and avatar
- **Modern UI** — responsive design using React hooks and modular CSS

---

## Technologies Used

**Frontend:**

- React (Vite)
- JavaScript (ES6+)
- Fetch API
- Custom CSS styling
- Tachion

**Backend:**

- Node.js / Express
- MySQL
- JWT authentication
- RESTful API

---

## How to Run

### Clone the Repository

````bash
git clone ssh://git@git.green-lms.app:22022/challenge-371/ptovstonoh-6435.git
cd ptovstonoh-6435


# How to run
Copie the repository link ssh://git@git.green-lms.app:22022/challenge-371/ptovstonoh-6435.git

then start the backend part of the solution

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
        run the backend with

        npm start

more information on [back_usof\README.md]

to run front part
run npm i
npm run dev
````
