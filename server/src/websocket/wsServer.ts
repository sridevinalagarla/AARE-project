import { WebSocketServer, WebSocket } from 'ws';
import { Server as HttpServer } from 'node:http';

export interface WebSocketEvent {
  type: string;
  stage?: string;
  progress?: number;
  data?: any;
  timestamp: string;
}

export class WsServerManager {
  private static wss: WebSocketServer | null = null;
  private static clients: Set<WebSocket> = new Set();

  public static initialize(server: HttpServer): void {
    this.wss = new WebSocketServer({ server, path: '/ws' });

    this.wss.on('connection', (ws: WebSocket) => {
      this.clients.add(ws);

      // Send initial welcome state
      ws.send(
        JSON.stringify({
          type: 'connected',
          message: 'Connected to ProofA11y Real-Time Event Stream',
          timestamp: new Date().toISOString(),
        })
      );

      ws.on('close', () => {
        this.clients.delete(ws);
      });

      ws.on('error', () => {
        this.clients.delete(ws);
      });
    });

    console.log('📡 WebSocket Server initialized on /ws');
  }

  public static broadcast(type: string, data?: any, progress?: number, stage?: string): void {
    const payload: WebSocketEvent = {
      type,
      stage,
      progress,
      data,
      timestamp: new Date().toISOString(),
    };

    const message = JSON.stringify(payload);
    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(message);
        } catch {}
      }
    }
  }
}
