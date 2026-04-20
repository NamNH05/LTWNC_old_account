import { Router } from "express";
import { paymentController } from "../controllers/payment.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRoles } from "../middlewares/rbac.middleware";
import { UserRole } from "@prisma/client";

// Routes quản lý thanh toán
const paymentRouter = Router();

// Public routes
paymentRouter.get("/methods", paymentController.getPaymentMethods);

// Protected routes
paymentRouter.get("/", requireAuth, paymentController.getMyPayments);
paymentRouter.post("/", requireAuth, paymentController.createPayment);
paymentRouter.get("/:paymentId", requireAuth, paymentController.getPaymentDetail);

// Admin routes
paymentRouter.get(
  "/admin/all",
  requireAuth,
  requireRoles(UserRole.ADMIN),
  paymentController.getAllPayments
);

export default paymentRouter;
