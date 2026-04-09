# Công nghệ dự án

## Backend
- Node.js + Express để xây dựng API.
- TypeScript để dễ kiểm soát kiểu dữ liệu và giảm lỗi khi mở rộng.
- Prisma dùng cho migration, truy vấn dữ liệu và quản lý schema.
- JWT dùng cho đăng nhập, xác thực và phân quyền USER/ADMIN.

## Frontend
- React + Vite để phát triển giao diện nhanh, nhẹ và dễ build.
- Ưu tiên chia theo trang và component rõ ràng.
- Frontend gọi API qua một lớp service chung để dễ bảo trì.

## Cơ sở dữ liệu
- PostgreSQL là database chính của dự án.
- Mọi thay đổi bảng và cột phải đi qua migration, không tạo bảng thủ công.
- Seed dữ liệu mẫu để có sẵn tài khoản, danh mục và sản phẩm test.

## Hạ tầng hỗ trợ
- Docker dùng để chạy PostgreSQL và các dịch vụ liên quan.
- Biến môi trường lưu trong file `.env`, không hardcode vào code.
- Log và cấu hình nên tách riêng để dễ chạy local và triển khai sau này.

## Mục tiêu chung
- Dễ phát triển cho nhiều người cùng làm.
- Dễ chạy local trên máy cá nhân.
- Dễ bàn giao, dễ bảo trì và dễ mở rộng về sau.
