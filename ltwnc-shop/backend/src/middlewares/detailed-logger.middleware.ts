import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";

// Middleware ghi log tất cả request/response chi tiết
// Chỉ hoạt động trong development mode
export const detailedRequestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Bỏ qua nếu không phải development mode
  if (env.nodeEnv !== 'development') {
    return next();
  }

  const startTime = Date.now();
  const { method, originalUrl, url, path } = req;
  
  // Log incoming request
  console.log(`\n${'='.repeat(80)}`);
  console.log(`[REQUEST] ${method} ${originalUrl}`);
  console.log(`[HEADER] Origin: ${req.get('origin') || 'none'}`);
  console.log(`[HEADER] Host: ${req.get('host')}`);
  console.log(`[HEADER] Content-Type: ${req.get('content-type')}`);
  console.log(`[IP] ${req.ip} (X-Forwarded-For: ${req.get('x-forwarded-for') || 'none'})`);
  
  // Log request body nếu là POST/PUT
  if ((method === 'POST' || method === 'PUT') && req.body) {
    console.log(`[BODY]`, JSON.stringify(req.body).substring(0, 200));
  }

  // Intercept response
  const originalJson = res.json;
  const originalSend = res.send;
  let responseBody: any = null;
  let responseSize = 0;

  // Override res.json
  res.json = function(data: any) {
    responseBody = data;
    responseSize = JSON.stringify(data).length;
    return originalJson.call(this, data);
  };

  // Override res.send
  res.send = function(data: any) {
    responseBody = data;
    responseSize = typeof data === 'string' ? data.length : JSON.stringify(data).length;
    return originalSend.call(this, data);
  };

  // Log response khi finish
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[RESPONSE] Status: ${res.statusCode} | Size: ${responseSize}B | Time: ${duration}ms`);
    
    // Log response body nếu nhỏ
    if (responseBody && responseSize < 500) {
      console.log(`[RESPONSE-BODY]`, 
        typeof responseBody === 'string' ? responseBody.substring(0, 200) : JSON.stringify(responseBody).substring(0, 200)
      );
    }
    
    // Cảnh báo nếu response trống
    if (!responseBody || responseSize === 0) {
      console.log(`⚠️ WARNING: Response body is EMPTY!`);
    }
    
    console.log(`${'='.repeat(80)}\n`);
  });

  next();
};
