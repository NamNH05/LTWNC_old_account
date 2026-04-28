import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { adminRouter } from "./modules/admin";
import { authRouter } from "./modules/auth";
import { addressRouter } from "./modules/address";
import { cartRouter } from "./modules/cart";
import { orderRouter } from "./modules/order";
import { paymentRouter } from "./modules/payment";
import { productRouter } from "./modules/product";
import { userRouter } from "./modules/user";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { createRateLimiter } from "./middlewares/rate-limit.middleware";
import { assignRequestContext } from "./middlewares/request-context.middleware";
import { requestLogger } from "./middlewares/request-logger.middleware";

export const app = express();

const apiRateLimiter = createRateLimiter({
  windowMs: env.rateLimitWindowMs,
  maxRequests: env.rateLimitMax,
  keyPrefix: "api",
});

if (env.trustProxy > 0) {
  app.set("trust proxy", env.trustProxy);
}

// Middleware nền: cấu hình CORS và parse JSON body.
app.use(cors({
  origin: (origin, callback) => {
    // Whitelist các origin được phép
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      env.frontendUrl,
      // Cho phép requests từ các port khác của VS Code (vì người dùng có thể công khai bất kỳ port nào)
      // Nếu muốn strict hơn, thay bằng danh sách cụ thể các IP/domain được phép
    ];

    // Cho phép requests không có origin header (mobile, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // Kiểm tra origin
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (env.nodeEnv === 'development') {
      // Development mode: cho phép tất cả origins
      callback(null, true);
    } else {
      // Production mode: từ chối các origins không được phép
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(assignRequestContext);
app.use(requestLogger);

// Health check đơn giản để kiểm tra service còn sống.
app.get("/", (_req, res) => {
  res.status(200).json({
    service: "LTWNC Backend",
    status: "ok",
  });
});

// Áp rate-limit chung cho toàn bộ API trước khi vào router chi tiết.
app.use("/api", apiRateLimiter);

// Mount toàn bộ route dưới prefix /api/*.
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/addresses", addressRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/admin", adminRouter);

// Bất kỳ route nào không match sẽ trả 404 để test dễ hơn.
app.use(notFoundHandler);

// Middleware bắt lỗi luôn đặt cuối pipeline.
app.use(errorHandler);
