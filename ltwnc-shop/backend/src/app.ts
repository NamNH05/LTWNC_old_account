import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { adminRouter, adminModuleRouter } from "./modules/admin";
import { authRouter } from "./modules/auth";
import { addressRouter } from "./modules/address";
import { announcementRouter } from "./modules/announcement";
import { cartRouter } from "./modules/cart";
import { orderRouter } from "./modules/order";
import { paymentRouter } from "./modules/payment";
import { productRouter } from "./modules/product";
import { userRouter } from "./modules/user";
import { checkModuleEnabled } from "./middlewares/module.middleware";
import { createRateLimiter } from "./middlewares/rate-limit.middleware";
import { assignRequestContext } from "./middlewares/request-context.middleware";
import { requestLogger } from "./middlewares/request-logger.middleware";
import { detailedRequestLogger } from "./middlewares/detailed-logger.middleware";
import { debugRouter, captureRequestDebugInfo } from "./modules/debug/debug.router";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";

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
      'http://localhost:8080',
      'http://127.0.0.1:8080',
      'https://hnamofficial.id.vn',  // Production frontend
      'https://www.hnamofficial.id.vn',  // Production with www
      'https://api.hnamofficial.id.vn',  // API can call itself if needed
    ];

    // Add env.frontendUrl if explicitly set
    if (env.frontendUrl && !allowedOrigins.includes(env.frontendUrl)) {
      allowedOrigins.push(env.frontendUrl);
    }

    // Cho phép requests không có origin header (mobile, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // Kiểm tra origin
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (env.nodeEnv === 'development') {
      // Development mode: cho phép tất cả origins
      console.warn(`[CORS] Allowing origin in development mode: ${origin}`);
      callback(null, true);
    } else {
      // Production mode: từ chối các origins không được phép
      console.error(`[CORS] Rejected origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(detailedRequestLogger);
app.use(captureRequestDebugInfo);
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
app.use("/api/users", checkModuleEnabled("user"), userRouter);
app.use("/api/products", checkModuleEnabled("product"), productRouter);
app.use("/api/cart", checkModuleEnabled("cart"), cartRouter);
app.use("/api/addresses", checkModuleEnabled("address"), addressRouter);
app.use("/api/orders", checkModuleEnabled("order"), orderRouter);
app.use("/api/payments", checkModuleEnabled("payment"), paymentRouter);
app.use("/api/announcements", checkModuleEnabled("announcement"), announcementRouter);
app.use("/api/admin/modules", adminModuleRouter);
app.use("/api/admin", adminRouter);

// Debug endpoints (development only)
if (env.nodeEnv === 'development') {
  app.use("/api", debugRouter);
}

// Bất kỳ route nào không match sẽ trả 404 để test dễ hơn.
app.use(notFoundHandler);

// Middleware bắt lỗi luôn đặt cuối pipeline.
app.use(errorHandler);
