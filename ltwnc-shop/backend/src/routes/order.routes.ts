import { Router } from "express";
import { orderController } from "../controllers/order.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRoles } from "../middlewares/rbac.middleware";
import { UserRole } from "@prisma/client";

// Routes quản lý đơn hàng
const orderRouter = Router();

// Protected routes - cần xác thực
orderRouter.get("/", requireAuth, orderController.listMyOrders);
orderRouter.post("/", requireAuth, orderController.createOrder);
orderRouter.get("/:orderId", requireAuth, orderController.getOrderDetail);

// Admin routes - chỉ admin mới được phép
orderRouter.get(
  "/admin/all",
  requireAuth,
  requireRoles(UserRole.ADMIN),
  orderController.listAllOrders
);
orderRouter.put(
  "/:orderId/status",
  requireAuth,
  requireRoles(UserRole.ADMIN),
  orderController.updateOrderStatus
);
orderRouter.delete(
  "/:orderId",
  requireAuth,
  requireRoles(UserRole.ADMIN),
  orderController.cancelOrder
);

export default orderRouter;
