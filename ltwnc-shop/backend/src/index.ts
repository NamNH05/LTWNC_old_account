import { app } from "./app";
import { env } from "./config/env";

// Entry point: khởi chạy HTTP server từ app đã cấu hình sẵn.
app.listen(env.port, () => {
  console.log(`Backend is running on http://localhost:${env.port}`);
});
