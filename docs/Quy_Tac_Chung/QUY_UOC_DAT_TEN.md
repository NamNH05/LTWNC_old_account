# Quy ước đặt tên

## 1) Tên file và thư mục
- Dùng chữ hoa tiếng Việt không dấu hoặc chữ thường không dấu, thống nhất trong cả dự án.
- Ưu tiên tên ngắn, rõ nghĩa, có gạch dưới hoặc camelCase, nhưng không trộn lẫn tùy ý.
- Không đặt tên chung chung như `new`, `test`, `temp`, `abc`.
- Tên thư mục nên phản ánh đúng chức năng, ví dụ: `auth`, `product`, `order`, `shared`.

## 2) Quy ước commit message
- Dùng định dạng: `type: mo_ta_ngan` (hậu tố phải viết bằng tiếng Việt)
- Các type: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`
- Ví dụ: `feat: thêm tìm kiếm sản phẩm`, `fix: sửa lỗi đăng nhập`, `chore: cập nhật dependencies`
- Không dùng commit message quá dài hoặc không rõ mục tiêu.

## 3) Tên migration và seed
- Migration phải có ý nghĩa, ví dụ: `init_schema`, `add_products_table`.
- Seed nên đặt theo mục đích, ví dụ: `seed_admin_user`, `seed_sample_products`.
- Không dùng tên viết tắt khó hiểu.

## 4) Tên biến và hàm
- Biến, hàm, service, controller phải đặt theo đúng vai trò.
- Dùng tên mô tả hành động hoặc dữ liệu, ví dụ: `getProducts`, `createOrder`, `userEmail`.
- Không dùng tên một ký tự nếu không thật sự cần.

## 5) Tên bảng và cột database
- Tên bảng nên ở dạng số nhiều, ví dụ: `users`, `products`, `orders`.
- Tên cột nên rõ nghĩa, ví dụ: `created_at`, `updated_at`, `user_id`.
- Các khóa ngoại nên thống nhất theo kiểu `ten_bang_id`.

## 6) Tên component và page frontend
- Component dùng PascalCase, ví dụ: `ProductCard`, `CheckoutForm`.
- Page nên đặt theo chức năng, ví dụ: `HomePage`, `CartPage`, `ProfilePage`.
- File service nên đặt theo module, ví dụ: `auth.service`, `product.service`.

## 7) Quy ước chung
- Một kiểu đặt tên phải dùng xuyên suốt trong cả dự án.
- Nếu đã chốt cách viết thì không đổi lung tung giữa tiếng Việt và tiếng Anh.
- Tên phải đọc lên hiểu ngay vai trò của nó.
- Commit message phải rõ ràng, ngắn gọn, dễ hiểu mục đích thay đổi.
