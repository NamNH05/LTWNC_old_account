# LTWNC Shop - Setup Guide for Rebuilding

Hướng dẫn chi tiết để xây dựng lại toàn bộ dự án LTWNC Shop từ đầu.

---

## 📋 Yêu cầu hệ thống

### Hardware
- **RAM**: Tối thiểu 4GB (8GB khuyến nghị)
- **Disk**: Tối thiểu 5GB
- **CPU**: Dual-core (4-core khuyến nghị)

### Software
| Phần mềm | Phiên bản | Lưu ý |
|---------|----------|-------|
| Node.js | 18+ | Cài đặt từ nodejs.org |
| npm | 9+ | Đi kèm với Node.js |
| Git | Latest | Cài đặt từ git-scm.com |
| PostgreSQL | 14+ | Hoặc dùng Docker |
| Docker (tuỳ chọn) | Latest | Để chạy PostgreSQL |
| VS Code | Latest | IDE khuyến nghị |

---

## 🚀 Bước 1: Chuẩn bị môi trường

### 1.1 Cài đặt Node.js
```bash
# Kiểm tra phiên bản
node --version   # v18.0.0 trở lên
npm --version    # 9.0.0 trở lên
```

### 1.2 Cài đặt Git
```bash
# Kiểm tra
git --version
```

### 1.3 Cài đặt PostgreSQL

**Tuỳ chọn A: Cài đặt trực tiếp (Windows/Mac/Linux)**
1. Tải từ https://www.postgresql.org/download/
2. Cài đặt với default settings
3. Nhớ password của user `postgres`

**Tuỳ chọn B: Dùng Docker (Khuyến nghị)**
```bash
# Cài đặt Docker từ docker.com
# Kiểm tra
docker --version
docker-compose --version
```

---

## 📦 Bước 2: Clone dự án

```bash
# Clone repository
git clone https://github.com/your-username/ltwnc-shop.git
cd ltwnc-shop

# Kiểm tra cấu trúc
dir  # Windows: ls (Mac/Linux)
```

Expected structure:
```
ltwnc-shop/
├── backend/
├── frontend/
├── infra/
├── docs/
├── README.md
└── ...
```

---

## 🗄️ Bước 3: Cài đặt Database

### Tuỳ chọn A: Docker (Khuyến nghị)

```bash
# Vào thư mục infrastructure
cd infra

# Khởi chạy PostgreSQL container
docker-compose up -d

# Kiểm tra container đang chạy
docker ps
# Sẽ thấy: ltnwc_postgres

# Kiểm tra kết nối
docker exec -it ltnwc_postgres psql -U shopuser -d shopdb -c "SELECT 1"
# Output: 1 ✓
```

### Tuỳ chọn B: PostgreSQL cài đặt trực tiếp

```bash
# Windows PowerShell
sqlcmd -S localhost -U postgres
# Nhập password

# Tạo database
CREATE DATABASE shopdb;
CREATE USER shopuser WITH PASSWORD 'shoppass';
GRANT ALL PRIVILEGES ON DATABASE shopdb TO shopuser;
```

### Tuỳ chọn C: Dùng PgAdmin (GUI)

1. Mở PgAdmin từ Start Menu
2. Đăng nhập (default: admin@pgadmin.org)
3. Tạo server:
   - Host: localhost
   - Username: postgres
   - Password: (password bạn đặt)
4. Tạo database: `shopdb`
5. Tạo user: `shopuser` với password `shoppass`

---

## 🔧 Bước 4: Cài đặt Backend

```bash
# Từ thư mục gốc
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env
cp .env.example .env

# Cập nhật .env với database connection
# DATABASE_URL=postgresql://shopuser:shoppass@localhost:5432/shopdb
```

### Cấu hình .env
```env
# Server
PORT=3000
NODE_ENV=development

# Database (phải match với database bạn tạo)
DATABASE_URL=postgresql://shopuser:shoppass@localhost:5432/shopdb

# JWT Secret (đổi thành string ngẫu nhiên)
JWT_SECRET=your_very_long_random_secret_key_here_change_in_production_12345

# Token TTL
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d
RESET_TOKEN_TTL=15m

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=120

# VNPAY (để trống nếu chưa có account)
VNPAY_TMN_CODE=
VNPAY_HASH_SECRET=
VNPAY_RETURN_URL=http://localhost:5173/payment/success
VNPAY_IPN_URL=http://localhost:3000/api/payment/vnpay/ipn

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Khởi tạo Database Schema

```bash
# Chạy migrations
npx prisma migrate dev

# Hoặc nếu cần reset (chỉ dev, sẽ xóa dữ liệu)
npx prisma migrate reset

# Seed sample data
npx prisma db seed

# Verify client
npx prisma generate
```

### Test Backend

```bash
# Chạy development server
npm run dev

# Expected output:
# === Backend Started ===
# URL: http://localhost:3000
# PID: 12345
# ENV: development
# ========================

# Test endpoint
# Browser: http://localhost:3000/
# Response: { "service": "LTWNC Backend", "status": "ok" }

# Hoặc dùng curl
# curl http://localhost:3000/
```

Để backend chạy, giữ terminal này mở hoặc chạy ở background.

---

## ⚛️ Bước 5: Cài đặt Frontend

```bash
# Từ thư mục gốc
cd frontend

# Cài đặt dependencies
npm install

# Tạo file .env
cp .env.example .env
```

### Cấu hình .env
```env
# API Configuration
# Để trống để auto-detect (dev → localhost:8080, prod → api.domain)
VITE_API_URL=

# Hoặc chỉ định URL tương ứng
VITE_API_URL_LOCAL=http://localhost:8080/api
VITE_API_URL_PROD=https://api.hnamofficial.id.vn/api

# App
VITE_APP_NAME=LTWNC Shop
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_PAYMENT=true
VITE_ENABLE_OAUTH=true
```

### Test Frontend

```bash
# Chạy dev server
npm run dev

# Expected output:
# VITE v8.0.0  ready in 234 ms
# 
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help

# Mở browser: http://localhost:5173/
```

---

## ✅ Bước 6: Xác minh cài đặt

### Checklist
- [ ] Docker running (nếu dùng Docker)
- [ ] PostgreSQL accessible
- [ ] Backend đang chạy (http://localhost:3000)
- [ ] Frontend đang chạy (http://localhost:5173)
- [ ] Database migrations đã chạy
- [ ] Seed data đã được nhập

### Test Endpoints

```bash
# 1. Test backend health
curl http://localhost:3000/

# Response:
# {"service":"LTWNC Backend","status":"ok"}

# 2. Test API
curl http://localhost:3000/api/products

# Response (có thể khác nếu chưa seed)
# {...}

# 3. Test frontend
# Mở browser: http://localhost:5173/
# Nên thấy trang chủ
```

---

## 🔄 Bước 7: Khắc phục sự cố phổ biến

### Port bị chiếm
```bash
# Kiểm tra process đang dùng port 3000
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux

# Kill process
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # Mac/Linux

# Hoặc đổi port trong .env
# PORT=3001
```

### Database connection failed
```bash
# Kiểm tra connection string
# DATABASE_URL=postgresql://shopuser:shoppass@localhost:5432/shopdb
#                            ↑ user        ↑ password  ↑ port ↑ database

# Test connection
npx prisma db execute --stdin  # Và nhập: SELECT 1;

# Hoặc dùng psql
psql -h localhost -U shopuser -d shopdb
# Nhập password: shoppass
```

### Modules not found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
```

### CORS errors
```
Kiểm tra trong backend/src/app.ts:
- CORS origins có chứa frontend URL không?
- Development mode có enabled không?
```

---

## 🎯 Bước 8: Cấu hình nâng cao (tuỳ chọn)

### 1. Enable VNPAY Payment

```env
# Tạo account tại https://sandbox.vnpayment.vn/
VNPAY_TMN_CODE=your_code
VNPAY_HASH_SECRET=your_hash_secret
VNPAY_RETURN_URL=http://localhost:5173/payment/success
VNPAY_IPN_URL=http://localhost:3000/api/payment/vnpay/ipn
VNPAY_LOCALE=vn  # hoặc en
```

### 2. Enable OAuth (Google/Facebook)

```env
# Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Facebook
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret

OAUTH_REDIRECT_URI=http://localhost:5173/auth/callback
```

### 3. Enable Cluster Mode (Multiple Workers)

```env
ENABLE_CLUSTER_MODE=true
CLUSTER_WORKERS=4  # Số CPU cores
```

---

## 📝 Bước 9: Chuẩn bị Production

### Build Frontend

```bash
cd frontend
npm run build

# Output: dist/ folder (upload lên web server)
```

### Environment Production

**Backend .env.production:**
```env
PORT=3000
NODE_ENV=production
DATABASE_URL=postgresql://shopuser:shoppass@prod-db-host:5432/shopdb
JWT_SECRET=<use-strong-secret>
FRONTEND_URL=https://hnamofficial.id.vn
# ... (các config khác)
```

**Frontend .env.production:**
```env
VITE_API_URL_PROD=https://api.hnamofficial.id.vn/api
VITE_APP_VERSION=1.0.0
```

### Deployment Options

| Option | Chi phí | Độ khó | Khuyên dùng |
|--------|-------|--------|-----------|
| Vercel | Free tier | Rất dễ | Frontend |
| Render | $7/mo | Dễ | Backend + DB |
| Digital Ocean | $5/mo | Trung bình | Full stack |
| AWS | Flexible | Khó | Scale lớn |
| Docker Hub | Free | Trung bình | Container deploy |

---

## 📚 Tệp tham khảo

- [SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md) - Tổng quan hệ thống
- [docs/API.md](./docs/API.md) - API documentation
- [backend/docs/MODULES.md](./backend/docs/MODULES.md) - Module system
- [backend/docs/MIGRATION_GUIDELINES.md](./backend/docs/MIGRATION_GUIDELINES.md) - Database migrations
- [README.md](./README.md) - Project README

---

## 🆘 Support

Nếu gặp vấn đề:

1. **Kiểm tra logs**:
   ```bash
   # Backend: Xem console terminal
   # Frontend: Mở Developer Tools (F12)
   # Database: docker logs ltnwc_postgres
   ```

2. **Kiểm tra tài liệu**:
   - docs/INSTALLATION.md
   - backend/docs/MODULES.md

3. **Reset toàn bộ**:
   ```bash
   # Backend
   cd backend
   npx prisma migrate reset --force
   npx prisma db seed
   npm run dev
   
   # Frontend
   cd frontend
   npm run dev
   ```

---

*Hướng dẫn này cập nhật lần cuối: 2026-05-04*
