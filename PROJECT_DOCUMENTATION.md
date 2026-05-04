# 📌 LTWNC Shop - Project Documentation

Bản thống kê chi tiết về hệ thống LTWNC Shop eCommerce Platform. Các agent khác có thể sử dụng tài liệu này để hiểu rõ về dự án và xây dựng được một hệ thống y hệt.

---

## 🚀 Bắt đầu nhanh

### Dành cho agent mới
**5 phút đầu tiên:**
1. Đọc [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)
2. Chọn task phù hợp
3. Đọc tài liệu tương ứng

### Dành cho setup local
**30-45 phút:**
Xem [REBUILD_GUIDE.md](./REBUILD_GUIDE.md)

### Dành cho phát triển code
**Trước khi code:**
Xem [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md)

---

## 📚 Tài liệu chính

### 1. **[SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md)** ⭐⭐⭐⭐⭐
   - **Mục đích**: Tổng quan toàn bộ hệ thống
   - **Nội dung**:
     - Kiến trúc tổng thể
     - Backend: Express/TypeScript
     - Frontend: React/Vite
     - Database: PostgreSQL + Prisma
     - Module system
     - API endpoints
     - Environment variables
   - **Khi cần đọc**: Lần đầu vào dự án, muốn hiểu architecture

### 2. **[REBUILD_GUIDE.md](./REBUILD_GUIDE.md)** ⭐⭐⭐⭐⭐
   - **Mục đích**: Hướng dẫn setup từ đầu
   - **Nội dung**:
     - Cài đặt môi trường
     - Cài đặt PostgreSQL/Docker
     - Setup backend
     - Setup frontend
     - Khắc phục sự cố phổ biến
     - Deployment guide
   - **Khi cần đọc**: Lần đầu setup local, cần rebuild hệ thống

### 3. **[DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md)** ⭐⭐⭐⭐
   - **Mục đích**: Quy tắc và best practices
   - **Nội dung**:
     - Cấu trúc thư mục chi tiết
     - Quy ước naming
     - Git workflow
     - Testing guidelines
     - Security guidelines
     - Performance tips
   - **Khi cần đọc**: Trước khi bắt đầu code, viết pull request

### 4. **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** ⭐⭐⭐⭐
   - **Mục đích**: Chỉ mục tài liệu
   - **Nội dung**:
     - Quick start
     - Workflows phổ biến
     - FAQ
     - Tech stack reference
   - **Khi cần đọc**: Tìm kiếm tài liệu phù hợp

### 5. **[docs/API.md](./docs/API.md)** ⭐⭐⭐⭐
   - **Mục đích**: Danh sách tất cả API endpoints
   - **Nội dung**:
     - Request/response format
     - Tất cả endpoints
     - Authentication
     - Rate limiting
   - **Khi cần đọc**: Cần xem endpoint nào, format request/response

---

## 📊 Cấu trúc dự án

```
ltwnc-shop/
├── 📄 DOCUMENTATION_INDEX.md              ← Chỉ mục tài liệu
├── 📄 SYSTEM_OVERVIEW.md                  ← Tổng quan hệ thống ⭐
├── 📄 REBUILD_GUIDE.md                    ← Hướng dẫn setup ⭐
├── 📄 DEVELOPMENT_GUIDELINES.md           ← Quy tắc phát triển ⭐
├── 📄 README.md                           ← Original readme
│
├── backend/                               ← Node.js API server
│   ├── src/
│   │   ├── modules/                       ← Feature modules (auth, product, etc.)
│   │   ├── middlewares/                   ← Express middlewares
│   │   ├── config/                        ← Environment config
│   │   ├── services/                      ← Business logic
│   │   ├── repositories/                  ← Data access
│   │   └── utils/                         ← Utilities
│   ├── prisma/
│   │   ├── schema.prisma                  ← Database schema
│   │   ├── seed.ts                        ← Seed data
│   │   └── migrations/                    ← DB migrations (7 migrations)
│   ├── docs/                              ← Backend docs
│   │   ├── MODULES.md                     ← Module system
│   │   ├── MIGRATION_GUIDELINES.md        ← DB migration rules
│   │   └── MIGRATION_HISTORY.md           ← Migration history
│   ├── package.json                       ← Dependencies: Express, Prisma, JWT, bcrypt
│   └── .env.example                       ← Environment template
│
├── frontend/                              ← React/Vite web app
│   ├── src/
│   │   ├── pages/                         ← Page components
│   │   ├── components/                    ← Reusable components
│   │   ├── context/                       ← Global state (Auth, Cart, Module)
│   │   ├── services/                      ← API client
│   │   └── routes/                        ← React Router setup
│   ├── package.json                       ← Dependencies: React 19, Vite 8, Ant Design
│   └── .env.example                       ← Environment template
│
├── infra/                                 ← Docker infrastructure
│   └── docker-compose.yml                 ← PostgreSQL container
│
└── docs/                                  ← Project documentation
    ├── API.md                             ← API endpoints reference
    ├── ARCHITECTURE.md                    ← Architecture details
    ├── DESIGN_SYSTEM.md                   ← Design guidelines
    ├── INSTALLATION.md                    ← Installation guide
    └── reports/                           ← Progress reports
```

---

## 🔑 Key Information

### Tech Stack
- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React 19 + Vite 8 + Ant Design 6
- **Database**: PostgreSQL 16 + Prisma ORM
- **Auth**: JWT (Bearer tokens)
- **Payment**: VNPAY integration
- **Deployment**: Docker

### Key Features
- ✅ Product catalog & management
- ✅ Shopping cart (guest + logged-in)
- ✅ Order management
- ✅ Payment processing (VNPAY)
- ✅ User authentication (signup, login, OAuth)
- ✅ Admin dashboard
- ✅ Module system (enable/disable features)
- ✅ Soft delete support
- ✅ Audit logging

### Database Models
- User (với UserRole: ADMIN, USER)
- Product & Category
- Cart & CartItem
- Order & OrderItem
- Payment (VNPAY integration)
- Address
- AuditLog
- ModuleSettings

---

## 💡 Common Tasks

| Task | Tài liệu | Thời gian |
|------|---------|---------|
| Setup dự án locally | [REBUILD_GUIDE.md](./REBUILD_GUIDE.md) | 45 min |
| Thêm API endpoint | [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) | 30 min |
| Tạo module mới | [backend/docs/MODULES.md](./backend/docs/MODULES.md) | 45 min |
| Thay đổi database | [backend/docs/MIGRATION_GUIDELINES.md](./backend/docs/MIGRATION_GUIDELINES.md) | 20 min |
| Thêm React component | [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) | 30 min |
| Deploy lên production | [REBUILD_GUIDE.md](./REBUILD_GUIDE.md) | 60 min |

---

## 🎯 For Different Roles

### 👨‍💻 Backend Developer
1. Đọc: [SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md) - Backend section
2. Đọc: [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) - Backend section
3. Setup: [REBUILD_GUIDE.md](./REBUILD_GUIDE.md)
4. Tham khảo: [docs/API.md](./docs/API.md) & [backend/docs/MODULES.md](./backend/docs/MODULES.md)

### 👨‍💻 Frontend Developer
1. Đọc: [SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md) - Frontend section
2. Đọc: [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) - Frontend section
3. Setup: [REBUILD_GUIDE.md](./REBUILD_GUIDE.md)
4. Tham khảo: [docs/API.md](./docs/API.md)

### 🏗️ Full-stack Developer
1. Đọc: [SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md) - Toàn bộ
2. Đọc: [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) - Toàn bộ
3. Setup: [REBUILD_GUIDE.md](./REBUILD_GUIDE.md)
4. Tham khảo: Tất cả docs khác

### 🚀 DevOps/Deployment
1. Đọc: [REBUILD_GUIDE.md](./REBUILD_GUIDE.md) - Deployment section
2. Đọc: [SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md) - Environment section
3. Kiểm tra: infra/docker-compose.yml

---

## ✅ Verification Checklist

Sau khi setup, kiểm tra:

- [ ] PostgreSQL đang chạy
- [ ] Backend API chạy trên http://localhost:3000
- [ ] Frontend chạy trên http://localhost:5173
- [ ] Database migrations đã run
- [ ] Seed data đã nhập
- [ ] Có thể login với seed account
- [ ] Có thể add product to cart
- [ ] Admin dashboard accessible

---

## 🔄 Workflow để tạo project y hệt

### Bước 1: Hiểu kiến trúc (1 giờ)
- Đọc [SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md)

### Bước 2: Setup environment (1-2 giờ)
- Xem [REBUILD_GUIDE.md](./REBUILD_GUIDE.md)
- Cài Node.js, PostgreSQL/Docker
- Setup backend & frontend

### Bước 3: Tạo backend (2-3 giờ)
- Setup Express app
- Configure middlewares
- Setup Prisma & migrations
- Create modules

### Bước 4: Tạo frontend (2-3 giờ)
- Setup Vite + React
- Create pages & components
- Setup routing
- Setup contexts

### Bước 5: Tối ưu & deploy (1-2 giờ)
- Test all features
- Optimize performance
- Deploy to production

**Tổng cộng: 7-11 giờ**

---

## 📞 Quick Reference

### API Base URL
- Dev: `http://localhost:3000/api`
- Prod: `https://api.hnamofficial.id.vn/api`

### Database Connection
```
postgresql://shopuser:shoppass@localhost:5432/shopdb
```

### Important Endpoints
- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `GET /products` - List products
- `GET /cart` - Get cart (auth required)
- `POST /orders/checkout` - Checkout
- `GET /orders/my` - My orders

### Environment Variables
```
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret
PORT=3000  (backend)
VITE_API_URL=...  (frontend)
```

---

## 🎓 Learning Path

1. **Hiểu architecture** → [SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md)
2. **Setup local** → [REBUILD_GUIDE.md](./REBUILD_GUIDE.md)
3. **Bắt đầu code** → [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md)
4. **Tìm kiếm info** → [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)
5. **Xem API** → [docs/API.md](./docs/API.md)
6. **Module system** → [backend/docs/MODULES.md](./backend/docs/MODULES.md)
7. **Database** → [backend/docs/MIGRATION_GUIDELINES.md](./backend/docs/MIGRATION_GUIDELINES.md)

---

## 📝 Notes

- **Tất cả tài liệu đều viết bằng Markdown** (dễ đọc, dễ cập nhật)
- **Tài liệu được tổ chức logic** (dễ tìm kiếm)
- **Có ví dụ code cụ thể** (dễ thực hành)
- **Update date có ở cuối mỗi file** (biết tính hiện đại)

---

## 🎯 Mục tiêu tài liệu này

✅ Cung cấp **bản thống kê toàn diện** về hệ thống  
✅ Giúp agent khác **setup local dự án**  
✅ Hướng dẫn cách **xây dựng lại project y hệt**  
✅ Định rõ **quy tắc phát triển** và best practices  
✅ Tham khảo **nhanh chóng** khi cần thông tin  

---

**Để bắt đầu: Đọc [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) trong 5 phút**

*Generated: 2026-05-04*  
*Version: 1.0.0*
