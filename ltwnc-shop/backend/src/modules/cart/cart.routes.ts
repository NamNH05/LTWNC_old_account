import { Router } from "express";
import { cartController } from "./cart.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

// Routes quản lý giỏ hàng
const cartRouter = Router();

// Protected routes - cần xác thực
cartRouter.get("/", requireAuth, cartController.getCart);
cartRouter.post("/add", requireAuth, cartController.addToCart);
cartRouter.post("/sync", requireAuth, cartController.syncCart);
cartRouter.put("/:cartItemId", requireAuth, cartController.updateCartItem);
cartRouter.delete("/:cartItemId", requireAuth, cartController.removeFromCart);
cartRouter.delete("/", requireAuth, cartController.clearCart);

export default cartRouter;
