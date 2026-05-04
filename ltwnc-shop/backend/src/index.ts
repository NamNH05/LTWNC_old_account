import { app } from "./app";
import { env } from "./config/env";
import cluster from "node:cluster";
import os from "node:os";

const startServer = () => {
  const server = app.listen(env.port, () => {
    console.log(`\n=== Backend Started ===`);
    console.log(`URL: http://localhost:${env.port}`);
    console.log(`PID: ${process.pid}`);
    console.log(`ENV: ${env.nodeEnv}`);
    console.log(`Frontend URL: ${env.frontendUrl || 'Not set'}`);
    console.log(`========================\n`);
  });

  // Graceful error handling
  server.on('error', (error: any) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`\n❌ ERROR: Port ${env.port} is already in use!`);
      console.error(`Kill the process: netstat -ano | findstr :${env.port}`);
    } else {
      console.error(`Server error:`, error);
    }
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });
};

if (env.enableClusterMode && cluster.isPrimary) {
  const cpuCount = os.availableParallelism?.() ?? os.cpus().length;
  const workers = env.clusterWorkers > 0 ? env.clusterWorkers : cpuCount;

  console.log(`Cluster mode enabled with ${workers} workers`);
  for (let index = 0; index < workers; index += 1) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.error(`Worker ${worker.process.pid} exited, restarting...`);
    cluster.fork();
  });
} else {
  // Entry point: khởi chạy HTTP server từ app đã cấu hình sẵn.
  startServer();
}
