# TIẾN ĐỘ - NGUYỄN HOÀI NAM

## Ngày 03/04/2026
| Ngày | Chức năng phụ trách | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- |
| 03/04 | Khởi tạo dự án (Kết nối postgresql từ docker, khởi tạo thư mục dự án bằng cấu trúc mvc) | Hoàn thành | |

## Ngày 08/04/2026
| Ngày | Chức năng phụ trách | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- |
| 08/04 | 1) Fix migration SQLite → PostgreSQL, tạo .env.example, cập nhật quy ước commit<br>2) Cập nhật README với link chính yếu<br>3) Thêm bảng công nghệ sử dụng<br>4) Thêm hướng dẫn cài đặt chi tiết<br>5) Tạo file tiến độ backend cá nhân | Hoàn thành | Database sẵn sàng, docs đầy đủ, quy ước commit rõ ràng |

## Ngày 09/04/2026
| Ngày | Chức năng phụ trách | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- |
| 09/04 | 1) Hoàn thiện khung backend Express + TypeScript (app.ts, index.ts, error middleware)<br>2) Tổ chức kiến trúc backend theo MVC/Service/Repository cho module Auth<br>3) Triển khai đầy đủ Authentication & Authorization (register, login, refresh, logout, forgot/reset password, me, sessions, logout-all)<br>4) Áp dụng JWT access/refresh token, middleware xác thực và RBAC ADMIN/USER<br>5) Chuẩn hóa biến môi trường auth/session và kiểm tra TypeScript compile pass | Hoàn thành | Đã hoàn tất phần 1 Backend Tasks và tích hợp chạy được trên API /api/auth |

---

## TỔNG KẾT

### ✅ Hoàn thành
- Khởi tạo dự án từ 0
  - Cấu hình kết nối PostgreSQL qua Docker
  - Thiết kế cấu trúc thư mục theo mô hình MVC
- Migration SQLite → PostgreSQL
  - Chuyển đổi schema từ SQLite sang PostgreSQL
  - Đưa 9 models database vào production
  - Reset database để đồng bộ với PostgreSQL
- Tạo file .env.example
  - Template biến môi trường an toàn (không lộ credentials)
  - Giúp teammates dễ setup local environment
- Cập nhật quy ước Git & Commit
  - Xóa bắt buộc tạo branch
  - Thiết lập quy ước commit message tiếng Việt
  - Cập nhật file QUY_UOC_DAT_TEN.md & LUU_Y.md
- Cập nhật Documentation
  - Cập nhật README.md với link chính yếu
  - Thêm bảng công nghệ sử dụng (Node.js, Express, PostgreSQL, Prisma, React, Vite, v.v.)
  - Thêm hướng dẫn cài đặt chi tiết (requirement, step-by-step setup, các lệnh hữu ích)
  - Tạo file tiến độ backend cá nhân
- Commit History
  - 4 commits với message rõ ràng theo quy ước tiếng Việt

### ✅ Backend đã làm (chi tiết)
- Thiết lập nền tảng backend
  - Khởi tạo entrypoint server, route mount và middleware xử lý lỗi tập trung
  - Chuẩn hóa config môi trường cho JWT và thời gian sống token
- Triển khai module Authentication & Authorization
  - API đăng ký/đăng nhập người dùng
  - API refresh token, logout, logout-all sessions
  - API quên mật khẩu/đặt lại mật khẩu
  - API lấy thông tin người dùng hiện tại (me)
- Bảo mật và phân quyền
  - JWT access token để xác thực request
  - JWT refresh token để quản lý session
  - RBAC middleware phân quyền ADMIN/USER cho route bảo vệ
- Tổ chức code theo kiến trúc backend
  - Controller: nhận request và trả response
  - Service: xử lý nghiệp vụ auth/session
  - Repository: thao tác dữ liệu user/audit log qua Prisma
  - Middleware: auth, rbac, error handler
