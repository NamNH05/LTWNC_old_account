# 🗄️ Nhiệm vụ Database và Migration

## Danh sách công việc cần hoàn tất cho Database và Seed

### 1. Tinh chỉnh schema cơ sở dữ liệu
- [x] Thêm index còn thiếu để tối ưu truy vấn
- [x] Thiết lập ràng buộc và kiểm tra dữ liệu phù hợp
- [x] Thêm trường tính toán (nếu cần)
- [x] Tối ưu quan hệ giữa các bảng
- [ ] Thêm database trigger (nếu cần)

### 2. Quản lý migration
- [x] Review và test toàn bộ migration
- [x] Ghi tài liệu lịch sử migration
- [x] Thiết lập chiến lược backup tự động
- [x] Kiểm thử quy trình rollback
- [x] Tạo mẫu migration

### 3. Seed Data
- [x] Tạo seed cho tài khoản admin
- [x] Seed danh mục mẫu
- [x] Seed sản phẩm mẫu (20-30 sản phẩm)
- [x] Seed tài khoản test (5-10 tài khoản)
- [x] Seed dữ liệu địa chỉ mẫu
- [x] Seed phương thức thanh toán

### 4. Toàn vẹn dữ liệu
- [x] Thiết lập ràng buộc khóa ngoại
- [x] Thêm quy tắc cascade delete
- [x] Thiết lập ràng buộc unique
- [x] Thêm giá trị mặc định
- [x] Triển khai soft delete (nếu cần)

### 5. Tối ưu hiệu năng
- [x] Thêm index cơ sở dữ liệu
- [x] Tối ưu truy vấn JOIN
- [x] Thiết lập chiến lược cache truy vấn
- [x] Theo dõi truy vấn chậm
- [x] Tạo view cho truy vấn phức tạp

### 6. Audit và ghi log
- [ ] Thiết lập bảng audit log
- [ ] Ghi log toàn bộ thao tác CRUD
- [ ] Theo dõi hoạt động người dùng
- [ ] Triển khai log rotation
- [ ] Tạo báo cáo audit

### 7. Kiểm thử và xác thực
- [ ] Kiểm thử tính nhất quán dữ liệu
- [ ] Xác thực độ đầy đủ của seed data
- [ ] Kiểm tra tính toàn vẹn quan hệ dữ liệu
- [ ] Kiểm thử hiệu năng
- [ ] Kiểm thử xác thực migration và seed
- [ ] Xem: [Testing Guidelines](Testing_Guidelines.md#-database--seed-testing)

### 8. Tài liệu
- [ ] Viết tài liệu thiết kế schema
- [ ] Viết hướng dẫn migration
- [ ] Tạo tài liệu seed data
- [ ] Ghi tài liệu quy trình backup
- [ ] Tạo kế hoạch khôi phục thảm họa
