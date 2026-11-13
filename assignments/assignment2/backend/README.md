# COMP3123 Assignment 1

## Student Information

Name: Juela Topi  
Student ID: 101087887  
Course: COMP3123

## Project Description

This project is a RESTful backend API built with Node.js, Express, and MongoDB. It provides user authentication and employee management. Users can create an account, log in, and manage only the employee records that belong to their account.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- Helmet
- express-rate-limit
- Winston
- Postman

## Project Structure

```text
assignment1/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── validators/
├── .env.example
├── .gitignore
├── index.js
├── package.json
└── package-lock.json
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/JuelaTopi/COMP3123.git
cd COMP3123/assignments/assignment1
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the `assignment1` directory.

Use `.env.example` as a reference.

Required variables:

```text
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Do not commit the real `.env` file to GitHub.

### 4. Start MongoDB

Make sure the MongoDB server used by the application is running and that `MONGODB_URI` contains the correct connection information.

### 5. Start the application

```bash
node index.js
```

The API runs locally on:

```text
http://localhost:3000
```

### 6. Test the API

The API can be tested using Postman. For protected employee endpoints, log in first and use the returned JWT as a Bearer token.

## API Endpoints

### User Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/user/signup` | Create a new user account |
| POST | `/api/v1/user/login` | Log in and receive a JWT |

### Employee Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/emp/employees` | Get employees belonging to the authenticated user |
| POST | `/api/v1/emp/employees` | Create an employee |
| GET | `/api/v1/emp/employees/{eid}` | Get an employee by ID |
| PUT | `/api/v1/emp/employees/{eid}` | Update an employee |
| DELETE | `/api/v1/emp/employees?eid={employee_id}` | Delete an employee |

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Check whether the API is running |

Expected response:

```json
{
  "status": "OK",
  "message": "API is running"
}
```

## Authentication

Users must first create an account using the signup endpoint.

After signup, the user can log in using the login endpoint. A successful login returns a JWT.

Protected employee endpoints require the JWT in the HTTP Authorization header:

```text
Authorization: Bearer <token>
```

Requests with a missing or invalid token are rejected.

## Authorization and Employee Ownership

Each employee record is associated with the user who created it.

The API checks the authenticated user's ID before allowing access to an employee record. A user cannot view, update, or delete an employee belonging to another user.

Unauthorized attempts to access another user's employee record return an appropriate authorization error.

## Security

### Password Hashing

User passwords are hashed before they are stored in MongoDB. Plain-text passwords are not stored in the database.

### JWT Authentication

JSON Web Tokens are used to authenticate users and protect employee endpoints.

### Helmet

Helmet is used to add security-related HTTP response headers.

### Rate Limiting

Rate limiting is applied to authentication routes to reduce repeated login and signup attempts. The current configuration allows a maximum of 5 authentication requests within a 15-minute window before returning a rate-limit response.

### Input Validation

Request data is validated before it is processed. Invalid or missing values return appropriate HTTP error responses.

### Environment Variables

Sensitive configuration values such as the MongoDB connection string and JWT secret are stored in environment variables and are not committed to GitHub.

## Logging

Winston is used for local application logging.

Local log files are stored in:

```text
logs/app.log
logs/error.log
```

Logs include information such as:

- Timestamp
- HTTP method
- Request path
- HTTP response status
- Request duration
- Application errors

Sensitive information such as passwords, JWT secrets, database passwords, and full authentication tokens is intentionally excluded from logs.

The `logs` directory is excluded from Git using `.gitignore`.

## Error Handling

The API returns appropriate HTTP status codes for successful requests and errors, including validation errors, authentication failures, authorization failures, missing resources, duplicate records, rate-limit errors, and server errors.

## Testing

The API was tested locally using Postman. Testing includes:

- User signup and login
- Invalid authentication attempts
- Missing and invalid JWTs
- Employee creation
- Employee retrieval
- Employee updates
- Employee deletion
- Input validation
- Employee ownership restrictions
- Rate limiting
- Health check
- Security headers

## GitHub Repository

Repository:

https://github.com/JuelaTopi/COMP3123