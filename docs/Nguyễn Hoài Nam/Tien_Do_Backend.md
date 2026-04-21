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
| 09/04 | 1) Hoàn thiện khung backend Express + TypeScript (app.ts, index.ts, error middleware)<br>2) Tổ chức kiến trúc backend theo MVC/Service/Repository cho module Auth<br>3) Triển khai đầy đủ Authentication & Authorization (register, login, refresh, logout, forgot/reset password, me, sessions, logout-all)<br>4) Áp dụng JWT access/refresh token, middleware xác thực và RBAC ADMIN/USER<br>5) Nâng cấp middleware xử lý lỗi: chuẩn hóa response, thêm 404, bắt lỗi JSON sai và lỗi Prisma<br>6) Chuẩn hóa biến môi trường auth/session và kiểm tra TypeScript compile pass | Hoàn thành | Đã hoàn tất phần 1 Backend Tasks, tích hợp chạy được trên API /api/auth và dễ test lỗi hơn |

## Ngày 10/04/2026
| Ngày | Chức năng phụ trách | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- |
| 10/04 | 1) Xây dựng User Management Module: API get/update profile, list users (admin), grant/revoke admin role, soft delete user<br>2) Xây dựng Product Management Module: API CRUD products, search/filter/sort, list categories, auto-generate slug<br>3) Xây dựng Cart Management Module: API get/add/update/remove cart items, auto-create cart, validate stock<br>4) Setup routes cho user/product/cart APIs và mount vào app.ts<br>5) Fix TypeScript strict mode errors: cast params, handle undefined/null Prisma fields<br>6) Validate tất cả code compile pass, tất cả 7 files type-safe (controllers, services, routes)<br>7) Hoàn thành phần 4 Backend: xây dựng Order Management Module (checkout, danh sách đơn, chi tiết đơn, hủy đơn, admin cập nhật trạng thái) và mount route /api/orders<br>8) Bổ sung transaction checkout + trừ/hoàn tồn kho + ghi audit log cho đơn hàng | Hoàn thành | Hoàn tất phần 2 và phần 4 Backend, API đơn hàng sẵn sàng tích hợp frontend |

## Ngày 12/04/2026
| Ngày | Chức năng phụ trách | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- |
| 12/04 | 1) Triển khai lớp API Gateway nội bộ tại prefix /api và gom route điều hướng tập trung (auth/users/products/cart/orders)<br>2) Bổ sung middleware request context + request logger dạng JSON (kèm requestId, latency, ip)<br>3) Bổ sung endpoint giám sát /api/gateway/health và /api/gateway/metrics<br>4) Triển khai rate limiter in-memory với header X-RateLimit-* cho toàn bộ API<br>5) Bổ sung cơ chế cân bằng tải bằng cluster mode (tự fork worker và tự khởi động lại worker khi crash)<br>6) Chuẩn hóa biến môi trường mới cho gateway/rate-limit/cluster và xác nhận TypeScript compile pass | Hoàn thành | Hoàn tất phần 7 Backend Tasks, sẵn sàng cho bước tích hợp API Gateway ở tầng infra/reverse proxy |

## Ngày 20/04/2026
| Ngày | Chức năng phụ trách | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- |
| 20/04 | 1) Bổ sung model Payment trong Prisma schema và thêm migration mở rộng cột phục vụ VNPAY (bank_code, response_code, paid_at, gateway_payload)<br>2) Refactor payment service sang Prisma model (thay raw query chính), triển khai create payment URL VNPAY và xử lý callback/IPN có verify chữ ký + idempotency<br>3) Đồng bộ trạng thái thanh toán với đơn hàng (PAID -> CONFIRMED nếu order đang PENDING) và ghi audit log payment success/failed<br>4) Cập nhật controller payment để validate kiểu dữ liệu chặt hơn, xử lý client IP an toàn hơn<br>5) Chạy `prisma generate` + `tsc --noEmit` xác nhận compile pass<br>6) Chuẩn hóa tài liệu hướng dẫn report/tick cập nhật tiến độ cho từng phần tại docs/reports/README.md | Đang làm | Còn thiếu hôm nay: [ ] chạy migration trên DB thật/deploy, [ ] test luồng VNPAY sandbox (create-url/return/IPN), [ ] hoàn thiện refund flow, [ ] cập nhật API docs payment |

## Ngày 21/04/2026
| Ngày | Chức năng phụ trách | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- |
| 21/04 | 1) Tích hợp OAuth backend cho Google/Facebook: thêm endpoint `POST /api/auth/oauth/google` và `POST /api/auth/oauth/facebook`<br>2) Xử lý exchange authorization code lấy profile từ provider, chuẩn hóa email, auto tạo user mới nếu chưa tồn tại rồi cấp access/refresh token theo luồng JWT hiện có<br>3) Bổ sung cấu hình OAuth vào `env.ts` và cập nhật `backend/.env.example` (GOOGLE/FACEBOOK client + redirect URI)<br>4) Cập nhật checklist backend/frontend tasks theo trạng thái thực tế OAuth/login<br>5) Viết tài liệu chạy dự án trên máy dev mới tại `ltwnc-shop/DEV_SETUP.md` và cập nhật link ở README | Hoàn thành | Đã kiểm tra compile backend (`npx tsc --noEmit`) pass; luồng OAuth cần cấu hình đúng redirect URI trên Google/Facebook console để chạy E2E |

---

## TỔNG KẾT

### ✅ Hoàn thành (cập nhật 12/04)
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

- Hoàn thành Part 7 Backend (Hạ tầng & API Gateway)
  - Thiết lập lớp API Gateway và điều hướng request tập trung
  - Thêm request logging, gateway metrics/health
  - Thêm rate limit toàn cục cho API
  - Bật chế độ cluster để cân bằng tải theo worker

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
- Xử lý lỗi và kiểm thử
  - Chuẩn hóa response lỗi theo status/code/message/details
  - Bắt lỗi route không tồn tại (404)
  - Bắt lỗi JSON sai định dạng và một số lỗi Prisma phổ biến
- Tổ chức code theo kiến trúc backend
  - Controller: nhận request và trả response
  - Service: xử lý nghiệp vụ auth/session
  - Repository: thao tác dữ liệu user/audit log qua Prisma
  - Middleware: auth, rbac, error handler

### ✅ Phần 2 Backend (10/04) - User/Product/Cart Management
- Triển khai User Management Module
  - API lấy/cập nhật thông tin profile (fullName, phone)
  - API liệt kê người dùng (admin, hỗ trợ pagination/filter role)
  - API xóa user (soft delete), cấp/thu hồi quyền admin
  - Xử lý lỗi: validation, ownership, authorization

- Triển khai Product Management Module
  - API CRUD (Create/Read/Update/Delete) sản phẩm toàn bộ
  - API tìm kiếm sản phẩm: search by name/desc, filter by category, sort (latest, price, popular)
  - API lấy danh sách danh mục với count số sản phẩm
  - Auto-generate slug từ product name
  - Kiểm tra danh mục tồn tại trước khi tạo/update product

- Triển khai Cart Management Module
  - API lấy giỏ hàng (auto-create nếu chưa có)
  - API thêm sản phẩm vào giỏ (auto-increase quantity nếu đã tồn tại)
  - API cập nhật số lượng và xóa item khỏi giỏ
  - API xóa tất cả items (clear cart)
  - Kiểm tra stock sản phẩm, validation ownership of cart
  - Tính tổng giá trị giỏ hàng

- TypeScript & Type Safety
  - Xử lý type cast cho req.params (Express type incompatibility)
  - Xử lý undefined vs null Prisma fields (exactOptionalPropertyTypes)
  - Tất cả 7 files (3 controllers, 3 services, 3 routes) compile pass strict mode
  - Zero TypeScript errors

### 📊 API Status (ngày 12/04)
**Part 1 (Auth) - COMPLETED ✅**
- 9 endpoints: register, login, refresh, logout, logoutAll, forgotPassword, resetPassword, me, sessions
- Full JWT token lifecycle + session management

**Part 2 (User/Product/Cart) - COMPLETED ✅**
- 14 endpoints mới: User (6), Product (6), Cart (5)
- Full CRUD + business logic: pagination, search, filter, stock validation

**Part 4 (Order/Checkout) - COMPLETED ✅**
- 6 endpoints mới: checkout, my orders, order detail, cancel order, admin orders list, admin status update
- Có transaction nghiệp vụ checkout, quản lý vòng đời trạng thái và hoàn tồn kho khi hủy

**Part 7 (Infrastructure/API Gateway) - COMPLETED ✅**
- API Gateway prefix `/api` điều hướng tập trung cho toàn bộ module backend
- 2 endpoints giám sát gateway: `/api/gateway/health`, `/api/gateway/metrics`
- Giới hạn tần suất truy cập với in-memory rate limiter + response headers
- Request logging theo JSON và theo dõi số liệu traffic/latency
- Cân bằng tải bằng Node.js cluster mode (multi-worker)

**Total:** 31 backend API endpoints implemented and type-safe
