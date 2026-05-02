# Module System

Hệ thống module của backend dùng `module_settings` trong database để bật/tắt tính năng, nhưng danh sách module chuẩn phải được khai báo trong manifest để API, seed data và màn hình quản trị đọc cùng một nguồn sự thật.

## Cấu trúc chuẩn

Mỗi module mới nên có cấu trúc sau:

```text
src/modules/<module-name>/
  module.manifest.ts
  <module-name>.service.ts
  <module-name>.controller.ts
  <module-name>.routes.ts
  index.ts
```

## Manifest

Manifest mô tả module thay vì chứa logic nghiệp vụ. Các trường chính:

```ts
{
  name: "announcement",
  label: "Thông báo mẫu",
  description: "Module mẫu hoàn chỉnh để tham chiếu khi tạo module mới.",
  category: "sample",
  defaultEnabled: false,
  entryPoint: "src/modules/announcement",
  routes: ["GET /api/announcements"],
  dependencies: ["module-settings"],
  sample: true,
}
```

## Thêm module mới trong 5 phút

1. Copy thư mục mẫu `src/modules/announcement` sang tên module mới.
2. Đổi `module.manifest.ts` cho đúng `name`, `label`, `description`, `routes`.
3. Thêm controller/service/routes của riêng module.
4. Đăng ký manifest vào `src/modules/module.registry.ts`.
5. Mount router trong `src/app.ts` và thêm module vào seed data nếu cần trạng thái mặc định.

## Cách hoạt động

- `module.registry.ts` là danh sách manifest chuẩn.
- `ModuleService` đọc manifest + trạng thái DB để trả về catalog cho admin.
- Frontend quản lý module hiển thị trực tiếp từ catalog đó.
- Khi module bị tắt, `checkModuleEnabled(...)` chặn request của module đó.

## Module mẫu

Module `announcement` là module tham chiếu có manifest, service, controller và route riêng. Nó được tắt mặc định để không ảnh hưởng đến luồng chính, nhưng có thể bật từ màn hình quản trị để kiểm tra cơ chế module toggle end-to-end.
