# FireGuard3 Backend

A smart fire detection and alert monitoring system backend built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Fire Alert Monitoring**: CRUD operations for fire alerts with status tracking
- **Real-time Updates**: Socket.io integration for live alert notifications
- **Pagination**: Efficient data retrieval with pagination support
- **Role-based Access**: Admin and User roles with different permissions
- **Clean Architecture**: Scalable folder structure with separation of concerns

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Real-time**: Socket.io
- **CORS**: cors middleware

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma        # Database schema
├── src/
│   ├── config/
│   │   ├── database.ts      # Prisma client setup
│   │   ├── index.ts         # App configuration
│   │   └── socket.ts        # Socket.io setup
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── alertController.ts
│   │   └── index.ts
│   ├── middleware/
│   │   ├── auth.ts          # JWT authentication
│   │   ├── errorHandler.ts  # Error handling
│   │   ├── asyncHandler.ts  # Async wrapper
│   │   └── index.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── alertRoutes.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── alertService.ts
│   │   └── index.ts
│   └── server.ts            # Entry point
├── .env                     # Environment variables
├── .env.example             # Example env file
├── package.json
└── tsconfig.json
```

## Installation

### Prerequisites

- Node.js (v18+)
- PostgreSQL database
- npm or yarn

### Steps

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Update the values:
   ```env
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/fireguard3?schema=public"
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. **Create PostgreSQL database**:
   ```sql
   CREATE DATABASE fireguard3;
   ```

5. **Run Prisma migrations**:
   ```bash
   npm run prisma:migrate
   ```
   
   Or for development:
   ```bash
   npm run db:push
   ```

6. **Generate Prisma client**:
   ```bash
   npm run prisma:generate
   ```

7. **Start the server**:
   ```bash
   # Development mode with hot reload
   npm run dev
   
   # Production mode
   npm run build
   npm start
   ```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get current user | Yes |

### Alerts

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/alerts` | Get all alerts (paginated) | Yes | User |
| GET | `/api/alerts/stats` | Get alert statistics | Yes | User |
| GET | `/api/alerts/recent` | Get recent alerts | Yes | User |
| GET | `/api/alerts/:id` | Get alert by ID | Yes | User |
| POST | `/api/alerts` | Create new alert | Yes | User |
| PUT | `/api/alerts/:id` | Update alert | Yes | User |
| DELETE | `/api/alerts/:id` | Delete alert | Yes | Admin |

### Query Parameters

**GET /api/alerts**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `status`: Filter by status (SAFE, WARNING, ALERT)
- `deviceId`: Filter by device ID

**GET /api/alerts/recent**:
- `hours`: Hours to look back (default: 24)

## Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

# Response
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": "...", "email": "...", "name": "...", "role": "USER" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Create Alert
```bash
POST /api/alerts
Authorization: Bearer <token>
Content-Type: application/json

{
  "deviceId": "device-001",
  "temperature": 85.5,
  "smokeLevel": 12.3,
  "status": "WARNING",
  "location": "Building A, Floor 3",
  "notes": "Elevated temperature detected"
}
```

### Get Alerts with Pagination
```bash
GET /api/alerts?page=1&limit=10&status=WARNING
Authorization: Bearer <token>

# Response
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Real-time Events (Socket.io)

Connect to the server using Socket.io client:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

// Listen for new alerts
socket.on('alert:new', (data) => {
  console.log('New alert:', data);
});

// Listen for critical alerts
socket.on('alert:critical', (data) => {
  console.log('CRITICAL:', data);
});
```

### Socket Events

| Event | Description |
|-------|-------------|
| `connected` | Confirmation of connection |
| `alert:new` | New alert created |
| `alert:critical` | Critical fire alert |
| `alert:update` | Alert updated |
| `alert:delete` | Alert deleted |

## Alert Status Values

- `SAFE`: Normal conditions
- `WARNING`: Elevated risk detected
- `ALERT`: Fire detected - immediate action required

## User Roles

- `USER`: Standard user (create, read, update alerts)
- `ADMIN`: Administrator (full access including delete)

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio GUI |
| `npm run db:push` | Push schema to database (dev) |

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | Token expiration | 7d |
| `CORS_ORIGIN` | Allowed CORS origins | localhost:5173 |

## License

MIT
