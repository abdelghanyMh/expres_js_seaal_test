# expres_js_seaal_test

This project is a boilerplate for building web applications using Node.js, Express.js, MySQL, Pug.js, and TailwindCSS. It provides a basic setup with user authentication, CRUD operations, and a clean folder structure to help you get started quickly.

## Setup

### Prerequisites

- Node.js
- Docker
- MySQL

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/abdelghanyMh/expres_js_seaal_test.git
   cd expres_js_seaal_test
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables:
   Create a .env file in the root directory and add your environment variables.

   - open terminal right **node** then press ENTRE
   - then generate secure session token
     ```js
     require('crypto').randomBytes(64).tostring('hex');
     ```
   - make sure that `SESSION_SECRET` equals to the generated token

4. Build and start the Docker containers:
   ```bash
   docker compose up --build
   ```
5. Initialize the database:
   ```bash
   npm run db:init
   ```

### Running the Application

Start the development server:

```bash
    npm run listen
```

> The application will be available at http://localhost:3000.

> phpmyadmin will be available at http://localhost:8001/

> **username:** root | **Password**: toor

## Features

- **Node.js** and **Express.js** for server-side logic.
- **MySQL** for database management.
- **Pug.js** for templating.
- **TailwindCSS** for styling.
- Authentication and authorization for admin and manager roles.
- Cron job to reset occurrences for managers daily.
- Docker setup for easy containerization and deployment.

## Models

### Admin

- `name`: String
- `email`: String
- `password`: String

### Manager

- `name`: String
- `email`: String
- `password`: String
- `occurrence`: Integer (default value: 1)

## Routes

### Manager Routes

- **GET /manager/login**: View Manager login form .
- **POST /admin/login**: Manager login.
- **POST /managers/send**:
  - Checks if the current time is before 10:00 AM.
  - If yes, checks if the manager's occurrence is 1.
    - If occurrence is 1, updates occurrence to 0 and returns success message.
    - If occurrence is 0, returns "Sorry, you have to wait until 10:00 a.m. tomorrow" message.
  - If the current time is after 10:00 AM, resets all managers' occurrences to 1.

### Admin Routes

- **POST /admin/login**: Admin login.
- **POST /admin/login**: Admin login.
- **GET /admin/managers**: View list of managers and their occurrences.
- **PUT /admins/reset/:managerId**: Reset a manager's occurrence to 1.


> **GET /logout**: current  logout.

## Cron Job

- A cron job is set up to reset all managers' occurrences to 1 at 10:00 AM every day using `node-cron`.

## Views

### Manager dashboard View

- Displays a "Send" button and success/failure messages.

### Admin View

- Displays a table with managers and their occurrences.
- Provides a button to reset occurrence for each manager.

### Index View
- allows Managers to access there login views

### login views
- allows users to authenticate

### Error
- used to display server errors


### Scripts

```bash
npm run dev: Start the development server and build CSS.
npm run start: Start the server.
npm run build:css: Build CSS using PostCSS.
npm run dockup: Start Docker containers.
npm run docker:build: Build and start Docker containers.
npm run db:create: Create the database.
npm run db:drop: Drop the database.
npm run db:migrate: Run database migrations.
npm run db:seed: Seed the database.
npm run db:init: Create the database, run migrations, and seed data.
npm run listen: Start the server with nodemon.
npm run init: Build Docker containers and initialize the database.
```

## Project Structure

```bash
    ├── app.js
    ├── assets
    │   ├── images
    │   │   └── LOGO-POUR-WEB-01.png
    │   ├── scripts.js
    │   └── styles.css
    ├── bin
    │   └── www
    ├── config
    │   ├── config.json
    │   └── database.js
    ├── docker-compose.yml
    ├── Dockerfile
    ├── .env
    ├── .eslintrc.js
    ├── .gitignore
    ├── middelware
    │   └── middlewares.js
    ├── migrations
    │   ├── 20240514172750-create-mangers.js
    │   └── 20240514173557-create-admin.js
    ├── models
    │   ├── Admin.js
    │   ├── index.js
    │   └── Manager.js
    ├── package.json
    ├── package-lock.json
    ├── postcss.config.js
    ├── .prettierrc.js
    ├── README.md
    ├── routes
    │   ├── admin.routes.js
    │   ├── auth.routes.js
    │   └── manager.routes.js
    ├── seeders
    │   ├── 20240514174823-demo-admin.js
    │   ├── 20240514175407-demo-manager.js
    │   └── routes
    ├── src
    │   └── css
    │       └── app.css
    ├── tailwind.config.js
    ├── utils
    │   ├── auth.js
    │   └── cronJob.js
    └── views
        ├── admin
        │   ├── login.pug
        │   └── managers.pug
        ├── error.pug
        ├── index.pug
        └── manager
            ├── dashboard.pug
            └── login.pug
```
