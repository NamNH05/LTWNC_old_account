import cors from "cors";
import express from "express";
import { authRouter } from "./routes/auth.routes";
import { errorHandler } from "./middlewares/error.middleware";

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

// Middleware bắt lỗi luôn đặt cuối pipeline.
app.use(errorHandler);
