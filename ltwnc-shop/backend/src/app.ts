import cors from "cors";
import express from "express";
import { authRouter } from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import productRouter from "./routes/product.routes";
import cartRouter from "./routes/cart.routes";
import addressRouter from "./routes/address.routes";
import orderRouter from "./routes/order.routes";
import paymentRouter from "./routes/payment.routes";
import { adminRouter } from "./routes/admin.routes";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";

export const app = express();

// Middleware nền: cho phép CORS và parse JSON body.
app.use(cors());
app.use(express.json());

// Health check đơn giản để kiểm tra service còn sống.
app.get("/", (_req, res) => {
  res.status(200).json({
    service: "LTWNC Backend",
    status: "ok",
  });
});

// Mount toàn bộ route auth dưới prefix /api/auth.
app.use("/api/auth", authRouter);

// Mount route user dưới prefix /api/users - quản lý thông tin người dùng.
app.use("/api/users", userRouter);

// Mount route product dưới prefix /api/products - quản lý sản phẩm và danh mục.
app.use("/api/products", productRouter);

// Mount route cart dưới prefix /api/cart - quản lý giỏ hàng.
app.use("/api/cart", cartRouter);

// Mount route address dưới prefix /api/addresses - quản lý địa chỉ giao hàng.
app.use("/api/addresses", addressRouter);

// Mount route order dưới prefix /api/orders - quản lý đơn hàng.
app.use("/api/orders", orderRouter);

// Mount route payment dưới prefix /api/payments - quản lý thanh toán.
app.use("/api/payments", paymentRouter);

// Mount route admin dưới prefix /api/admin - admin panel endpoints.
app.use("/api/admin", adminRouter);

// Bất kỳ route nào không match sẽ trả 404 để test dễ hơn.
app.use(notFoundHandler);

// Middleware bắt lỗi luôn đặt cuối pipeline.
app.use(errorHandler);
