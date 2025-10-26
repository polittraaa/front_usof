# USOF Backend — DOCUMENTATION.md

1. [Short Description](#short-description)
2. [Current Status and Progress per CBL Stages](#current-status-and-progress-per-cbl-stages)
   - Engage
   - Investigate
   - Act
3. [Project Architecture and Algorithm](#project-architecture-and-algorithm)
4. [Database Schema and Relationships](#database-schema-and-relationships)
5. [Installation and Running](#installation-and-running)
6. [Environment Variables](#environment-variables)
7. [API Endpoints](#api-endpoints-summary)
8. [Admin Panel (AdminJS)](#admin-panel-adminjs)

---

## Short Description

USOF is a RESTful API for a forum-like application with user management, posts, comments, categories, likes, and roles (admin / user). The project is built using Node.js + Express and uses MySQL (mysql2) as the database. The admin interface is implemented with AdminJS.

Key features:

- User registration, email verification, and password reset
- Authorization and session management
- CRUD operations for users, posts, categories, and comments
- Likes for posts and comments
- Lock/unlock posts and comments
- Avatar uploads
- Role-based access (admin, author, user)
- Add post to favorites
- Sort and filter posts

---

## Current Status and Progress per CBL Stages

### Engage

**Goal:** define requirements, target audience, and use cases.
**Done:**

- Scope defined: forum with roles and basic moderation.
- Requirements collected: registration/login, post creation, comments, likes, categories, admin panel , post sorting.
- Initial README and server skeleton (routes, controllers, middleware) created.

**Result:** prioritized feature list (auth → admin → posts → categories → comments → likes + favorites).

---

### Investigate

**Goal:** choose tools, design DB, API, and architecture.
**Done:**

- Tech stack chosen: Node.js, Express, MySQL (mysql2), Knex + migration, AdminJS for admin.
- Database schema designed (users, posts, categories, post_categories,
  comments, likes, favorites).
- Email verification and password reset flows designed (token links).
- Middlewares identified: emailCheck, requireLogin, upload, roleCheck, roleCheckComment, adminCheck.

**Result:** detailed DB schema and API endpoints; migrations and initial SQL scripts prepared.

---

### Act

**Goal:** implement features step by step, test, and document.
**Done:**

- Core routes and controllers implemented (handlers imported in `\routes\path.js` used in `index.js`).
- Middleware templates implemented and AdminJS integrated.
- Avatar upload implemented via multer and served from `\public\uploads`.
- Email skeleton (nodemailer) and password tokens implemented.

**Remaining:**

- Complete any missing controllers in `controllers/`
- End-to-end testing

---

## Project Architecture and Algorithm

### Folder Structure

```
root/
├─ controllers/           # business logic for each entity
│  ├─ auth/
│  ├─ user/
│  ├─ post/
│  ├─ comments/
│  ├─ favorites/
│  ├─ likes/
│  └─ categories/
|
├─ middleware/            # auth checks, role checks, uploads
├─ models/                # models for working with a database
├─ public/                # media storage
│  └─ uploads/            # avatars storage
├─ admin/                 # AdminJS configuration
├─ db.js                  # database connection (mysql2/knex)
├─ index.js               # entry point (start function)
└─ .env
```

### Request Flow Example (POST /api/posts)

1. Client sends `POST /api/posts` with session cookie.
2. `requireLogin` middleware checks the session.
3. `handlePost` controller validates input (title, body, categories).
4. Post is created in `posts` table; `post_categories` created if categories provided.
5. Returns the created post with HTTP 200.

### Authorization and Sessions

- Uses `express-session`. After login, `req.session.userId` is stored.
- `requireLogin` middleware checks session and user.

### Email Verification and Password Reset

- On registration, an email is sent confirmation token.
- Clicking the link calls `POST /api/auth/confirm/:token`.
- Password reset request sends email with `confirm_token`.

---

## Database Schema and Relationships

### Basic tables

#### 1. users

Stores user data.

- user_id
- login
- password_hash
- full_name
- email
- picture
- rating
- role
- created_at
- updated_at
- is_email_confirmed

| Field                | Type                                                            | Description                                |
| -------------------- | --------------------------------------------------------------- | ------------------------------------------ |
| `user_id`            | INT PK                                                          | Unique ID                                  |
| `login`              | VARCHAR(50)                                                     | Login (nickname)                           |
| `password_hash`      | VARCHAR(255)                                                    | Hashed password                            |
| `full_name`          | VARCHAR(100)                                                    | Full name                                  |
| `email`              | VARCHAR(100)                                                    | E-mail                                     |
| `profile_picture`    | VARCHAR(255)                                                    | Profile picture URL                        |
| `rating`             | INT DEFAULT 0                                                   | Likes - Dislikes (automatic recalculation) |
| `role`               | ENUM('user','admin') DEFAULT 'user'                             | Rights                                     |
| `created_at`         | TIMESTAMP DEFAULT CURRENT_TIMESTAMP                             | Profile creation date                      |
| `updated_at`         | TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Profile change date                        |
| `is_email_confirmed` | BOOLEAN DEFAULT FALSE                                           | Profile change date                        |

---

#### 2. posts

Information about all posts.

- post_id
- author_id
- title
- publish_date
- post_status
- content
- image_url

| Field           | Type                                       | Description                         |
| --------------- | ------------------------------------------ | ----------------------------------- |
| `post_id`       | INT PK                                     | Unique ID                           |
| `author_id`     | INT FK → users.id                          | Who has created                     |
| `title`         | VARCHAR(150)                               | Publication title                   |
| `publish_date ` | TIMESTAMP DEFAULT CURRENT_TIMESTAMP        | Publication date                    |
| `post_status`   | ENUM('active','inactive') DEFAULT 'active' | Visibility                          |
| `content`       | TEXT                                       | Description of the problem/solution |
| `image_url`     | VARCHAR(255)                               | Upload image                        |

---

#### 3. categories

Information about post categories.

- category_id
- title
- category_description

| Field                  | Type        | Description          |
| ---------------------- | ----------- | -------------------- |
| `category_id`          | INT PK      | Unique ID            |
| `title`                | VARCHAR(50) | Category title       |
| `category_description` | TEXT        | Category description |

---

#### 4. comments

Stores all comments to the post.

- comment_id
- to_post_id
- author_id
- content
- publish_date
- target_state
- parent_id

| Field          | Type                                       | Description                 |
| -------------- | ------------------------------------------ | --------------------------- |
| `comment_id`   | INT PK                                     | Unique ID                   |
| `to_post_id`   | INT FK → posts.id                          | What post does it belong to |
| `author_id`    | INT FK → users.id                          | Who wrote                   |
| `content`      | TEXT                                       | Comment text                |
| `publish_date` | TIMESTAMP DEFAULT CURRENT_TIMESTAMP        | Comment creation date       |
| `target_state` | ENUM('active','inactive') DEFAULT 'active' | Comment status              |
| `parent_id`    | INT FK → comments.id, NULL                 | For nested comments         |

---

#### 5. likes

Associates likes of post or comment.

- like_id
- author_id
- target_id
- like_type
- publish_date
- target_type

| Field          | Type                                      | Description          |
| -------------- | ----------------------------------------- | -------------------- |
| `like_id`      | INT PK                                    | Unique ID            |
| `author_id`    | INT FK → users.id                         | Who liked            |
| `target_id`    | INT FK → posts.id or INT FK → comments.id | Like to the id       |
| `target_type`  | ENUM('post','comment')                    | Like to post/comment |
| `like_type`    | ENUM('like','dislike')                    | Like or dislike      |
| `publish_date` | TIMESTAMP DEFAULT CURRENT_TIMESTAMP       | Like date            |

### Additional tables

#### 1. post_categories

Relationship between posts and categories.

- post_id
- category_id
- **PRIMARY KEY (post_id, category_id)**

| Field         | Type                            | Description    |
| ------------- | ------------------------------- | -------------- |
| `post_id`     | INT FK → posts.post_id          | Post ID        |
| `category_id` | INT FK → categories.category_id | Category liked |

#### 2. favorites

Stores posts added to "favorite" category

- post_id
- owner_id
- add_date
- **PRIMARY KEY (post_id, owner_id)**

| Field      | Type                                | Description                       |
| ---------- | ----------------------------------- | --------------------------------- |
| `owner_id` | INT FK → users.user_id              | ID of the user who added the post |
| `post_id`  | INT FK → posts.post_id              | Post ID                           |
| `add_date` | TIMESTAMP DEFAULT CURRENT_TIMESTAMP | Addition time                     |

### Connections

- users 1 — M posts
- users 1 — M comments
- users 1 — M likes
- posts 1 — M comments
- posts M — M categories (with post_categories)
- posts 1 — M likes
- comments 1 — M likes
- favorites M — M posts (with favorites)

_1 — M (one-to-many) → one record in one table can be related to several records in another_

_M — M (many-to-many) → multiple records in one table can be related to multiple records in another_

---

## Installation and Running

1. Clone the repository

```bash
git clone <repo>
cd <repo>
```

2. Install dependencies

```bash
npm install
```

3. Create `.env` (see below) and set up database
4. Run the server

```bash
npm start
# or
node index.js
```

5. Admin panel available at `http://localhost:3001/admin` (if PORT=3001)

---

## Environment Variables

````.env
  # SERVER_PORT=yourtPort

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

---

## API Endpoints (summary)

### Authentication
- `POST /api/auth/register` — register
- `POST /api/auth/login` — login (email must be confirmed)
- `POST /api/auth/logout` — logout
- `POST /api/auth/password-reset` — request password reset
- `POST /api/auth/password-reset/:confirm_token` — confirm new password
- `POST /api/auth/register/confirm/:token` — verify email

### Users
- `GET /api/users` — all users
- `GET /api/users/:id` — get user by ID
- `POST /api/users` — create user (admin only)
- `PATCH /api/users/:id` — update (admin or self)
- `PATCH /api/users/avatar` — upload avatar (multipart/form-data)
- `DELETE /api/users/:id` — delete (admin or self)

### Posts
- `GET /api/posts` — list posts (pagination)
  - query params: `page`, `limit`, `sort`, `order`, filters (category, author, search)
- `GET /api/posts/:id` — get post
- `POST /api/posts` — create post (auth)
- `PATCH /api/posts/:id` — update data or state (author/admin)
- `DELETE /api/posts/:id` — delete (author/admin)
- `POST /api/posts/:id/like` — like post
- `DELETE /api/posts/:id/like` — remove own like

### Categories
- `GET /api/categories` — all categories
- `GET /api/categories/:id` — get category
- `GET /api/categories/:id/posts` — get posts of category
- `POST /api/categories` — create category
- `PATCH /api/categories/:id` — update category
- `DELETE /api/categories/:id` — delete category

### Comments
- `GET /api/posts/:id/comments`— get comments under a post
- `GET /api/comments/:id`— get comment
- `POST /api/posts/:id/comments` — create comment
- `PATCH /api/comments/:id` — update comment
- `DELETE /api/comments/:id` — delete comment
- `POST /api/comments/:id/like` — like comment
- `DELETE /api/comments/:id/like` — remove like


---

## Admin Panel (AdminJS)
- AdminJS connected to tables: users, posts, categories, comments, likes and favorites
- `admin/userResource.js` allows customizing actions/fields and visibility.
- For development, run `admin.watch()` (enabled in server.js) to reload AdminJS on changes.

---

## Conclusion
This document serves as a full documentation base for USOF, describing CBL progress, architecture, and key algorithms.

---
*Author: Polina Tovstonoh*

````
