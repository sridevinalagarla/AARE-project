import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Load .env file from the server root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export interface EnvConfig {
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  DATABASE_URL?: string;
  DIRECT_URL?: string;
  AI_API_KEY?: string;
  REDIS_URL?: string;
  JWT_SECRET: string;
  S3_ENDPOINT?: string;
  S3_ACCESS_KEY?: string;
  S3_SECRET_KEY?: string;
  S3_BUCKET?: string;
}

export const ENV: EnvConfig = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  AI_API_KEY: process.env.AI_API_KEY,
  REDIS_URL: process.env.REDIS_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'proofa11y-verified-jwt-secret-key-2026',
  S3_ENDPOINT: process.env.S3_ENDPOINT,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
  S3_SECRET_KEY: process.env.S3_SECRET_KEY,
  S3_BUCKET: process.env.S3_BUCKET,
};

/**
 * Returns a sanitized configuration summary suitable for logs/diagnostics.
 * Crucial: NEVER reveals raw passwords, secrets, or API keys.
 */
export function getSanitizedEnvSummary() {
  return {
    PORT: ENV.PORT,
    NODE_ENV: ENV.NODE_ENV,
    hasDatabaseUrl: Boolean(ENV.DATABASE_URL),
    hasAiApiKey: Boolean(ENV.AI_API_KEY),
    hasRedisUrl: Boolean(ENV.REDIS_URL),
    hasJwtSecret: Boolean(ENV.JWT_SECRET),
  };
}
