# 🔧 Nhiệm vụ Backend

## Danh sách công việc cần hoàn tất cho Backend

### 1. Xác thực và phân quyền
- [x] Xây dựng API login/register
- [x] Triển khai kiểm tra JWT token
- [x] Thiết lập phân quyền theo vai trò (RBAC)
- [x] Chức năng đặt lại mật khẩu
- [x] Quản lý phiên đăng nhập

### 2. Quản lý người dùng
- [ ] Tạo API hồ sơ người dùng
- [ ] Cập nhật thông tin người dùng
- [ ] Xóa tài khoản người dùng
- [ ] Quản lý danh sách người dùng (admin)
- [ ] Theo dõi hoạt động người dùng

### 3. Quản lý sản phẩm
- [ ] CRUD sản phẩm
- [ ] Tìm kiếm và lọc sản phẩm
- [ ] Quản lý danh mục sản phẩm
- [ ] Xử lý hình ảnh sản phẩm
- [ ] Theo dõi tồn kho sản phẩm

### 4. Giỏ hàng và xử lý đơn hàng
- [ ] Chức năng giỏ hàng
- [ ] Thêm/xóa sản phẩm khỏi giỏ
- [ ] Quy trình checkout giỏ hàng
- [ ] Tạo và quản lý đơn hàng
- [ ] Theo dõi trạng thái đơn hàng

### 5. Tích hợp thanh toán
- [ ] Tích hợp cổng thanh toán VNPAY
- [ ] Quản lý trạng thái thanh toán
- [ ] Ghi log giao dịch
- [ ] Xử lý hoàn tiền

### 6. Xử lý lỗi và kiểm tra dữ liệu
- [ ] Middleware kiểm tra dữ liệu đầu vào
- [x] Xử lý lỗi tập trung
- [ ] Chuẩn hóa response API
- [ ] Ghi log request

### 7. Hạ tầng và API Gateway
- [ ] Thiết lập API Gateway
- [ ] Giới hạn tần suất truy cập (rate limit)
- [ ] Điều hướng request
- [ ] Cân bằng tải
- [ ] Giám sát và ghi log

### 8. Bảo mật
- [x] Cấu hình CORS
- [ ] Chống SQL injection
- [ ] Bảo vệ XSS
- [ ] Tối ưu API và caching

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
