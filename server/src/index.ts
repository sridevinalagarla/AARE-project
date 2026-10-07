import express, { Request, Response, NextFunction } from 'express';
import http from 'node:http';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { scanRouter } from './routes/scanRouter.js';
import { proofRouter } from './routes/proofRoutes.js';
import { WsServerManager } from './websocket/wsServer.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
}));
app.use(express.json({ limit: '10mb' }));

// Serve static demo assets
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));
app.get('/demo', (req: Request, res: Response) => {
  res.sendFile(path.join(publicPath, 'demo.html'));
});

// Root Route: Friendly Developer Portal / Redirect to Frontend UI
app.get('/', (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>ProofA11y Backend Server</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; background: #080c14; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
        .card { background: #0f172a; border: 1px solid #1e293b; padding: 2.5rem; border-radius: 1rem; max-width: 540px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); text-align: center; }
        h1 { margin-top: 0; color: #38bdf8; font-family: monospace; font-size: 1.75rem; }
        p { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; }
        .btn { display: inline-block; background: linear-gradient(135deg, #06b6d4, #3b82f6); color: #020617; font-weight: 700; padding: 0.85rem 1.75rem; border-radius: 0.75rem; text-decoration: none; margin-top: 1rem; font-size: 0.95rem; transition: transform 0.15s; }
        .btn:hover { transform: scale(1.03); }
        .links { margin-top: 1.75rem; padding-top: 1.25rem; border-top: 1px solid #1e293b; display: flex; justify-content: center; gap: 1rem; font-size: 0.85rem; }
        .links a { color: #38bdf8; text-decoration: none; font-family: monospace; }
        .links a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>PROOF A11Y API SERVER</h1>
        <p>You are viewing the <strong>Backend API Service</strong> on port <code>3001</code>.</p>
        <p>The interactive web application is running on <strong>Port 5173</strong>.</p>
        <a href="http://localhost:5173" class="btn">🚀 OPEN WEB APPLICATION (PORT 5173)</a>
        <div class="links">
          <a href="/api/health">/api/health</a>
          <a href="/demo.html">/demo.html</a>
          <a href="/api/analytics">/api/analytics</a>
        </div>
      </div>
    </body>
    </html>
  `);
});


// API Routes
app.use('/api', scanRouter);
app.use('/api', proofRouter);

import { checkDatabaseConnection } from './config/database.js';
import { checkRedisConnection } from './config/redis.js';

// Health check endpoint with database and redis probe
app.get('/api/health', async (req: Request, res: Response) => {
  const [isDbOk, isRedisOk] = await Promise.all([
    checkDatabaseConnection(),
    checkRedisConnection(),
  ]);

  res.json({
    api: 'ok',
    database: isDbOk ? 'connected' : 'disconnected',
    redis: isRedisOk ? 'connected' : 'disconnected',
    platform: 'ProofA11y – Proof-Carrying WCAG Auto-Repair Engine',
    version: '1.0.4-verified',
    workflow: 'DETECT → UNDERSTAND → REPAIR → TEST → PROVE → DEPLOY',
    timestamp: new Date().toISOString(),
  });
});


// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[ProofA11y Server Error]:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error occurred.',
    message: err.message,
  });
});

// Initialize WebSocket server
WsServerManager.initialize(server);

server.listen(PORT, () => {
  console.log(`🚀 ProofA11y Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket Event Stream running on ws://localhost:${PORT}/ws`);
  console.log(`📋 Demo page accessible at http://localhost:${PORT}/demo.html`);
});

export default app;
