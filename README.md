# JWT Banking API

Express.js banking API with JWT authentication for secure endpoint protection.

## Overview

This project demonstrates how to implement secure authentication in an Express.js application using JSON Web Tokens (JWT). The API provides banking operations with protected endpoints that require valid JWT tokens for access.

## JWT Authentication

JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed.

### How it works:
1. User authenticates with username/password via `/login` endpoint
2. Server validates credentials and generates a signed JWT token
3. Client includes this token in the Authorization header for subsequent requests
4. Server verifies the token before allowing access to protected endpoints

## API Endpoints

### Authentication

#### POST /login
Authenticates user and returns a JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Protected Banking Endpoints

All endpoints below require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

#### GET /balance
Retrieve current account balance.

**Response:**
```json
{
  "balance": 1000
}
```

#### POST /deposit
Deposit money into account.

**Request Body:**
```json
{
  "amount": 500
}
```

**Response:**
```json
{
  "message": "Deposited successfully",
  "newBalance": 1500
}
```

#### POST /withdraw
Withdraw money from account.

**Request Body:**
```json
{
  "amount": 200
}
```

**Response:**
```json
{
  "message": "Withdrawn successfully",
  "newBalance": 1300
}
```

## JWT Middleware

The application uses middleware to verify JWT tokens on protected routes. The middleware:
- Extracts the token from the Authorization header
- Verifies the token signature using the secret key
- Decodes the token payload
- Attaches user information to the request object
- Allows the request to proceed to the route handler

## Error Handling

The API handles various error scenarios:

### Missing Token
**Status:** 401 Unauthorized
```json
{
  "error": "Access denied. No token provided."
}
```

### Invalid Token
**Status:** 403 Forbidden
```json
{
  "error": "Invalid token."
}
```

### Insufficient Balance
**Status:** 400 Bad Request
```json
{
  "error": "Insufficient balance."
}
```

### Invalid Credentials
**Status:** 401 Unauthorized
```json
{
  "error": "Invalid username or password."
}
```

## Installation

```bash
npm install
```

## Usage

1. Start the server:
```bash
node app.js
```

2. Login to obtain a token:
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

3. Use the token to access protected endpoints:
```bash
curl -X GET http://localhost:3000/balance \
  -H "Authorization: Bearer <your-token-here>"
```

## Security Notes

- JWT tokens are signed using a secret key (stored in environment variables in production)
- Tokens should be transmitted over HTTPS in production
- Tokens have an expiration time to limit the window of vulnerability
- Never expose your JWT secret key in client-side code or version control

## Technologies Used

- Express.js - Web framework
- jsonwebtoken - JWT implementation
- body-parser - Request body parsing middleware

## License

MIT
