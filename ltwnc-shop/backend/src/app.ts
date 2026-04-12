import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { createRateLimiter } from "./middlewares/rate-limit.middleware";
import { assignRequestContext } from "./middlewares/request-context.middleware";
import { requestLogger } from "./middlewares/request-logger.middleware";
import { apiGatewayRouter } from "./routes/api-gateway.routes";

export const app = express();

const apiRateLimiter = createRateLimiter({
  windowMs: env.rateLimitWindowMs,
  maxRequests: env.rateLimitMax,
  keyPrefix: "api",
});

if (env.trustProxy > 0) {
  app.set("trust proxy", env.trustProxy);
}

// Middleware nền: cho phép CORS và parse JSON body.
app.use(cors());
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

// Lớp API Gateway: rate limit + điều hướng request nội bộ.
app.use("/api", apiRateLimiter, apiGatewayRouter);

// Bất kỳ route nào không match sẽ trả 404 để test dễ hơn.
app.use(notFoundHandler);

// Middleware bắt lỗi luôn đặt cuối pipeline.
app.use(errorHandler);
