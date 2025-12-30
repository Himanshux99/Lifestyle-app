### Create Expense 
    url - /api/expenses/
# Expense Tracker API

Node.js/Express + MongoDB API for tracking personal expenses. Supports simple username/password auth with JWT, offline-friendly expense IDs (client-generated), filtering, and category stats.

## Features
- Auth: register, login, change password (JWT-based)
- Expenses: create, list/filter, get by id, update, soft delete
- Stats: totals grouped by category with overall total
- CORS configurable, JSON request bodies, consistent API response shape

## Tech Stack
- Node.js, Express
- MongoDB, Mongoose
- JWT (`jsonwebtoken`), password hashing (`bcrypt`)
- CORS (`cors`), environment config (`dotenv`)

## Project Structure
```
package.json
public/
src/
    app.js
    index.js
    controllers/
        auth.controllers.js
        expense.controllers.js
    db/
        index.js
    middleware/
        auth.middleware.js
    models/
        expense.models.js
        user.models.js
    routes/
        auth.routes.js
        expense.routes.js
    utils/
        api-error.js
        api-response.js
        async-handler.js
```

## Prerequisites
- Node.js 18+ (recommended)
- MongoDB Atlas cluster or a local MongoDB instance

## Environment Variables
Create a `.env` file in the project root:
```
# Server
PORT=3000

# Database
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority

# Auth (JWT)
ACCESS_TOKEN_SECRET=replace-with-a-long-random-string
ACCESS_TOKEN_EXPIRY=7d

# CORS (comma-separated list of allowed origins)
CROS_ORIGIN=http://localhost:5173
```

Notes:
- The variable name used by the app is `CROS_ORIGIN` (not a typo here; it matches the code). Provide one or multiple origins (comma-separated).
- The API accepts JWT via `Authorization: Bearer <token>`. A cookie may also be set on login, but cookie parsing is not enabled by default.

## Installation
```bash
npm install
```

## Running
Development (with nodemon):
```bash
npm run dev
```

Production:
```bash
npm start
```

The server starts on `http://localhost:${PORT}` (default `3000`).

## API Overview

Base URL: `http://localhost:3000`

### Auth
- POST `/api/auth/register` — Register a user
    - Body: `{ "username": string, "password": string }`
    - 201 → `{ statusCode, data: { user }, message }`

- POST `/api/auth/login` — Login and receive JWT
    - Body: `{ "username": string, "password": string }`
    - 200 → `{ statusCode, data: { user, accessToken }, message }`

- POST `/api/auth/change-password` — Change password (JWT required)
    - Headers: `Authorization: Bearer <token>`
    - Body: `{ "oldPassword": string, "newPassword": string }`
    - 200 → `{ statusCode, data: {}, message }`

### Expenses (JWT required for all routes)
- POST `/api/expenses` — Create expense
    - Body: `{ id: string, title: string, category: string, amount: number, date: ISOString }`
    - Note: `id` is client-generated to support offline sync.

- GET `/api/expenses` — List expenses (filters optional)
    - Query: `category?: string`, `startDate?: ISOString`, `endDate?: ISOString`

- GET `/api/expenses/stats` — Category-wise stats
    - Query: `startDate?: ISOString`, `endDate?: ISOString`
    - 200 → `{ stats: Array<{ _id: category, totalAmount, count, avgAmount }>, totalExpenses }`

- GET `/api/expenses/:expenseId` — Get one expense (by client `id`)
- PATCH `/api/expenses/:expenseId` — Update fields `{ title?, category?, amount?, date? }`
- DELETE `/api/expenses/:expenseId` — Soft delete (sets `deleted=true`)

## Auth & Headers
Send JWT via `Authorization: Bearer <token>` header for all protected routes (`/api/expenses/*` and `/api/auth/change-password`).

## Response Shape
Successful responses use:
```json
{
    "statusCode": 200,
    "data": { "..." },
    "message": "success",
    "success": true
}
```

Errors use:
```json
{
    "statusCode": 400,
    "data": null,
    "errors": ["..."],
    "message": "Something went wrong"
}
```

## Quick Examples

Register:
```bash
curl -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"username":"alice","password":"Passw0rd!"}'
```

Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"alice","password":"Passw0rd!"}'
```

Create Expense (replace TOKEN):
```bash
curl -X POST http://localhost:3000/api/expenses \
    -H "Authorization: Bearer TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "id":"exp-123",
        "title":"Groceries",
        "category":"Food",
        "amount":75.5,
        "date":"2025-12-01T10:00:00.000Z"
    }'
```

List Expenses (filtered):
```bash
curl -X GET "http://localhost:3000/api/expenses?category=Food&startDate=2025-12-01&endDate=2025-12-31" \
    -H "Authorization: Bearer TOKEN"
```

## Scripts
- `npm run dev`: Start with nodemon
- `npm start`: Start with Node

## License
ISC
