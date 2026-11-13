# TeamSpace — COMP3123 Assignment 2

Juela Topi — Student ID 101087887

A MERN employee-management application with authenticated, per-user employee directories.

## Technologies

- React with Vite, React Router and Bootstrap
- Axios for API requests
- TanStack Query for fetching, caching and mutations
- Node.js, Express, Mongoose and MongoDB
- JWT authentication and bcrypt password hashing
- Helmet, express-validator, express-rate-limit and Winston
- Multer and Sharp for profile pictures
- Docker Compose and Nginx

## Architecture

The browser runs the React frontend and sends HTTP requests to the Express backend through Axios. The backend verifies JWTs, validates input, checks employee ownership and accesses MongoDB through Mongoose.

MongoDB is accessed by the backend. The browser uses the REST API.

Docker Compose runs four services.

| Service | Purpose | Address |
|---|---|---|
| frontend | Nginx serves the production React build | http://localhost:5173 |
| backend | Express REST API | http://localhost:5000 |
| mongo | Application database | Internal Docker network |
| mongo-express | Database viewer | http://localhost:8082 |

The database name is `comp3123_assignment2`.

## Project structure

- `backend/` contains routes, controllers, models, middleware, validators, configuration and utilities.
- `frontend/` contains React pages, session management and the Axios client.
- `postman/` contains the exported API collection.
- `docker-compose.yml` defines the four services and persistent volumes.
- `.env.example` documents the root configuration.

## Installation and running

Install Docker Desktop, Node.js and Git.

Clone the submission repository.

```bash
git clone https://github.com/JuelaTopi/101087887_comp3123_assignment2_reactjs.git
cd 101087887_comp3123_assignment2_reactjs
```

Copy the configuration example.

```bash
cp .env.example .env
```

Edit `.env`. Replace the JWT secret and MongoDB viewer password placeholders with randomly generated values.

Keep the MongoDB URI pointed at the Compose service.

```text
mongodb://mongo:27017/comp3123_assignment2
```

Start the application.

```bash
docker compose up --build -d
docker compose ps
```

Open http://localhost:5173.

Check the API.

```bash
curl http://localhost:5000/health
```

Stop the services.

```bash
docker compose down
```

MongoDB data, profile pictures and logs persist in named Docker volumes.

## Configuration

| Variable | Location | Purpose |
|---|---|---|
| MONGODB_URI | Root `.env` | Backend connection to MongoDB |
| JWT_SECRET | Root `.env` | Secret used to sign and verify JWTs |
| CORS_ORIGIN | Root `.env` | Allowed frontend origin |
| MONGO_EXPRESS_USERNAME | Root `.env` | Database-viewer login |
| MONGO_EXPRESS_PASSWORD | Root `.env` | Database-viewer password |
| PORT | Backend container environment | API listening port, set to 5000 in Compose |
| VITE_API_URL | Frontend `.env` for development | API base URL |
| VITE_API_URL | Frontend Docker build argument | API base URL embedded in the production build |

The frontend uses `http://localhost:5000/api/v1`.

Frontend environment variables are visible to the browser and contain public configuration.

After changing a frontend build argument, rebuild the frontend image.

### Frontend development

Keep the backend and database running through Compose. Stop the frontend container to free port 5173.

```bash
docker compose stop frontend
cd frontend
npm ci
cp .env.example .env
npm run dev -- --port 5173 --strictPort
```

### Frontend checks

```bash
cd frontend
npm ci
npm run lint
npm run build
```

## API endpoints

Protected requests require `Authorization: Bearer <token>`.

| Method | Endpoint | Success |
|---|---|---|
| POST | `/api/v1/user/signup` | 201 |
| POST | `/api/v1/user/login` | 200 |
| GET | `/api/v1/emp/employees` | 200 |
| POST | `/api/v1/emp/employees` | 201 |
| GET | `/api/v1/emp/employees/search` | 200 |
| GET | `/api/v1/emp/employees/:eid` | 200 |
| PUT | `/api/v1/emp/employees/:eid` | 200 |
| DELETE | `/api/v1/emp/employees?eid=<id>` | 204 |
| GET | `/health` | 200 |

Login accepts either username and password or email and password.

Employee fields are `first_name`, `last_name`, `email`, `position`, `salary`, `date_of_joining` and `department`.

Use `YYYY-MM-DD` for the joining date and a positive salary.

Create and update requests accept JSON or multipart/form-data. For a picture, use multipart/form-data with a file field named `profile_picture`.

### Search

Example request.

```text
GET /api/v1/emp/employees/search?department=engineering&position=dev
```

Search accepts department, position or both. When both are supplied, both conditions must match.

Matching is case-insensitive and supports partial text. Search text is validated and regex characters are escaped.

Results include only the authenticated user's employees. No matches returns HTTP 200 with an empty `employees` array.

### Profile pictures

- Accepted upload types are JPEG, PNG and WebP.
- Maximum uploaded file size is 2 MiB.
- Sharp verifies image contents and limits input to 16 megapixels.
- Stored pictures are converted to PNG with a maximum width and height of 512 pixels.
- Filenames are generated UUIDs.
- MongoDB stores the picture path.
- `/uploads` serves stored images.
- Docker persists pictures in the `employee_uploads` volume.
- Replacing or deleting an employee's picture triggers file cleanup.
- Failed database writes trigger cleanup of newly saved pictures.

## Authentication and authorization

Passwords are hashed with bcrypt before storage.

Successful login returns a JWT with a one-hour expiry. React stores it in localStorage so the session survives refreshes. The shared Axios client attaches it to protected requests.

Protected React routes redirect unauthenticated users to `/login`. Authenticated users visiting login or signup are redirected to the directory.

The backend verifies the JWT and obtains the user from the database. Employee ownership comes from that authenticated user.

List and search queries filter by owner. Details, updates and deletion check ownership. Requests for another user's employee receive HTTP 403.

Logout clears local session state and the TanStack Query cache. Invalid or expired tokens on protected requests clear the session and redirect to login.

## Security and errors

- Helmet supplies security headers.
- CORS allows the configured frontend origin.
- Authentication endpoints are rate-limited.
- Backend validators check user-controlled data.
- Employee updates use an explicit field allowlist.
- Uploaded filenames are generated by the server.
- Image processing verifies the actual picture contents.
- Secrets are supplied through environment variables.
- Uploaded pictures, logs, `.env` files and dependencies are excluded from Git.

API failures return JSON messages. The frontend displays validation failures, invalid credentials, duplicate accounts, ownership errors, expired sessions, rate limits, network errors and upload failures.

Authentication rate-limit settings are defined in `backend/index.js`.

## Frontend routes

| Route | Screen |
|---|---|
| `/login` | Login |
| `/signup` | Signup |
| `/employees` | Directory and backend search |
| `/employees/add` | Add employee |
| `/employees/:id` | Employee details |
| `/employees/:id/edit` | Edit employee |
| Other URLs | Page not found |

The employee form is shared between create and update screens. It uses controlled inputs, file checks and picture previews.

The directory provides loading, empty and error states. Deletion requires confirmation.

TanStack Query manages employee requests and cache invalidation after mutations. Session changes clear cached employee data.

## Logging and health check

Winston collects local application logs.

In Docker, logs are stored in `/app/logs` and persisted in the `backend_logs` volume.

Request logs include the method, path, response status and duration. The request logger excludes request bodies and authorization headers.

View logs.

```bash
docker compose exec backend sh -c 'ls -lh logs && tail -n 10 logs/*.log'
```

`GET /health` returns HTTP 200 with the following response.

```json
{
  "status": "OK",
  "message": "API is running"
}
```

The backend Docker health check calls this endpoint. MongoDB has a separate ping health check.

## Postman testing

Import `postman/assignment2.postman_collection.json`.

Send a login request, copy the returned JWT, and set the collection variable `token` to that value before protected requests.

Use a fresh login token when changing test users. For picture requests, select a local test file in the `profile_picture` form-data field.

Test successful requests and failure cases, including ownership rejection, invalid credentials, validation errors, invalid sessions, rate limits and picture type/size restrictions.

## Sample test accounts

These are demonstration accounts created during testing.

| Username | Password |
|---|---|
| usera | DemoPass123! |
| userb | DemoPass123! |

Accounts are stored in the local MongoDB volume. A fresh database requires registration through Signup.

## Limitations and trade-offs

- localStorage tokens are accessible to JavaScript, so an XSS vulnerability could expose them.
- Logout clears the browser session. An already issued JWT remains valid on the server until expiry.
- Uploaded pictures are accessible to anyone who knows their generated URL.
- The Docker configuration targets local development and marking on localhost.
- Image cleanup failures are logged for investigation.

## AI assistance

Generative AI assisted with implementation guidance and debugging. The separate AI Usage Declaration required by D2L must accompany the submission.