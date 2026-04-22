# 🚀 Hướng Dẫn Khởi Động Dự Án LTWNC Shop

## 📋 Yêu Cầu Hệ Thống

- **Node.js**: v14 trở lên ([Tải tại đây](https://nodejs.org/))
- **PostgreSQL**: Chạy trên `localhost:5432` (hoặc cập nhật `.env`)
- **Git** (tùy chọn)

## 📁 File Khởi Động

### 1. **setup.bat** - Chuẩn Bị Ban Đầu
Chạy file này **lần đầu tiên** để:
- ✅ Cài đặt dependencies (Backend + Frontend)
- ✅ Chạy database migration
- ✅ Seed dữ liệu ban đầu

```bash
# Chạy bằng cách double-click hoặc:
setup.bat
```

### 2. **start-dev.bat** - Khởi Động Dev Server
Chạy file này để **khởi động dự án** hàng ngày:
- ✅ Mở Backend trên `http://localhost:8080`
- ✅ Mở Frontend trên `http://localhost:5173` (hoặc 5174)
- ✅ Tự động mở trong các cửa sổ terminal riêng

```bash
# Chạy bằng cách double-click hoặc:
start-dev.bat
```

## 🔧 Cấu Hình Môi Trường

### Backend (.env)
Tệp `backend/.env` phải chứa:
```env
DATABASE_URL="postgresql://shopuser:shoppass@localhost:5432/shopdb"
PORT=8080
JWT_SECRET=your_secret_key

# VNPAY Config
VNPAY_TMN_CODE=Y9IND6JX
VNPAY_HASH_SECRET=S9JIYF185TLIGR0ZATMS6W00P7MW7DPG
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:8080/api/payments/vnpay/return
VNPAY_IPN_URL=http://localhost:8080/api/payments/vnpay/ipn
VNPAY_LOCALE=vn
```

### Frontend (Tự động)
Frontend sẽ tự động kết nối Backend tại `http://localhost:8080`

## 📝 Quy Trình Khởi Động Lần Đầu

1. **Chuẩn bị Database**
   - Chắc chắn PostgreSQL đang chạy
   - Tạo database: `shopdb`
   - User: `shopuser` / Password: `shoppass`

2. **Chạy setup.bat**
   ```
   setup.bat
   ```
   - Chờ cho đến khi cài đặt xong

3. **Chạy start-dev.bat**
   ```
   start-dev.bat
   ```
   - Mở 2 cửa sổ terminal (Backend + Frontend)
   - Chờ khoảng 10 giây cho cả 2 khởi động

4. **Truy cập ứng dụng**
   - Frontend: http://localhost:5173
   - API Docs: http://localhost:8080/api/docs (nếu có)

## 🛑 Dừng Ứng Dụng

Để dừng ứng dụng, đóng cửa sổ terminal hoặc nhấn `Ctrl+C` trong mỗi cửa sổ.

## 🔍 Gỡi Rối

### Backend không khởi động
```bash
cd backend
npm install
npm run dev
```

### Frontend không khởi động
```bash
cd frontend
npm install
npm run dev
```

### Lỗi Database Connection
Kiểm tra `.env` file:
- `DATABASE_URL` đúng không?
- PostgreSQL có đang chạy không?
- Port 5432 có bị block không?

### Port đang được sử dụng
Thay đổi port trong `.env`:
```env
PORT=8081  # Backend
# hoặc
VITE_PORT=5174  # Frontend
```

## 📚 Lệnh Hữu Ích

```bash
# Backend
cd backend
npm run dev      # Chạy development server
npm run build    # Build for production
npm run seed     # Seed dữ liệu

# Frontend
cd frontend
npm run dev      # Chạy development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## ✅ Kiểm Tra Hoạt Động

1. **Backend**: Truy cập http://localhost:8080
   - Nếu thấy trang hoặc API response → ✅ Backend OK

2. **Frontend**: Truy cập http://localhost:5173
   - Nếu thấy trang chủ → ✅ Frontend OK

3. **Database**: Kiểm tra trong backend logs
   - Nếu không có lỗi connection → ✅ Database OK

---

**Ghi chú**: Batch files này chỉ hoạt động trên Windows. Trên macOS/Linux, sử dụng các lệnh npm trực tiếp hoặc tạo `.sh` script.
