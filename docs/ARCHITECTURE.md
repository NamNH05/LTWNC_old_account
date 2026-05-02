# Kiến trúc hệ thống

## Tổng quan

LTWNC Shop là ứng dụng web toàn stack với backend TypeScript/Express và frontend React/Vite.

## Kiến trúc chung

```
Client (Browser)
    |
    | HTTP/REST
    |
    v
Frontend (React + Vite)
    |
    | API Calls
    |
    v
Backend (Express.js)
    |
    | SQL Queries
    |
    v
Database (PostgreSQL)
```

## Backend Architecture

### Cấu trúc thư mục

```
backend/
├── src/
│   ├── app.ts           # Express app setup
│   ├── index.ts         # Server entry point
│   ├── config/          # Configuration
│   │   └── env.ts       # Environment variables
│   ├── middlewares/     # Express middlewares
│   ├── modules/         # Feature modules
│   │   ├── module.registry.ts
│   │   ├── address/
│   │   ├── admin/
│   │   ├── announcement/
│   │   └── ...
│   ├── repositories/    # Data access layer
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── seed.ts          # Seed data
│   └── migrations/      # Database migrations
└── docs/                # Documentation
```

### Layers

1. **Controllers**: Request/Response handling
2. **Services**: Business logic
3. **Repositories**: Database queries
4. **Models**: Data structures

### Module System

Hệ thống module cho phép bật/tắt tính năng:

```typescript
// Module definition
{
  name: "products",
  enabled: true,
  routes: [...],
  permissions: [...]
}
```

### Middleware Stack

1. CORS
2. Body Parser
3. Request Logger
4. Rate Limiter
5. Authentication
6. RBAC
7. Error Handler

### Database Schema

Sử dụng Prisma ORM:

```prisma
model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  password  String
  role      Role    @default(USER)
  ...
}
```

Chạy migration:

```bash
npx prisma migrate dev --name <name>
```

## Frontend Architecture

### Cấu trúc thư mục

```
frontend/
├── src/
│   ├── main.jsx         # Entry point
│   ├── App.jsx          # Root component
│   ├── components/      # Reusable components
│   │   ├── common/      # Shared components
│   │   ├── ui/          # UI components
│   │   └── ...
│   ├── pages/           # Page components
│   ├── routes/          # Route configuration
│   ├── services/        # API services
│   ├── context/         # React Context
│   ├── hooks/           # Custom hooks
│   ├── styles/          # Global styles
│   └── utils/           # Utilities
├── public/              # Static assets
├── dist/                # Build output
└── vite.config.js       # Vite configuration
```

### Component Hierarchy

```
App
├── Header
│   ├── Logo
│   ├── Navigation
│   └── User Menu
├── Router
│   ├── HomePage
│   ├── ProductPage
│   ├── CartPage
│   ├── CheckoutPage
│   └── AdminDashboard
└── Footer
```

### State Management

- React Context cho global state
- Local state cho component state
- localStorage cho persistent state

### API Integration

```javascript
// services/api.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Auto add token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Data Flow

### Fetch Data

```
Component
  |
  v
useEffect + API Call
  |
  v
Server Processing
  |
  v
Database Query
  |
  v
Response
  |
  v
State Update
  |
  v
Re-render
```

### Submit Data

```
Form Submit
  |
  v
Validation
  |
  v
API Call
  |
  v
Server Processing
  |
  v
Database Update
  |
  v
Response
  |
  v
Success/Error Message
```

## Security

- JWT Authentication
- RBAC (Role-Based Access Control)
- Rate Limiting
- CORS
- Password Hashing (bcrypt)
- Input Validation
- HTTPS in Production

## Payment Flow (VNPAY)

```
Customer
   |
   v
Checkout Page
   |
   v
VNPAY Gateway
   |
   v
Bank Payment
   |
   v
VNPAY IPN Callback
   |
   v
Update Order Status
   |
   v
Success Page
```

## Deployment

### Docker

```yaml
services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
  
  frontend:
    build: ./frontend
    ports:
      - "80:3000"
  
  database:
    image: postgres:15
    volumes:
      - pgdata:/var/lib/postgresql/data
```

### Environment Setup

Production cần:
- Environment variables (JWT_SECRET, DATABASE_URL, etc.)
- HTTPS/SSL certificates
- Reverse proxy (nginx)
- Database backups
- Monitoring

## Performance

- Database indexing
- Query optimization
- Caching strategy
- Frontend bundling optimization
- Image optimization

## Monitoring & Logging

- Request logging
- Error tracking
- Database query performance
- API response times

## Future Improvements

- Cache layer (Redis)
- Microservices architecture
- GraphQL API
- Real-time updates (WebSocket)
- Advanced analytics
