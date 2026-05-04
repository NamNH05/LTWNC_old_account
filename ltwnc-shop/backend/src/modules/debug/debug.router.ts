import express, { Request, Response } from "express";

interface RequestLog {
  id: string;
  timestamp: string;
  method: string;
  path: string;
  origin: string;
  ip: string;
  statusCode: number;
  durationMs: number;
  requestBody?: any;
  responseBody?: any;
  headers: Record<string, string>;
}

// Store last 100 requests
const requestLogs: RequestLog[] = [];
const MAX_LOGS = 100;

let requestCounter = 0;

export const debugRouter = express.Router();

// Middleware to capture all requests
export const captureRequestDebugInfo = (req: Request, res: Response, next: express.NextFunction) => {
  const startTime = Date.now();
  const logId = `${++requestCounter}`;
  const originalJson = res.json;
  const originalSend = res.send;

  let requestBody = req.body;
  let responseBody: any = null;

  // Capture response
  res.json = function(data: any) {
    responseBody = data;
    return originalJson.call(this, data);
  };

  res.send = function(data: any) {
    responseBody = data;
    return originalSend.call(this, data);
  };

  res.on("finish", () => {
    const durationMs = Date.now() - startTime;

    const log: RequestLog = {
      id: logId,
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      origin: req.get("origin") || "unknown",
      ip: req.ip || "unknown",
      statusCode: res.statusCode,
      durationMs,
      headers: {
        "content-type": req.get("content-type") || "unknown",
        "user-agent": req.get("user-agent") || "unknown",
      },
    };

    // Only log body for sensitive endpoints and if small enough
    if (req.path.includes("/auth/") && JSON.stringify(requestBody).length < 500) {
      log.requestBody = requestBody;
    }
    if (responseBody && JSON.stringify(responseBody).length < 500) {
      log.responseBody = responseBody;
    }

    requestLogs.push(log);
    if (requestLogs.length > MAX_LOGS) {
      requestLogs.shift();
    }
  });

  next();
};

// Debug endpoint: show all captured requests
debugRouter.get("/debug/requests", (_req: Request, res: Response) => {
  res.json({
    total: requestLogs.length,
    requests: requestLogs.map((log) => ({
      id: log.id,
      timestamp: log.timestamp,
      method: log.method,
      path: log.path,
      origin: log.origin,
      ip: log.ip,
      status: log.statusCode,
      duration: `${log.durationMs}ms`,
      userAgent: log.headers["user-agent"],
    })),
  });
});

// Debug endpoint: show detailed info for specific request
debugRouter.get("/debug/requests/:id", (req: Request, res: Response) => {
  const log = requestLogs.find((l) => l.id === req.params.id);
  if (!log) {
    return res.status(404).json({ error: "Request not found" });
  }
  res.json(log);
});

// Debug endpoint: show last login attempts
debugRouter.get("/debug/login-attempts", (_req: Request, res: Response) => {
  const loginAttempts = requestLogs.filter((log) => log.path.includes("/auth/login"));
  res.json({
    total: loginAttempts.length,
    attempts: loginAttempts.map((log) => ({
      timestamp: log.timestamp,
      origin: log.origin,
      ip: log.ip,
      status: log.statusCode,
      duration: `${log.durationMs}ms`,
      headers: log.headers,
      request: log.requestBody,
      response: log.responseBody,
    })),
  });
});

// Debug endpoint: show CORS info
debugRouter.get("/debug/cors-check", (req: Request, res: Response) => {
  res.json({
    requestOrigin: req.get("origin") || "none",
    requestHost: req.get("host"),
    serverTime: new Date().toISOString(),
    corsEnabled: true,
    message: "If you see this, CORS is working!",
  });
});

// Debug endpoint: show HTML dashboard
debugRouter.get("/debug", (_req: Request, res: Response) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>LTWNC Backend Debug Dashboard</title>
      <style>
        body { font-family: monospace; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { color: #333; }
        .card { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .request { padding: 10px; border-left: 3px solid #007bff; margin: 5px 0; }
        .request.error { border-left-color: #dc3545; }
        .request.success { border-left-color: #28a745; }
        .status { display: inline-block; padding: 2px 8px; border-radius: 3px; font-weight: bold; }
        .status-2xx { background: #d4edda; color: #155724; }
        .status-4xx { background: #fff3cd; color: #856404; }
        .status-5xx { background: #f8d7da; color: #721c24; }
        button { padding: 10px 15px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; }
        button:hover { background: #0056b3; }
        #logs { max-height: 500px; overflow-y: auto; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🔍 LTWNC Backend Debug Dashboard</h1>
        
        <div class="card">
          <h2>📊 Live Requests</h2>
          <button onclick="refreshRequests()">🔄 Refresh</button>
          <div id="logs" style="margin-top: 10px;"></div>
        </div>

        <div class="card">
          <h2>🔐 Login Attempts</h2>
          <button onclick="showLoginAttempts()">Show Login History</button>
          <div id="login-logs" style="margin-top: 10px;"></div>
        </div>

        <div class="card">
          <h2>🌐 CORS Check</h2>
          <button onclick="checkCORS()">Test CORS</button>
          <div id="cors-info" style="margin-top: 10px;"></div>
        </div>
      </div>

      <script>
        const API = 'http://localhost:8080/api';

        async function refreshRequests() {
          try {
            const res = await fetch(API + '/debug/requests');
            const data = await res.json().catch(() => ({ requests: [] }));
            const html = data.requests.slice(-20).reverse().map(r => {
              const statusClass = r.status >= 500 ? 'error' : r.status >= 400 ? 'error' : 'success';
              return \`
                <div class="request \${statusClass}">
                  <strong>\${r.method} \${r.path}</strong> 
                  <span class="status status-\${Math.floor(r.status/100)}xx">\${r.status}</span>
                  <br>
                  <small>From: \${r.ip} | Origin: \${r.origin} | Duration: \${r.duration}</small>
                </div>
              \`;
            }).join('');
            document.getElementById('logs').innerHTML = html || '<p>No requests yet</p>';
          } catch (e) {
            document.getElementById('logs').innerHTML = '<p style="color:red;">Error: ' + e.message + '</p>';
          }
        }

        async function showLoginAttempts() {
          try {
            const res = await fetch(API + '/debug/login-attempts');
            const data = await res.json().catch(() => ({ attempts: [] }));
            const html = data.attempts.map(a => \`
              <div class="request \${a.status >= 400 ? 'error' : 'success'}">
                <strong>Login \${a.status >= 400 ? '❌ FAILED' : '✅ SUCCESS'}</strong>
                <br>
                <small>
                  Time: \${a.timestamp}<br>
                  From: \${a.ip} | Origin: \${a.origin}<br>
                  Duration: \${a.duration}<br>
                  Email: \${a.request?.email || 'N/A'}<br>
                  Response: \${a.response?.message || JSON.stringify(a.response).substring(0, 100)}
                </small>
              </div>
            \`).join('');
            document.getElementById('login-logs').innerHTML = html || '<p>No login attempts</p>';
          } catch (e) {
            document.getElementById('login-logs').innerHTML = '<p style="color:red;">Error: ' + e.message + '</p>';
          }
        }

        async function checkCORS() {
          try {
            const res = await fetch(API + '/debug/cors-check');
            const data = await res.json().catch(() => ({}));
            document.getElementById('cors-info').innerHTML = \`
              <pre>\${JSON.stringify(data, null, 2)}</pre>
            \`;
          } catch (e) {
            document.getElementById('cors-info').innerHTML = '<p style="color:red;">CORS Error: ' + e.message + '</p>';
          }
        }

        // Auto-refresh every 2 seconds
        refreshRequests();
        setInterval(refreshRequests, 2000);
      </script>
    </body>
    </html>
  `;
  res.send(html);
});
