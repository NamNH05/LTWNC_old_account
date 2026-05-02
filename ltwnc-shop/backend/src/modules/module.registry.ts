import { announcementModuleManifest } from "./announcement/module.manifest";

export type ModuleCategory = "core" | "commerce" | "account" | "admin" | "sample";

export interface ModuleManifest {
  name: string;
  label: string;
  description: string;
  category: ModuleCategory;
  defaultEnabled: boolean;
  entryPoint: string;
  routes: string[];
  dependencies?: string[];
  sample?: boolean;
}

export interface ModuleCatalogItem extends ModuleManifest {
  isEnabled: boolean;
  hasStoredSetting: boolean;
}

export const MODULE_MANIFESTS: ModuleManifest[] = [
  {
    name: "admin",
    label: "Quản trị",
    description: "Các API quản trị hệ thống, người dùng, đơn hàng và báo cáo.",
    category: "admin",
    defaultEnabled: true,
    entryPoint: "src/modules/admin",
    routes: ["GET /api/admin/*"],
  },
  {
    name: "address",
    label: "Địa chỉ",
    description: "Quản lý địa chỉ giao hàng và địa chỉ mặc định của người dùng.",
    category: "account",
    defaultEnabled: true,
    entryPoint: "src/modules/address",
    routes: ["GET /api/addresses", "POST /api/addresses"],
  },
  {
    name: "cart",
    label: "Giỏ hàng",
    description: "Thêm, cập nhật và xoá sản phẩm trong giỏ hàng.",
    category: "commerce",
    defaultEnabled: true,
    entryPoint: "src/modules/cart",
    routes: ["GET /api/cart", "POST /api/cart/items"],
  },
  announcementModuleManifest,
  {
    name: "order",
    label: "Đơn hàng",
    description: "Tạo đơn, theo dõi trạng thái và xử lý vòng đời đơn hàng.",
    category: "commerce",
    defaultEnabled: true,
    entryPoint: "src/modules/order",
    routes: ["GET /api/orders", "POST /api/orders"],
  },
  {
    name: "payment",
    label: "Thanh toán",
    description: "Xử lý phương thức thanh toán và luồng thanh toán trực tuyến.",
    category: "commerce",
    defaultEnabled: true,
    entryPoint: "src/modules/payment",
    routes: ["GET /api/payments", "POST /api/payments"],
  },
  {
    name: "product",
    label: "Sản phẩm",
    description: "Danh mục, chi tiết và thao tác quản lý sản phẩm.",
    category: "commerce",
    defaultEnabled: true,
    entryPoint: "src/modules/product",
    routes: ["GET /api/products", "GET /api/products/:productId"],
  },
  {
    name: "user",
    label: "Người dùng",
    description: "Quản lý tài khoản, hồ sơ và quyền truy cập của người dùng.",
    category: "account",
    defaultEnabled: true,
    entryPoint: "src/modules/user",
    routes: ["GET /api/users", "PUT /api/users/:id"],
  },
];

export const MODULE_MANIFEST_MAP = new Map(
  MODULE_MANIFESTS.map((manifest) => [manifest.name, manifest] as const)
);

export function getModuleManifest(moduleName: string): ModuleManifest | undefined {
  return MODULE_MANIFEST_MAP.get(moduleName);
}

export function getRegisteredModuleNames(): string[] {
  return MODULE_MANIFESTS.map((manifest) => manifest.name);
}
