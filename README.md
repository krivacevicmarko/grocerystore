# Grocery Store API

A RESTful API for managing employees and managers across a hierarchical organizational structure of grocery store locations in Serbia.

## Tech Stack

- **Node.js** with **TypeScript**
- **Express.js** - REST API framework
- **MongoDB** with **Mongoose** -database
- **JWT** - authentication
- **bcrypt** - password hashing
- **Jest** - unit testing
- **Docker** - conterization

## Project structure

```
src/
  config/       # Database connection
  controllers/  # Request handlers
  dto/          # Data Transfer Objects with validation
  middleware/   # Authentication and authorization middleware
  models/       # Mongoose models (user, Node)
  routes/       # API route definitions
  seed/         # Database seed script
  services/     # Business logic
  tests/        # Unit tests
  utils/        # Helper functions, JWT utils, AppError
```

## Prerequisites

- Node.js v20+
- MongoDB (local) or Docker

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/krivacevicmarko/grocerystore.git
cd grocerystore
```

### 2. Install dependecies

```bash
npm install
```

### 3. Set up environemnt variables

**macOS:**
```bash
cp .env.example .env
```

**Windows:**
```bash
copy .env.example .env
```

Edit `.env` with your values:
```
MONGO_URI=mongodb://localhost:27017/grocerystore
JWT_SECRET=your_secret_key
PORT=3000
```

### 4. Start MongoDB

Make sure MongoDB is running locally on port `27017`.

**macOS (Homebrew):**
```bash
brew services start mongodb-community
```

**Windows:**
```bash
net start MongoDB
```

> If you don't have MongoDB installed locally, you can use Docker instead - see the [Running with Docker](#running-with-docker) section.

### 5. Run the application

```bash
npm run dev
```

The database will be seeded automatically on first run.

Server runs on `http://localhost:3000`

## Running with Docker

### 1. Clone the repository and set up environment variables

```bash
cp .env.example .env
```

Edit `.env`:
```
MONGO_URI=mongodb://mongo:27017/grocerystore
JWT_SECRET=your_secret_key
PORT=3000
```

### Start with Docker Compose

```bash
docker-compose up --build
```

The database will be seeded automatically on first run.

To stop:
```bash
docker-compose down
```

To stop and remove all data:
```bash
docker-compose down -v
```

## Running Tests

```bash
npm test
```

## API Endpoints

### Authentication

**POST /auth/login - Login and receive JWT token**

**Request body:**
```json
{
  "username": "admin_srbija",
  "password": "test0707test"
}
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "username": "admin_srbija",
    "role": "MANAGER"
  }
}
```

### Users

All user endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/users` | MANAGER | Create a new user |
| GET | `/users/:id` | MANAGER | Get user by ID |
| PUT | `/users/:id` | MANAGER | Update user |
| DELETE | `/users/:id` | MANAGER | Delete user |
| GET | `/users/nodes/employees` | MANAGER, EMPLOYEE | Get employees for current node |
| GET | `/users/nodes/employees/descendants` | MANAGER, EMPLOYEE | Get employees for current node and all descendants |
| GET | `/users/nodes/managers` | MANAGER | Get managers for current node |
| GET | `/users/nodes/managers/descendants` | MANAGER | Get managers for current node and all descendants |

**POST /users - Create a new user**

```json
{
  "username": "employee_example",
  "password": "test0707test",
  "role": "EMPLOYEE",
  "nodeId": "69dd521d9f3e777045dce963"
}
```

**PUT /users - Uppdate a user**

```json
{
  "username": "employee_example",
  "password": "new_password12345",
  "role": "EMPLOYEE",
  "nodeId": "69dd521d9f3e777045dce963"
}
```

> All fields are optional for PUT - send only the fields you want to update.

**GET /users/nodes/employees?nodeId=:id**

> `nodeId` query parameter is optional. If not provided,defaults to the authenticated user's node.


## Access Control

- **Managers** can view and manage users that belong to their node or any descendant nodes
- **Employees** can only view employees that belong to their node or descendant nodes
- All node queries default to the authenticated user's node, but accept an optional `?nodeId=` query parameter
