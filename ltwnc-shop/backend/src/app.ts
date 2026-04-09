import cors from "cors";
import express from "express";
import { authRouter } from "./routes/auth.routes";
import { errorHandler } from "./middlewares/error.middleware";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    service: "LTWNC Backend",
    status: "ok",
  });
});

app.use("/api/auth", authRouter);
app.use(errorHandler);
