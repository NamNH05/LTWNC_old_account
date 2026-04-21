# 🔧 Nhiệm vụ Backend

## Danh sách công việc cần hoàn tất cho Backend

### 1. Xác thực và phân quyền
- [x] Xây dựng API login/register
- [x] Tích hợp đăng nhập OAuth Google/Facebook
- [x] Triển khai kiểm tra JWT token
- [x] Thiết lập phân quyền theo vai trò (RBAC)
- [x] Chức năng đặt lại mật khẩu
- [x] Quản lý phiên đăng nhập

### 2. Quản lý người dùng
- [x] Tạo API hồ sơ người dùng (GET /api/users/profile)
- [x] Cập nhật thông tin người dùng (PUT /api/users/profile)
- [x] Xóa tài khoản người dùng (soft delete)
- [x] Quản lý danh sách người dùng (admin) (GET /api/users)
- [x] Theo dõi hoạt động người dùng (AuditLog repository)

### 3. Quản lý sản phẩm
- [x] CRUD sản phẩm (POST/GET/PUT/DELETE /api/products)
- [x] Tìm kiếm và lọc sản phẩm (search, filter by category, sort)
- [x] Quản lý danh mục sản phẩm (GET /api/products/categories)
- [ ] Xử lý hình ảnh sản phẩm (field có, chưa upload)
- [x] Theo dõi tồn kho sản phẩm (stock field, validation)

### 4. Giỏ hàng và xử lý đơn hàng
- [x] Chức năng giỏ hàng (GET/POST/PUT/DELETE /api/cart)
- [x] Thêm/xóa sản phẩm khỏi giỏ (auto-create cart, auto-increase qty)
- [x] Quy trình checkout giỏ hàng (POST /api/orders/checkout)
- [x] Tạo và quản lý đơn hàng (GET /api/orders/my, GET /api/orders/:orderId, GET /api/orders)
- [x] Theo dõi trạng thái đơn hàng (PATCH /api/orders/:orderId/status, PATCH /api/orders/:orderId/cancel)

### 5. Tích hợp thanh toán
- [x] Tích hợp cổng thanh toán VNPAY
- [x] Quản lý trạng thái thanh toán
- [x] Ghi log giao dịch

### 6. Xử lý lỗi và kiểm tra dữ liệu
- [x] Middleware kiểm tra dữ liệu đầu vào (validation in controllers)
- [x] Xử lý lỗi tập trung (error middleware)
- [x] Chuẩn hóa response API (buildErrorResponse)
- [x] Ghi log request

### 7. Hạ tầng và API Gateway
- [x] Thiết lập API Gateway
- [x] Giới hạn tần suất truy cập (rate limit)
- [x] Điều hướng request
- [x] Cân bằng tải
- [x] Giám sát và ghi log

### 8. Bảo mật
- [x] Cấu hình CORS
- [x] Chống SQL injection (Prisma parameterized queries)
- [ ] Bảo vệ XSS (frontend concern)
- [ ] Tối ưu API và caching (chưa làm)

### 9. Kiểm thử và tài liệu
- [ ] Unit test (độ phủ 80%+)
- [ ] Integration test cho các API endpoint
- [ ] Tài liệu API (Swagger/OpenAPI)
- [ ] Kiểm thử các kịch bản lỗi
- [ ] Xem: [Testing Guidelines](Testing_Guidelines.md#-backend-testing)

### 10. Nâng cao
- [ ] Tích hợp gửi email thật cho quên mật khẩu (SMTP/Resend/SendGrid)
- [ ] Lưu reset token/session vào Redis hoặc Database (không dùng memory ở production)
- [ ] Bổ sung rate limiting cho auth endpoints (login/forgot/reset)
- [ ] Thiết kế email template chuẩn HTML cho auth notifications
- [ ] Theo dõi/audit nâng cao cho sự kiện bảo mật (failed login, reset attempts)
