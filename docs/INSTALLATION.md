# Hướng dẫn cài đặt chi tiết

## Yêu cầu hệ thống

- Node.js >= 18.0.0
- npm >= 9.0.0 hoặc yarn >= 3.0.0
- PostgreSQL >= 14
- Git

Kiểm tra phiên bản:

```bash
node --version
npm --version
postgres --version
```

## Cài đặt trên Windows

### 1. Clone Repository

```bash
git clone https://github.com/your-username/ltwnc-shop.git
cd ltwnc-shop
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

### 3. Cấu hình Environment

```bash
cp .env.example .env
```

Sửa `.env` với thông tin PostgreSQL của bạn:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/ltwnc_shop
JWT_SECRET=your_very_secret_key_here
```

### 4. Thiết lập Database

```bash
npx prisma migrate dev
npx prisma db seed
```

### 5. Cài đặt Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
```

### 6. Chạy Development Server

Mở 2 terminal:

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

Hoặc dùng script:
```bash
./start-dev.bat
```

## Cài đặt trên Linux/Mac

### 1-3: Giống Windows

### 4. Thiết lập Database

```bash
npx prisma migrate dev
npx prisma db seed
```

### 5-6: Giống Windows

## Cài đặt Database

### PostgreSQL cục bộ

1. Tải PostgreSQL từ https://www.postgresql.org/download/
2. Cài đặt với mật khẩu
3. Tạo database:

```bash
createdb ltwnc_shop -U postgres
```

### Hoặc dùng Docker

```bash
docker run --name ltwnc-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=ltwnc_shop \
  -p 5432:5432 \
  -d postgres:15
```

## Sử dụng Docker Compose

Cách nhanh nhất:

```bash
cd ltwnc-shop
docker-compose up -d
```

Điều này khởi động:
- PostgreSQL database
- Backend API
- Frontend web server

Truy cập: http://localhost:5173

## Xác minh cài đặt

### Backend

```bash
cd backend
npm run dev
```

Khi thấy:
```
Server running on http://localhost:3000
```

Mở http://localhost:3000/api/health

### Frontend

```bash
cd frontend
npm run dev
```

Khi thấy:
```
VITE v8.0.1 ready in XXX ms

➜  Local:   http://localhost:5173/
```

Mở http://localhost:5173

## Troubleshooting

### Port đã được sử dụng

```bash
# Tìm process sử dụng port 3000
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Database connection error

Kiểm tra:
1. PostgreSQL chạy chưa: `psql -U postgres`
2. DATABASE_URL đúng chưa
3. Database tồn tại chưa: `\l` trong psql

### npm install lỗi

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Prisma migration lỗi

```bash
npx prisma migrate reset
```

Cảnh báo: Lệnh này xóa tất cả dữ liệu!

## Cấu hình tiên tiến

### Environment Variables chi tiết

Xem [backend/.env.example](../ltwnc-shop/backend/.env.example)

Biến quan trọng:
- `JWT_SECRET`: Phải đặt giá trị mạnh trong production
- `DATABASE_URL`: Connection string PostgreSQL
- `VNPAY_*`: Cấu hình thanh toán VNPAY

### Seed database

```bash
npx prisma db seed
```

Tạo dữ liệu mẫu cho phát triển

## Production Deployment

Chi tiết trong tài liệu DEPLOYMENT (sắp tới)

## Hỗ trợ

Gặp vấn đề? Mở GitHub Issue
