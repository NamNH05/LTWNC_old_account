# 📱 DeComP - Website E-commerce Thời Trang

**Website bán thời trang** với đầy đủ tính năng quản lý sản phẩm, giỏ hàng, thanh toán và quản lý đơn hàng.

---

## ✨ Tính Năng Chính

### 👨‍💼 Admin Dashboard
- **Quản lý sản phẩm**: Thêm, sửa, xóa, tìm kiếm sản phẩm
- **Quản lý danh mục**: Quản lý các danh mục (Nam, Nữ, Giày, Phụ kiện)
- **Quản lý người dùng**: Xem danh sách user, quản lý vai trò, trạng thái
- **Quản lý đơn hàng**: Xem danh sách đơn, cập nhật trạng thái (Pending → Processing → Shipped → Delivered)
- **Báo cáo doanh thu**: Tổng doanh thu, tổng đơn hàng, giá trị trung bình, doanh thu theo ngày
- **Quản lý thanh toán**: Xem lịch sử thanh toán, xác nhận giao dịch VNPAY
- **Nhật ký hoạt động**: Audit log tất cả thay đổi trong hệ thống

### 👤 User Features
- **Trang chủ**: Banner, danh sách sản phẩm nổi bật
- **Duyệt sản phẩm**: 
  - Danh sách sản phẩm theo danh mục
  - Tìm kiếm sản phẩm
  - Lọc theo giá, đánh giá
  - Sắp xếp theo tên, giá, mới nhất
- **Chi tiết sản phẩm**: Xem thông tin, ảnh, đánh giá, bình luận
- **Giỏ hàng**: Thêm/xóa sản phẩm, cập nhật số lượng, xem tổng cộng
- **Thanh toán (3 bước)**:
  - Step 1: Chọn địa chỉ giao hàng
  - Step 2: Chọn phương thức thanh toán (COD / VNPAY)
  - Step 3: Xác nhận và tạo đơn hàng
- **Đơn hàng của tôi**: Xem lịch sử đơn hàng, trạng thái, chi tiết
- **Tài khoản cá nhân**:
  - Sửa thông tin hồ sơ
  - Quản lý địa chỉ giao hàng
  - Đổi mật khẩu
- **Xác thực**: Đăng ký, đăng nhập, đăng xuất, quên mật khẩu

---

## 🏗️ Kiến Trúc Dự Án

### Backend (Node.js + Express + TypeScript)
**Mô hình MVC Monolith:**
- **Controller**: Nhận request, trả response
- **Service**: Xử lý logic nghiệp vụ
- **Repository**: Truy cập dữ liệu từ database
- **DTO**: Định dạng request/response
- **Model**: Mô hình dữ liệu với Prisma ORM

### Frontend (React + Vite)
- **Pages**: Home, Products, ProductDetail, Cart, Checkout, Orders, Profile
- **Components**: Header, Footer, ProductCard, CartItem, OrderList, v.v.
- **Context API**: Quản lý state (AuthContext, CartContext)
- **Routing**: React Router v7

### Database (PostgreSQL)
**9 bảng chính:**
- `users` - Người dùng
- `addresses` - Địa chỉ giao hàng
- `categories` - Danh mục sản phẩm
- `products` - Sản phẩm
- `carts` - Giỏ hàng
- `orders` - Đơn hàng
- `order_items` - Chi tiết đơn hàng
- `payments` - Thanh toán
- `audit_logs` - Nhật ký hoạt động

---

## 📋 Quy Trình Phát Triển

### Phase 1: Setup & Migration ✅ (Hoàn tất)
- [x] Khởi tạo cấu trúc dự án (MVC Backend + React Frontend)
- [x] Cấu hình PostgreSQL với Docker
- [x] Thiết kế database schema (9 bảng)
- [x] Setup migrations & seed data
- [x] Cập nhật quy ước Git & commit

### Phase 2: Backend Development 🔄 (Đang làm)
- [ ] Authentication & Authorization (JWT + Role-based)
- [ ] User Management APIs
- [ ] Product Management APIs
- [ ] Cart & Checkout APIs
- [ ] Order Management APIs
- [ ] Payment Integration (VNPAY)
- [ ] Error Handling & Validation
- [ ] Logging & Monitoring

### Phase 3: Frontend Development 🔄 (Đang làm)
- [ ] Authentication Pages (Login, Register, Profile)
- [ ] Product Listing & Search
- [ ] Product Detail
- [ ] Shopping Cart
- [ ] Checkout Flow
- [ ] Order Tracking
- [ ] Admin Dashboard
- [ ] Responsive Design

### Phase 4: Testing & Deployment ⏳ (Chuẩn bị)
- [ ] Unit Tests (Backend & Frontend)
- [ ] Integration Tests
- [ ] E2E Tests
- [ ] Performance Testing
- [ ] Security Testing
- [ ] Deployment (Docker + Production)

---

## 🎯 API MVP (Minimum Viable Product)

### Auth APIs
```
POST   /api/auth/register      - Đăng ký
POST   /api/auth/login         - Đăng nhập
POST   /api/auth/logout        - Đăng xuất
POST   /api/auth/refresh       - Làm mới token
```

### Product APIs
```
GET    /api/products           - Danh sách sản phẩm
GET    /api/products/:id       - Chi tiết sản phẩm
GET    /api/categories         - Danh sách danh mục
```

### Cart APIs
```
GET    /api/carts              - Xem giỏ hàng
POST   /api/carts              - Thêm vào giỏ
PUT    /api/carts/:id          - Cập nhật số lượng
DELETE /api/carts/:id          - Xóa khỏi giỏ
```

### Order APIs
```
POST   /api/orders             - Tạo đơn hàng
GET    /api/orders             - Danh sách đơn hàng của user
GET    /api/orders/:id         - Chi tiết đơn hàng
PUT    /api/orders/:id         - Cập nhật trạng thái (Admin)
```

### Payment APIs
```
POST   /api/payments/vnpay     - Thanh toán VNPAY
GET    /api/payments/vnpay-callback - Callback từ VNPAY
```

---

## 📊 Metrics & Goals

- **Code Coverage**: Backend 80%+, Frontend 70%+
- **Performance**: API response < 200ms, Frontend load < 3s
- **Security**: JWT + HTTPS, SQL injection prevention, XSS protection
- **Scalability**: Ready for horizontal scaling, load balancing ready
Có quyết định công nghệ backend, database, frontend.

B2. Cài Docker và chạy PostgreSQL
Cài Docker Desktop.
Tạo cấu hình chạy PostgreSQL bằng Docker Compose.
Khai báo biến môi trường database (db name, user, password, port).
Bật volume để giữ dữ liệu bền vững.
Kiểm tra kết nối PostgreSQL từ backend.
Chạy migration khởi tạo schema.

Kết quả cần đạt B2:
PostgreSQL chạy ổn định trong Docker.
Backend kết nối thành công.
Schema được tạo thành công qua migration.

B3. Bắt đầu xây dựng các service + frontend
Xây backend theo thứ tự ưu tiên:
Auth/User: đăng ký, đăng nhập, profile, địa chỉ.
Product: danh sách, tìm kiếm, chi tiết.
Cart/Checkout: giỏ hàng, thanh toán 3 bước.
Order: tạo đơn, lịch sử đơn.
Admin: CRUD sản phẩm, người dùng, đơn hàng.
Report: tổng doanh thu, tổng đơn, giá trị trung bình, doanh thu theo ngày.
Audit: log hành động theo user, loại, entity.
Xây frontend theo luồng nghiệp vụ:
Trang chủ.
Danh sách sản phẩm theo danh mục.
Tìm kiếm sản phẩm.
Chi tiết sản phẩm.
Giỏ hàng.
Checkout 3 bước.
Profile người dùng, lịch sử đơn.
Dashboard admin.
Build frontend:
Chạy dev để phát triển.
Build production để kiểm tra bản deploy.

Kết quả cần đạt B3:
Service backend hoạt động theo module.
Frontend gọi API thành công.
Bản build production frontend thành công.

B4. Test
Test chức năng:
Auth flow.
Product flow.
Cart, checkout, order flow.
Admin CRUD và report.
Audit log filter.
Test phân quyền:
USER không vào route admin.
USER không thao tác tài nguyên của user khác.
ADMIN truy cập đầy đủ khu vực quản trị.
Test tích hợp:
Frontend kết nối backend ổn định.
Backend kết nối PostgreSQL ổn định trong Docker.
Test lỗi và an toàn:
Validate input đúng.
Trả mã lỗi phù hợp.
Không lộ thông tin nhạy cảm trong lỗi.
Hành động nhạy cảm có audit log.

Kết quả cần đạt B4:
Pass các luồng chính end-to-end.
Phân quyền hoạt động đúng.
Sẵn sàng demo và triển khai môi trường tiếp theo.

