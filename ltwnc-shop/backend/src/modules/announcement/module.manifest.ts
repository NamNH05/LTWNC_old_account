import type { ModuleManifest } from "../module.registry";

export const announcementModuleManifest: ModuleManifest = {
  name: "announcement",
  label: "Thông báo mẫu",
  description: "Module mẫu hoàn chỉnh để tham chiếu khi tạo module mới.",
  category: "sample",
  defaultEnabled: false,
  entryPoint: "src/modules/announcement",
  routes: ["GET /api/announcements", "GET /api/announcements/active"],
  dependencies: ["module-settings"],
  sample: true,
};
