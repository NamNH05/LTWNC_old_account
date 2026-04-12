# Thanh Toán VNPAY

## Mục tiêu
Triển khai luồng thanh toán VNPAY cho backend hiện tại theo hướng đủ dùng cho production cơ bản: tạo giao dịch, xác nhận kết quả, cập nhật trạng thái đơn hàng, và ghi log giao dịch.

## Các bước cần và đủ

### 1. Bổ sung dữ liệu payment
- Tạo model `Payment` trong Prisma.
- Gắn quan hệ 1-1 hoặc 1-n với `Order` tùy thiết kế.
- Tối thiểu cần các trường:
  - `orderId`
  - `amount`
  - `method`
  - `status`
  - `transactionId`
  - `bankCode`
  - `responseCode`
  - `paidAt`
  - `rawPayload` hoặc `gatewayResponse`

### 2. Chốt flow nghiệp vụ
- User checkout tạo `Order` trước.
- Backend tạo payment request VNPAY cho order đó.
- Frontend nhận URL thanh toán và chuyển user sang VNPAY.
- VNPAY gọi về `returnUrl` và `ipnUrl` để báo kết quả.
- Backend xác minh chữ ký rồi cập nhật payment và order.

### 3. Thêm endpoint payment
- Endpoint tạo link thanh toán.
- Endpoint return/callback sau khi thanh toán xong.
- Endpoint IPN để nhận thông báo server-to-server từ VNPAY.
- Endpoint kiểm tra trạng thái payment của một order.

### 4. Xác thực chữ ký VNPAY
- Sinh checksum/hash đúng theo tài liệu VNPAY.
- Verify toàn bộ query string khi VNPAY trả về.
- Từ chối toàn bộ request có chữ ký sai hoặc dữ liệu bị sửa.

### 5. Xử lý idempotency
- Một giao dịch có thể callback nhiều lần.
- Nếu `transactionId` hoặc `orderId` đã xử lý rồi thì bỏ qua.
- Không cho cộng/trừ trạng thái hoặc tạo payment record trùng.

### 6. Gắn payment vào order lifecycle
- Nếu payment thành công thì cập nhật order sang trạng thái phù hợp.
- Nếu payment fail/cancel thì giữ nguyên hoặc hủy theo rule nghiệp vụ.
- Tách rõ trạng thái thanh toán và trạng thái xử lý đơn hàng.

### 7. Ghi log giao dịch
- Lưu request tạo payment.
- Lưu callback/IPN từ VNPAY.
- Lưu lỗi xác thực chữ ký, timeout, hoặc trạng thái không hợp lệ.
- Dùng log này để đối soát khi có tranh chấp.

### 8. Bổ sung hoàn tiền nếu cần
- Nếu scope có refund thì tạo riêng luồng refund.
- Có trạng thái refund riêng và logic đối soát riêng.
- Nếu chưa làm refund thì ghi rõ là ngoài phạm vi bản đầu.

### 9. Bổ sung cấu hình môi trường
- `vnp_TmnCode`
- `vnp_HashSecret`
- `vnp_Url`
- `vnp_ReturnUrl`
- `vnp_IpnUrl`
- Tách cấu hình theo môi trường dev/test/prod.

### 10. Kiểm thử bắt buộc
- Tạo payment URL thành công.
- Callback hợp lệ cập nhật payment.
- Callback sai chữ ký bị từ chối.
- Callback lặp không tạo side effect lần 2.
- Thanh toán fail/cancel xử lý đúng.
- Order đã thanh toán không thể thanh toán lại.

## Điểm đang thiếu ở backend hiện tại
- Chưa có bảng `Payment` trong schema hiện hành.
- Chưa có callback/IPN handler.
- Chưa có verify chữ ký VNPAY.
- Chưa có payment status riêng.
- Chưa có luồng refund.
- Chưa có log giao dịch và đối soát.

## Kết luận ngắn
Backend hiện tại mới dừng ở mức tạo đơn hàng và quản lý trạng thái đơn hàng. Muốn thêm VNPAY thì phải bổ sung cả dữ liệu, endpoint, verify chữ ký, và cơ chế chống xử lý trùng.
