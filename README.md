# LTWNC Shop

Nền tảng thương mại điện tử toàn diện với quản lý sản phẩm, thanh toán VNPAY, và hệ thống module linh hoạt.

## Tính năng chính

- Quản lý sản phẩm và danh mục
- Hệ thống đặt hàng và thanh toán VNPAY
- Quản lý người dùng và quyền hạn (RBAC)
- Hệ thống module có thể bật/tắt
- OAuth2 (Google, Facebook)
- Hệ thống địa chỉ giao hàng
- Quản lý kho hàng
- Báo cáo và thống kê

## Công nghệ sử dụng

**Backend:**
- Node.js / Express.js
- TypeScript
- Prisma ORM
- PostgreSQL

**Frontend:**
- React 19
- Vite
- Ant Design
- React Router

**Infrastructure:**
- Docker & Docker Compose
- PostgreSQL

## Cài đặt nhanh

### Yêu cầu

- Node.js >= 18
- PostgreSQL >= 14
- Docker & Docker Compose (tùy chọn)

### Bước 1: Clone repository

```bash
git clone https://github.com/your-username/ltwnc-shop.git
cd ltwnc-shop
```

### Bước 2: Cài đặt Backend

```bash
cd backend
cp .env.example .env
npm install
```

Cập nhật `.env` với thông tin PostgreSQL của bạn.

### Bước 3: Cài đặt Database

```bash
npx prisma migrate dev
npx prisma db seed
```

### Bước 4: Cài đặt Frontend

```bash
cd ../frontend
cp .env.example .env
npm install
```

### Bước 5: Chạy ứng dụng

Từ thư mục root:

```bash
./start-dev.bat  # Windows
# hoặc
bash start-dev.bat  # Linux/Mac
```

Backend chạy tại: http://localhost:3000
Frontend chạy tại: http://localhost:5173

## Dùng Docker

```bash
docker-compose up -d
```

## Cấu trúc dự án

```
ltwnc-shop/
├── backend/          # API Server (Express.js)
├── frontend/         # Web Application (React)
├── infra/            # Docker configuration
├── docs/             # Documentation
└── scripts/          # Utility scripts
```

Xem [INSTALLATION.md](./docs/INSTALLATION.md) để biết chi tiết cài đặt.

Xem [ARCHITECTURE.md](./docs/ARCHITECTURE.md) để hiểu cấu trúc dự án.

## Đóng góp

Chúng tôi chào đón mọi đóng góp! Vui lòng đọc [CONTRIBUTING.md](./CONTRIBUTING.md) để biết quy trình.

## License

MIT License - xem [LICENSE](./LICENSE) để biết chi tiết.

## Liên hệ

- Tác giả: Nam Nguyễn
- Email: contact@ltwnc.com
- Issues: GitHub Issues

## Tài liệu

- [Hướng dẫn cài đặt](./docs/INSTALLATION.md)
- [Kiến trúc hệ thống](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API.md)
- [Hướng dẫn đóng góp](./CONTRIBUTING.md)
