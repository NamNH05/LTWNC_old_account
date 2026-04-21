# Hướng Dẫn Chạy Dự Án Trên Máy Dev Mới

Tài liệu này hướng dẫn cách cài đặt và chạy toàn bộ project `ltwnc-shop` trên một máy dev khác từ đầu.

## 1. Yêu cầu trước khi chạy

- Node.js 18+.
- Docker Desktop và Docker Compose.
- Git.

## 2. Lấy source code

```bash
git clone <repository-url>
cd ltwnc-shop
```

## 3. Khởi động database

Database dùng PostgreSQL trong Docker. Cấu hình sẵn nằm ở [infra/docker-compose.yml](infra/docker-compose.yml).

```bash
cd infra
docker-compose up -d
docker ps
```

Database mặc định:

- Host: `localhost`
- Port: `5432`
- Database: `shopdb`
- User: `shopuser`
- Password: `shoppass`

## 4. Cấu hình backend

### 4.1 Tạo file `.env`

Copy file mẫu rồi điền giá trị thật:

```bash
cd ../backend
copy .env.example .env
```

Nội dung tối thiểu cần có:

- `DATABASE_URL`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `FACEBOOK_CLIENT_ID`
- `FACEBOOK_CLIENT_SECRET`
- `OAUTH_REDIRECT_URI=http://localhost:5173/auth/callback`

### 4.2 Cài dependencies và chạy migration/seed

```bash
npm install
npx prisma migrate deploy
npm run seed
```

### 4.3 Chạy backend

```bash
npm run dev
```

Backend chạy tại:

- `http://localhost:8080`

## 5. Cấu hình frontend

### 5.1 Tạo file `.env`

Copy file mẫu rồi điền client ID:

```bash
cd ../frontend
copy .env.example .env
```

Nội dung cần có:

- `VITE_GOOGLE_CLIENT_ID`
- `VITE_FACEBOOK_CLIENT_ID`

### 5.2 Cài dependencies và chạy frontend

```bash
npm install
npm run dev
```

Frontend chạy tại:

- `http://localhost:5173`

## 6. Cấu hình OAuth trên Google/Facebook

Khi tạo app OAuth trên Google/Facebook Developer Console, cần khai báo đúng redirect URI:

- `http://localhost:5173/auth/callback`

Nếu chạy trên domain khác, thay lại redirect URI tương ứng ở cả:

- file `.env` của backend
- cấu hình app OAuth trên Google/Facebook

## 7. Tài khoản test sau khi seed

Sau khi seed xong có thể dùng các tài khoản sau:

- Admin: `admin@ltwnc.tech` / `Admin@123`
- User: `user@ltwnc.tech` / `User@123`

## 8. Kiểm tra chạy thành công

1. PostgreSQL container đang chạy: `docker ps`
2. Backend trả response tại `http://localhost:8080`
3. Frontend mở được tại `http://localhost:5173`
4. Đăng nhập thường hoạt động.
5. Đăng nhập Google/Facebook chuyển qua callback và tạo/đăng nhập user thành công.

## 9. Lưu ý khi gửi cho dev khác

- Không gửi file `.env` thật lên git.
- Chỉ commit các file mẫu `.env.example`.
- Dev khác chỉ cần copy `.env.example` sang `.env` rồi điền giá trị riêng của họ.
