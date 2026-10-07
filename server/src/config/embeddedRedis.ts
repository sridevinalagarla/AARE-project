import net from 'node:net';

interface RedisEntry {
  value: string;
  expiresAt?: number;
}

class EmbeddedRedisServer {
  private server: net.Server | null = null;
  private store: Map<string, RedisEntry> = new Map();
  private isRunning: boolean = false;
  private port: number = 6379;
  private host: string = '127.0.0.1';

  public async start(port: number = 6379, host: string = '127.0.0.1'): Promise<boolean> {
    if (this.isRunning) return true;
    this.port = port;
    this.host = host;

    return new Promise((resolve) => {
      const server = net.createServer((socket) => {
        let buffer = '';

        socket.on('data', (chunk) => {
          buffer += chunk.toString('utf-8');

          while (buffer.length > 0) {
            const parsed = this.parseRESP(buffer);
            if (!parsed) break;

            buffer = parsed.remaining;
            const response = this.handleCommand(parsed.args);
            if (response) {
              socket.write(response);
            }
          }
        });

        socket.on('error', () => {
          // Socket client closed / error
        });
      });

      server.on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          // A native Redis instance or container is already running on port 6379
          console.log(`ℹ️ Redis port ${port} already active. Connecting to existing Redis server.`);
          this.isRunning = false;
          resolve(false);
        } else {
          console.warn('⚠️ Embedded Redis error:', err.message);
          this.isRunning = false;
          resolve(false);
        }
      });

      server.listen(this.port, this.host, () => {
        this.isRunning = true;
        this.server = server;
        console.log(`⚡ Embedded In-Memory Redis Engine listening on ${this.host}:${this.port}`);
        resolve(true);
      });
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          this.isRunning = false;
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  private parseRESP(data: string): { args: string[]; remaining: string } | null {
    if (!data.startsWith('*')) {
      // Inline command (e.g. "PING\r\n")
      const idx = data.indexOf('\r\n');
      if (idx === -1) return null;
      const line = data.substring(0, idx).trim();
      const parts = line.split(/\s+/).filter(Boolean);
      return { args: parts, remaining: data.substring(idx + 2) };
    }

    const lines = data.split('\r\n');
    const arrayLengthMatch = lines[0].match(/^\*(\d+)/);
    if (!arrayLengthMatch) return null;

    const numArgs = parseInt(arrayLengthMatch[1], 10);
    const args: string[] = [];
    let currentLine = 1;

    for (let i = 0; i < numArgs; i++) {
      if (currentLine >= lines.length) return null;
      const bulkHeader = lines[currentLine];
      if (!bulkHeader.startsWith('$')) return null;

      const bulkLen = parseInt(bulkHeader.substring(1), 10);
      if (bulkLen === -1) {
        args.push('');
        currentLine++;
        continue;
      }

      currentLine++;
      if (currentLine >= lines.length) return null;
      args.push(lines[currentLine]);
      currentLine++;
    }

    // Reconstruct remaining buffer
    const consumed = lines.slice(0, currentLine).join('\r\n') + '\r\n';
    return { args, remaining: data.substring(consumed.length) };
  }

  private handleCommand(args: string[]): string {
    if (!args || args.length === 0) return '+OK\r\n';
    const cmd = args[0].toUpperCase();

    switch (cmd) {
      case 'PING': {
        const msg = args[1];
        return msg ? `$${Buffer.byteLength(msg)}\r\n${msg}\r\n` : '+PONG\r\n';
      }

      case 'ECHO': {
        const msg = args[1] || '';
        return `$${Buffer.byteLength(msg)}\r\n${msg}\r\n`;
      }

      case 'HELLO': {
        // RESP3 / RESP2 handshake response
        const serverInfo = [
          'server', 'redis',
          'version', '7.2.0-embedded',
          'proto', '2',
          'mode', 'standalone',
          'role', 'master',
          'modules', []
        ];
        return this.formatArray(['server', 'redis', 'version', '7.2.0-embedded', 'proto', '2', 'mode', 'standalone', 'role', 'master']);
      }

      case 'COMMAND':
      case 'DOCS':
      case 'CONFIG': {
        return '*0\r\n';
      }

      case 'CLIENT': {
        return '+OK\r\n';
      }

      case 'INFO': {
        const info = `# Server\r\nredis_version:7.2.0-embedded\r\nredis_mode:standalone\r\nos:embedded-ts\r\ntcp_port:${this.port}\r\nuptime_in_seconds:3600\r\nconnected_clients:1\r\nused_memory_human:1.2M\r\n`;
        return `$${Buffer.byteLength(info)}\r\n${info}\r\n`;
      }

      case 'SELECT': {
        return '+OK\r\n';
      }

      case 'SET': {
        const key = args[1];
        const val = args[2];
        if (!key || val === undefined) return '-ERR wrong number of arguments for set\r\n';

        let expiresAt: number | undefined = undefined;
        for (let i = 3; i < args.length; i++) {
          const opt = args[i].toUpperCase();
          if (opt === 'EX' && args[i + 1]) {
            expiresAt = Date.now() + parseInt(args[i + 1], 10) * 1000;
            i++;
          } else if (opt === 'PX' && args[i + 1]) {
            expiresAt = Date.now() + parseInt(args[i + 1], 10);
            i++;
          }
        }

        this.store.set(key, { value: val, expiresAt });
        return '+OK\r\n';
      }

      case 'GET': {
        const key = args[1];
        if (!key) return '-ERR wrong number of arguments for get\r\n';

        const entry = this.store.get(key);
        if (!entry) return '$-1\r\n';

        if (entry.expiresAt && Date.now() > entry.expiresAt) {
          this.store.delete(key);
          return '$-1\r\n';
        }

        return `$${Buffer.byteLength(entry.value)}\r\n${entry.value}\r\n`;
      }

      case 'DEL': {
        let deleted = 0;
        for (let i = 1; i < args.length; i++) {
          if (this.store.delete(args[i])) deleted++;
        }
        return `:${deleted}\r\n`;
      }

      case 'EXISTS': {
        let count = 0;
        for (let i = 1; i < args.length; i++) {
          const entry = this.store.get(args[i]);
          if (entry && (!entry.expiresAt || entry.expiresAt > Date.now())) count++;
        }
        return `:${count}\r\n`;
      }

      case 'EXPIRE': {
        const key = args[1];
        const sec = parseInt(args[2] || '0', 10);
        const entry = this.store.get(key);
        if (entry) {
          entry.expiresAt = Date.now() + sec * 1000;
          return ':1\r\n';
        }
        return ':0\r\n';
      }

      case 'TTL': {
        const key = args[1];
        const entry = this.store.get(key);
        if (!entry) return ':-2\r\n';
        if (!entry.expiresAt) return ':-1\r\n';
        const remaining = Math.max(0, Math.ceil((entry.expiresAt - Date.now()) / 1000));
        return `:${remaining}\r\n`;
      }

      case 'DBSIZE': {
        return `:${this.store.size}\r\n`;
      }

      case 'FLUSHDB':
      case 'FLUSHALL': {
        this.store.clear();
        return '+OK\r\n';
      }

      case 'QUIT': {
        return '+OK\r\n';
      }

      default: {
        return '+OK\r\n';
      }
    }
  }

  private formatArray(items: string[]): string {
    let out = `*${items.length}\r\n`;
    for (const item of items) {
      out += `$${Buffer.byteLength(item)}\r\n${item}\r\n`;
    }
    return out;
  }
}

export const embeddedRedis = new EmbeddedRedisServer();
