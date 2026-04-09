# Quy tắc lỗi chung

## Nguyên tắc trả lỗi
- API phải trả đúng status code theo từng tình huống.
- Thông báo lỗi phải ngắn gọn, rõ nghĩa, không gây hiểu nhầm.
- Nội dung trả về cho client phải thống nhất giữa các API.

## Mã lỗi thường dùng
- `200`: xử lý thành công.
- `201`: tạo mới thành công.
- `400`: dữ liệu đầu vào không hợp lệ.
- `401`: chưa đăng nhập hoặc token không hợp lệ.
- `403`: không có quyền truy cập.
- `404`: không tìm thấy dữ liệu.
- `409`: bị trùng dữ liệu hoặc xung đột.
- `500`: lỗi hệ thống phía server.

## Khi validate dữ liệu
- Trả lỗi đúng field bị sai.
- Có thể liệt kê nhiều lỗi cùng lúc nếu cần.
- Ưu tiên thông báo dễ sửa, ví dụ: email sai định dạng, mật khẩu quá ngắn, tên sản phẩm bị trống.

## Điều cần tránh
- Không trả mật khẩu, token, chuỗi kết nối hoặc thông tin nội bộ.
- Không để lộ stack trace ra phía client.
- Không dùng thông báo lỗi quá chung chung như "có lỗi xảy ra" nếu có thể mô tả rõ hơn.

## Logging
- Lỗi hệ thống phải được ghi log ở server để dễ debug.
- Các lỗi nhạy cảm nên có mã lỗi nội bộ để tra cứu nhanh.
