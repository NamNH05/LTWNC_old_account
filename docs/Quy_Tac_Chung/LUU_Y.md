# Lưu ý thêm

## Khi làm việc nhóm
- Mỗi module nên có một người phụ trách chính để tránh chồng chéo công việc.
- Trước khi code, cần chốt rõ API, database và phạm vi từng người.
- Nếu sửa phần chung, phải báo trước để tránh đụng vào code của người khác.
- Commit message phải rõ ràng, theo quy ước để dễ theo dõi history.

## Khi làm migration và seed
- Migration không sửa trực tiếp sau khi đã merge, nếu cần đổi thì tạo migration mới.
- Seed dữ liệu phải chạy lại nhiều lần mà không bị nhân bản dữ liệu.
- Nên có dữ liệu mẫu đủ để test nhanh các luồng chính: đăng nhập, sản phẩm, giỏ hàng, đơn hàng.

## Khi làm pull request
- Pull request phải được review chéo trước khi merge.
- Mỗi PR nên nhỏ, rõ mục tiêu và có mô tả ngắn về thay đổi.
- Nếu có ảnh hưởng tới API thì phải cập nhật tài liệu đi kèm.

## Khi cập nhật tài liệu
- Tất cả API cần thống nhất format response ngay từ đầu.
- Nếu có thay đổi về API hoặc database thì cập nhật tài liệu ngay, không để lệch code với docs.
- Nên có ghi chú ngắn cho các quyết định chung để cả nhóm dễ theo dõi.

## Khi bảo trì
- Ưu tiên code dễ đọc, dễ sửa hơn là viết quá nhanh.
- Các phần dùng chung nên tách ra sớm để tránh lặp lại.
- Luôn kiểm tra lại trước khi merge để hạn chế lỗi phát sinh về sau.
