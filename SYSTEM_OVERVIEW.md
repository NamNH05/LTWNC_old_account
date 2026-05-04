# LTWNC Shop - System Overview

**Cập nhật:** 2026-05-04  
**Dự án:** LTWNC Shop - eCommerce Platform  
**Stack:** TypeScript/Express (Backend) + React/Vite (Frontend) + PostgreSQL  
**Trạng thái:** Phát triển (Development)

---

## 📋 Mục lục

1. [Tổng quan dự án](#tổng-quan-dự-án)
2. [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
3. [Backend](#backend)
4. [Frontend](#frontend)
5. [Database](#database)
6. [Cấu hình và môi trường](#cấu-hình-và-môi-trường)
7. [Module System](#module-system)
8. [API Endpoints](#api-endpoints)
9. [Quy trình phát triển](#quy-trình-phát-triển)

---

## 🎯 Tổng quan dự án

### Mục đích
Xây dựng nền tảng eCommerce hoàn chỉnh với:
- Quản lý sản phẩm và danh mục
- Giỏ hàng và thanh toán (VNPAY)
- Quản lý đơn hàng
- Xác thực người dùng (đăng ký, đăng nhập, OAuth)
- Bảng điều khiển quản trị
- Hệ thống module động

### Công nghệ chính
| Layer | Công nghệ |
|-------|-----------|
| **Backend API** | Express.js + TypeScript |
| **Frontend UI** | React 19 + Vite 8 |
| **Database** | PostgreSQL 16 |
| **ORM** | Prisma 4.16 |
| **Authentication** | JWT |
| **Payment Gateway** | VNPAY |
| **UI Components** | Ant Design v6 |
| **Styling** | CSS + Ant Design |
| **HTTP Client** | Fetch API |

### Cấu trúc thư mục chính
```
ltwnc-shop/
├── backend/                 # Backend API server
├── frontend/                # Frontend React app
├── infra/                   # Infrastructure (Docker)
├── docs/                    # Documentation
├── Ảnh giao diện/          # Screenshots
├── LICENSE
├── README.md
├── start-dev.bat           # Development startup script
└── setup.bat               # Setup script
```

---

## 🏗️ Kiến trúc hệ thống

### Tầng kiến trúc
```
┌─────────────────────────────────┐
│    Browser / Mobile Client       │
└────────────────┬────────────────┘
                 │
         ┌───────┴────────┐
         │    Frontend    │
         │  (React/Vite)  │
         └───────┬────────┘
                 │
    ┌────────────┴───────────┐
    │   HTTP/HTTPS (CORS)    │
    └────────────┬───────────┘
                 │
         ┌───────┴────────┐
         │    Backend     │
         │ (Express/TS)   │
         └───────┬────────┘
                 │
    ┌────────────┴───────────┐
    │   SQL Protocol (TCP)   │
    └────────────┬───────────┘
                 │
         ┌───────┴────────┐
         │   Database     │
         │ (PostgreSQL)   │
         └───────────────┘
```

### Middleware Stack (Backend)
1. **CORS** - Cross-origin request handling
2. **Express.json()** - JSON body parser
3. **Detailed Request Logger** - Request/response logging
4. **Debug Info Capture** - Debug information
5. **Request Context** - Context assignment
6. **Request Logger** - Simple request logging
7. **Rate Limiter** - API rate limiting (120 req/min)
8. **Auth Middleware** - JWT verification
9. **RBAC Middleware** - Role-based access control
10. **Module Middleware** - Module enable/disable check
11. **Error Handler** - Centralized error handling

---

## 💾 Backend

### Thông tin cơ bản
| Thuộc tính | Giá trị |
|-----------|--------|
| **Tên** | ltwnc-shop-backend |
| **Port** | 3000 (config) |
| **Runtime** | Node.js |
| **Ngôn ngữ** | TypeScript |
| **Package Manager** | npm |

### Dependencies chính
```json
{
  "express": "^5.2.1",
  "typescript": "^6.0.2",
  "@prisma/client": "^4.16.2",
  "jsonwebtoken": "^9.0.3",
  "bcrypt": "^6.0.0",
  "cors": "^2.8.6",
  "dotenv": "^17.3.1",
  "pg": "^8.20.0"
}
```

### Cấu trúc thư mục
```
backend/
├── src/
│   ├── app.ts                    # Express app setup
│   ├── index.ts                  # Server entry point
│   ├── config/
│   │   └── env.ts                # Environment variables
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── rbac.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── module.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   ├── request-context.middleware.ts
│   │   ├── request-logger.middleware.ts
│   │   └── detailed-logger.middleware.ts
│   ├── modules/                  # Feature modules
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── auth.service.ts
│   │   ├── user/
│   │   ├── product/
│   │   ├── cart/
│   │   ├── order/
│   │   ├── payment/
│   │   ├── address/
│   │   ├── announcement/
│   │   ├── admin/
│   │   ├── debug/
│   │   ├── gateway/
│   │   └── module.registry.ts   # Module manifest registry
│   ├── repositories/             # Data access layer
│   ├── services/                 # Business logic layer
│   ├── types/                    # TypeScript types
│   ├── utils/                    # Utility functions
│   └── models/
│       └── prisma.ts             # Prisma client
├── prisma/
│   ├── schema.prisma             # Prisma schema
│   ├── seed.ts                   # Database seeding
│   └── migrations/               # Database migrations
├── docs/
│   ├── MIGRATION_GUIDELINES.md
│   ├── MIGRATION_HISTORY.md
│   ├── MIGRATION_TEMPLATE.md
│   └── MODULES.md
├── package.json
├── tsconfig.json
└── .env.example
```

### Scripts NPM
```bash
npm run dev           # Start development server (ts-node-dev)
npm run seed          # Seed database with sample data
npm test              # Run tests (currently not implemented)
```

### Environment Variables (`.env`)
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ltwnc_shop

# JWT
JWT_SECRET=your_secret_key
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d
RESET_TOKEN_TTL=15m

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=120

# Cluster
ENABLE_CLUSTER_MODE=false
CLUSTER_WORKERS=1

# VNPAY Payment
VNPAY_TMN_CODE=xxx
VNPAY_HASH_SECRET=xxx
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5173/payment/success
VNPAY_IPN_URL=http://localhost:3000/api/payment/vnpay/ipn
VNPAY_LOCALE=vn

# OAuth (Google/Facebook)
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
FACEBOOK_CLIENT_ID=xxx
FACEBOOK_CLIENT_SECRET=xxx
OAUTH_REDIRECT_URI=http://localhost:5173/auth/callback

# Frontend
FRONTEND_URL=https://hnamofficial.id.vn
```

---

## ⚛️ Frontend

### Thông tin cơ bản
| Thuộc tính | Giá trị |
|-----------|--------|
| **Tên** | ltwnc-shop-frontend |
| **Port Dev** | 5173 (Vite default) |
| **Port Prod** | 80/443 |
| **Framework** | React 19 |
| **Build Tool** | Vite 8 |
| **Package Manager** | npm |

### Dependencies chính
```json
{
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "react-router-dom": "^7.14.0",
  "axios": "^1.14.0",
  "antd": "^6.3.5",
  "vite": "^8.0.1"
}
```

### Cấu trúc thư mục
```
frontend/
├── src/
│   ├── main.jsx                  # React entry point
│   ├── App.jsx                   # Root component
│   ├── App.css
│   ├── index.css
│   ├── components/
│   │   ├── common/
│   │   │   └── ModuleGuard.jsx   # Module permission wrapper
│   │   ├── layout/
│   │   ├── product/
│   │   ├── cart/
│   │   └── ...
│   ├── pages/
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── Register/
│   │   ├── Product/
│   │   ├── ProductDetail/
│   │   ├── CategoryPage/
│   │   ├── SearchPage/
│   │   ├── CartPage/
│   │   ├── OrderManagement/
│   │   ├── ProfilePage/
│   │   ├── AddressPage/
│   │   ├── Payment/
│   │   ├── AuthCallback/
│   │   ├── AdminDashboard/
│   │   │   ├── AdminProductsPage/
│   │   │   ├── OrderManagementPage/
│   │   │   ├── UserManagementPage/
│   │   │   ├── AuditLogsPage/
│   │   │   └── ModuleManagementPage/
│   │   └── ...
│   ├── routes/
│   │   └── index.jsx             # Route definitions
│   ├── context/
│   │   ├── AuthContext.jsx       # User authentication state
│   │   ├── CartContext.jsx       # Shopping cart state
│   │   └── ModuleContext.jsx     # Module enable/disable state
│   ├── services/
│   │   ├── api.js                # API client
│   │   └── api-helper.js         # API utilities
│   ├── config/
│   ├── data/
│   ├── styles/
│   └── utils/
│       ├── logger.js
│       └── ...
├── public/
├── index.html
├── vite.config.js
├── eslint.config.js
├── package.json
└── .env.example
```

### Routes
```
/                                 # Home page
/san-pham                        # Category page
/nam, /nu, /giay, /phu-kien      # Category shortcuts
/search                          # Search page
/product/:id                     # Product detail
/cart                            # Shopping cart
/checkout                        # Order checkout
/address                         # Address management
/payment                         # Payment page
/payment/callback                # Payment callback
/payment/success                 # Payment success
/profile                         # User profile
/login                           # Login
/register                        # Register
/auth/callback                   # OAuth callback
/admin/products                  # Admin: Products
/admin/orders                    # Admin: Orders
/admin/users                     # Admin: Users
/admin/audit-logs               # Admin: Audit logs
/admin/modules                   # Admin: Module management
```

### Contexts
1. **AuthContext** - User authentication and profile
   - State: `user`, `token`
   - Methods: `login()`, `logout()`

2. **CartContext** - Shopping cart management
   - State: `cartItems`, `isLoading`
   - Methods: `addToCart()`, `updateCartItem()`, `removeFromCart()`, `clearCart()`, `syncCart()`
   - Behavior:
     - Guest users: localStorage persistence
     - Logged-in users: Server-side persistence with merge on login

3. **ModuleContext** - Module visibility control
   - State: `moduleStatuses`, `moduleCatalog`, `loading`
   - Methods: `isModuleEnabled()`, `refreshModuleStatuses()`

### Scripts NPM
```bash
npm run dev       # Start Vite dev server
npm run build     # Build for production
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

### Environment Variables (`.env`)
```env
# API Configuration
VITE_API_URL=              # Auto-detect by default
VITE_API_URL_LOCAL=http://localhost:8080/api
VITE_API_URL_PROD=https://hnamofficial.id.vn/api

# App Configuration
VITE_APP_NAME=LTWNC Shop
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_PAYMENT=true
VITE_ENABLE_OAUTH=true
```

### API Base URL Logic
- **Localhost development**: `http://localhost:8080/api`
- **Production**: `https://api.<domain>/api`
- **Custom**: Set via `VITE_API_URL`

---

## 🗄️ Database

### Cơ bản
| Thuộc tính | Giá trị |
|-----------|--------|
| **DBMS** | PostgreSQL 16 |
| **Host** | localhost |
| **Port** | 5432 |
| **Database** | shopdb |
| **User** | shopuser |
| **Password** | shoppass |

### Connection String
```
postgresql://shopuser:shoppass@localhost:5432/shopdb
```

### Models chính

#### User (Người dùng)
```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  password  String    (bcrypted)
  fullName  String
  phone     String?
  role      UserRole  (ADMIN | USER)
  isActive  Boolean   @default(true)
  deletedAt DateTime? (soft delete)
  createdAt DateTime
  updatedAt DateTime
  
  // Relations
  addresses Address[]
  carts     Cart[]
  orders    Order[]
  auditLogs AuditLog[]
}
```

#### Product (Sản phẩm)
```prisma
model Product {
  id          Int       @id @default(autoincrement())
  categoryId  Int
  name        String
  slug        String    @unique
  desc        String?
  price       Float
  originPrice Float?
  stock       Int       @default(0)
  image       String?
  isActive    Boolean   @default(true)
  deletedAt   DateTime?
  createdAt   DateTime
  updatedAt   DateTime
  
  // Relations
  category   Category    @relation(...)
  cartItems  CartItem[]
  orderItems OrderItem[]
}
```

#### Category (Danh mục)
```prisma
model Category {
  id        Int       @id @default(autoincrement())
  name      String    @unique
  slug      String    @unique
  desc      String?
  deletedAt DateTime?
  createdAt DateTime
  updatedAt DateTime
  
  // Relations
  products Product[]
}
```

#### Order (Đơn hàng)
```prisma
model Order {
  id           Int         @id @default(autoincrement())
  userId       Int
  status       OrderStatus (PENDING|CONFIRMED|SHIPPED|DELIVERED|CANCELLED)
  totalPrice   Float
  shippingAddr String
  phoneNumber  String
  note         String?
  deletedAt    DateTime?
  createdAt    DateTime
  updatedAt    DateTime
  
  // Relations
  user  User        @relation(...)
  items OrderItem[]
  payment Payment?
}
```

#### Cart & CartItem (Giỏ hàng)
```prisma
model Cart {
  id        Int      @id @default(autoincrement())
  userId    Int      @unique
  createdAt DateTime
  updatedAt DateTime
  
  // Relations
  user  User       @relation(...)
  items CartItem[]
}

model CartItem {
  id        Int      @id @default(autoincrement())
  cartId    Int
  productId Int
  quantity  Int
  createdAt DateTime
  updatedAt DateTime
  
  // Relations
  cart    Cart    @relation(...)
  product Product @relation(...)
}
```

#### Payment (Thanh toán)
```prisma
model Payment {
  id             Int       @id @default(autoincrement())
  orderId        Int       @unique
  amount         Float
  paymentMethod  String?   (VNPAY, etc.)
  paymentStatus  String    (PENDING|SUCCESS|FAILED)
  transactionId  String?
  bankCode       String?   (VNPAY)
  responseCode   String?   (VNPAY)
  paidAt         DateTime?
  gatewayPayload String?
  notes          String?
  createdAt      DateTime
  updatedAt      DateTime
  
  // Relations
  order Order @relation(...)
}
```

#### AuditLog (Nhật ký kiểm toán)
```prisma
model AuditLog {
  id        Int       @id @default(autoincrement())
  userId    Int?
  entity    String    (entity type)
  entityId  Int?
  action    String    (CREATE|UPDATE|DELETE|etc.)
  oldValues String?   (JSON)
  newValues String?   (JSON)
  createdAt DateTime
  
  // Relations
  user User? @relation(...)
}
```

### Enums
```prisma
enum UserRole {
  ADMIN
  USER
}

enum OrderStatus {
  PENDING      // Chờ xác nhận
  CONFIRMED    // Đã xác nhận
  SHIPPED      // Đã gửi
  DELIVERED    // Đã giao
  CANCELLED    // Đã hủy
}
```

### Migrations
| ID | Tên | Mục đích |
|----|-----|---------|
| 0_init | Initial schema | Khởi tạo schema cơ bản |
| 20260408154500_sync_schema_step1 | Sync schema | Đồng bộ với Prisma schema |
| 20260409160000_soft_delete_support | Add soft delete | Thêm `deletedAt` columns |
| 20260409173000_order_user_createdat_index | Optimize queries | Index tối ưu hóa |
| 20260415_add_payment_methods | Payment methods | Bảng payment methods |
| 20260420093000_add_payment_model_fields | VNPAY fields | Thêm fields VNPAY |
| 20260416_step5_query_optimization | Views & optimization | Database views |
| 20260502082224_add_module_settings | Module settings | Bảng module settings |

### Database Views
1. **user_orders_summary** - Tóm tắt đơn hàng theo người dùng
2. **product_inventory_status** - Trạng thái kho sản phẩm
3. **order_fulfillment_status** - Trạng thái giao hàng
4. **product_popularity** - Sản phẩm phổ biến
5. **category_performance** - Hiệu suất danh mục
6. **user_spending_report** - Báo cáo chi tiêu người dùng

---

## ⚙️ Cấu hình và môi trường

### Docker Compose
```yaml
# infra/docker-compose.yml
services:
  postgres:
    image: postgres:16
    container_name: ltnwc_postgres
    environment:
      POSTGRES_DB: shopdb
      POSTGRES_USER: shopuser
      POSTGRES_PASSWORD: shoppass
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U shopuser -d shopdb"]
      interval: 10s
      timeout: 5s
      retries: 5
```

### Setup dự án
1. **Clone repository**
```bash
git clone https://github.com/your-username/ltwnc-shop.git
cd ltwnc-shop
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your config
```

3. **Setup Database**
```bash
# Docker (recommended)
cd ../infra
docker-compose up -d

# Or: Setup PostgreSQL manually
```

4. **Run Migrations**
```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

5. **Setup Frontend**
```bash
cd frontend
npm install
cp .env.example .env
```

6. **Start Development**
```bash
# Terminal 1: Backend
cd backend
npm run dev        # Runs on http://localhost:3000

# Terminal 2: Frontend
cd frontend
npm run dev        # Runs on http://localhost:5173
```

---

## 🧩 Module System

### Khái niệm
Module system cho phép bật/tắt các tính năng mà không cần deploy lại. Mỗi module:
- Có manifest (cấu hình)
- Có controller, service, routes
- Có entry point riêng
- Có thể bật/tắt từ admin dashboard

### Modules hiện có
| Module | Label | Mô tả | Mặc định | Danh mục |
|--------|-------|-------|---------|---------|
| **auth** | Xác thực | Đăng nhập, đăng ký, JWT | Bật | account |
| **product** | Sản phẩm | Danh mục, chi tiết sản phẩm | Bật | commerce |
| **cart** | Giỏ hàng | Quản lý giỏ hàng | Bật | commerce |
| **order** | Đơn hàng | Checkout, theo dõi đơn hàng | Bật | commerce |
| **payment** | Thanh toán | VNPAY, phương thức thanh toán | Bật | commerce |
| **user** | Người dùng | Hồ sơ, quản lý tài khoản | Bật | account |
| **address** | Địa chỉ | Quản lý địa chỉ giao hàng | Bật | account |
| **announcement** | Thông báo | Thông báo hệ thống | Tắt | content |
| **admin** | Quản trị | Bảng điều khiển quản trị | Bật | admin |

### Cấu trúc module
```typescript
// Module manifest
{
  name: "product",
  label: "Sản phẩm",
  description: "Danh mục, chi tiết và quản lý sản phẩm",
  category: "commerce",
  defaultEnabled: true,
  entryPoint: "src/modules/product",
  routes: ["GET /api/products", "GET /api/products/:productId"],
  dependencies: [],
  sample: false
}
```

### Tạo module mới trong 5 phút
1. Copy `src/modules/announcement` → `src/modules/<new-module>`
2. Cập nhật manifest: `name`, `label`, `description`, `routes`
3. Viết controller, service, routes
4. Đăng ký trong `src/modules/module.registry.ts`
5. Mount router trong `src/app.ts`

---

## 🔌 API Endpoints

### Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://api.hnamofficial.id.vn/api`

### Rate Limiting
- **Window**: 60 seconds
- **Max requests**: 120

### Authentication
```
Authorization: Bearer <access_token>
```

### Module Routes

#### Auth
| Phương thức | Endpoint | Xác thực | Mô tả |
|------------|----------|---------|-------|
| POST | `/auth/register` | ❌ | Đăng ký tài khoản |
| POST | `/auth/login` | ❌ | Đăng nhập |
| POST | `/auth/oauth/google` | ❌ | Google OAuth |
| POST | `/auth/oauth/facebook` | ❌ | Facebook OAuth |
| POST | `/auth/refresh` | ❌ | Làm mới token |
| POST | `/auth/logout` | ❌ | Đăng xuất |
| POST | `/auth/password/forgot` | ❌ | Quên mật khẩu |
| POST | `/auth/password/reset` | ❌ | Reset mật khẩu |
| GET | `/auth/me` | ✅ | Lấy profile hiện tại |
| GET | `/auth/sessions` | ✅ | Danh sách phiên |
| POST | `/auth/logout-all` | ✅ | Đăng xuất tất cả |
| GET | `/auth/admin/probe` | ✅ ADMIN | Kiểm tra quyền admin |

#### Product
| Phương thức | Endpoint | Xác thực | Mô tả |
|------------|----------|---------|-------|
| GET | `/products` | ❌ | Danh sách sản phẩm |
| GET | `/products/categories` | ❌ | Danh sách danh mục |
| GET | `/products/:productId` | ❌ | Chi tiết sản phẩm |
| POST | `/products` | ✅ ADMIN | Tạo sản phẩm |
| PUT | `/products/:productId` | ✅ ADMIN | Cập nhật sản phẩm |
| DELETE | `/products/:productId` | ✅ ADMIN | Xóa sản phẩm |

#### Cart
| Phương thức | Endpoint | Xác thực | Mô tả |
|------------|----------|---------|-------|
| GET | `/cart` | ✅ | Lấy giỏ hàng |
| POST | `/cart/add` | ✅ | Thêm vào giỏ |
| POST | `/cart/sync` | ✅ | Đồng bộ giỏ hàng |
| PUT | `/cart/:cartItemId` | ✅ | Cập nhật item |
| DELETE | `/cart/:cartItemId` | ✅ | Xóa item |
| DELETE | `/cart` | ✅ | Xóa toàn bộ |

#### Order
| Phương thức | Endpoint | Xác thực | Mô tả |
|------------|----------|---------|-------|
| POST | `/orders` | ✅ | Tạo đơn hàng |
| POST | `/orders/checkout` | ✅ | Checkout |
| GET | `/orders/my` | ✅ | Đơn hàng của tôi |
| GET | `/orders/:orderId` | ✅ | Chi tiết đơn hàng |
| PATCH | `/orders/:orderId/cancel` | ✅ | Hủy đơn hàng |
| GET | `/orders` | ✅ ADMIN | Tất cả đơn hàng |
| PATCH | `/orders/:orderId/status` | ✅ ADMIN | Cập nhật trạng thái |

#### Payment
| Phương thức | Endpoint | Xác thực | Mô tả |
|------------|----------|---------|-------|
| GET | `/payment/methods` | ❌ | Phương thức thanh toán |
| GET | `/payment` | ✅ | Thanh toán của tôi |
| POST | `/payment` | ✅ | Tạo thanh toán |
| POST | `/payment/vnpay/create-url` | ✅ | Tạo URL VNPAY |
| GET | `/payment/vnpay/return` | ❌ | VNPAY return URL |
| GET | `/payment/vnpay/ipn` | ❌ | VNPAY IPN |
| GET | `/payment/:paymentId` | ✅ | Chi tiết thanh toán |

#### User
| Phương thức | Endpoint | Xác thực | Mô tả |
|------------|----------|---------|-------|
| GET | `/users/profile` | ✅ | Profile của tôi |
| PUT | `/users/profile` | ✅ | Cập nhật profile |
| GET | `/users` | ✅ ADMIN | Danh sách người dùng |
| DELETE | `/users/:userId` | ✅ ADMIN | Xóa người dùng |
| POST | `/users/:userId/grant-admin` | ✅ ADMIN | Cấp quyền admin |
| POST | `/users/:userId/revoke-admin` | ✅ ADMIN | Thu hồi quyền admin |

#### Address
| Phương thức | Endpoint | Xác thực | Mô tả |
|------------|----------|---------|-------|
| GET | `/addresses` | ✅ | Danh sách địa chỉ |
| POST | `/addresses` | ✅ | Tạo địa chỉ |
| PUT | `/addresses/:addressId` | ✅ | Cập nhật địa chỉ |
| DELETE | `/addresses/:addressId` | ✅ | Xóa địa chỉ |
| POST | `/addresses/:addressId/set-default` | ✅ | Đặt mặc định |

#### Admin
| Phương thức | Endpoint | Xác thực | Mô tả |
|------------|----------|---------|-------|
| GET | `/admin/modules` | ✅ ADMIN | Trạng thái module |
| PUT | `/admin/modules/:moduleName` | ✅ ADMIN | Cập nhật module |
| GET | `/admin/orders` | ✅ ADMIN | Tất cả đơn hàng |
| GET | `/admin/users` | ✅ ADMIN | Tất cả người dùng |
| GET | `/admin/audit-logs` | ✅ ADMIN | Nhật ký kiểm toán |

---

## 📋 Quy trình phát triển

### Database Migration
1. Cập nhật `prisma/schema.prisma`
2. Tạo migration: `npx prisma migrate dev --name <name>`
3. Kiểm tra SQL: `npx prisma migrate resolve --rolled-back <name>` (nếu cần)
4. Test: `npx prisma migrate reset` (local dev only)
5. Seed: `npx prisma db seed`

### Naming Convention
- Migrations: `YYYYMMDDHHmm_<short_goal>`
- Branches: `feature/<module-name>`
- Commits: Conventional commits

### Mục tiêu bản kỳ này
- [ ] Hoàn thành module system
- [ ] Tối ưu hóa performance
- [ ] Thêm unit tests
- [ ] Production deployment

---

## 📚 Tài liệu tham khảo

### Tệp tài liệu chính
- `docs/API.md` - API documentation
- `docs/ARCHITECTURE.md` - Kiến trúc hệ thống
- `docs/INSTALLATION.md` - Hướng dẫn cài đặt
- `docs/DESIGN_SYSTEM.md` - Design system
- `backend/docs/MODULES.md` - Hệ thống module
- `backend/docs/MIGRATION_GUIDELINES.md` - Quy tắc migration
- `backend/docs/MIGRATION_HISTORY.md` - Lịch sử migration

### Các báo cáo tiến độ
- `docs/reports/REPORT_*.md` - Báo cáo tiến độ

---

## 🚀 Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### URL
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000/api`
- Database: `localhost:5432/shopdb`

---

**Các agent khác có thể sử dụng tài liệu này để:**
1. Hiểu kiến trúc và cấu trúc dự án
2. Xây dựng các module mới
3. Phát triển tính năng bổ sung
4. Xây dựng lại dự án từ đầu
5. Tối ưu hóa hiệu suất

---

*Generated: 2026-05-04*
