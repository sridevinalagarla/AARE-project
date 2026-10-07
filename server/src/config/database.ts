import { PrismaClient } from '@prisma/client';
import { PGlite } from '@electric-sql/pglite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let prismaInstance: PrismaClient | null = null;
let pgliteInstance: PGlite | null = null;
let isDbConnected = false;
let activeEngine: 'prisma' | 'pglite' = 'pglite';

// Initialize PGlite (Real Embedded PostgreSQL 16 with disk persistence)
export function getPGliteClient(): PGlite {
  if (!pgliteInstance) {
    const dbDir = path.join(__dirname, '..', '..', 'database', 'pgdata');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    pgliteInstance = new PGlite(dbDir);
    initializeTables(pgliteInstance).catch(console.error);
  }
  return pgliteInstance;
}

async function initializeTables(db: PGlite): Promise<void> {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'DEVELOPER',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      source_type VARCHAR(50) DEFAULT 'URL',
      source_url TEXT,
      repository_url TEXT,
      framework VARCHAR(100) DEFAULT 'React',
      language VARCHAR(100) DEFAULT 'TypeScript',
      package_manager VARCHAR(50) DEFAULT 'npm',
      status VARCHAR(50) DEFAULT 'READY',
      accessibility_score NUMERIC(5,2) DEFAULT 100.0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS scans (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
      url TEXT NOT NULL,
      status VARCHAR(50) DEFAULT 'QUEUED',
      score NUMERIC(5,2) DEFAULT 100.0,
      total_violations INTEGER DEFAULT 0,
      total_passes INTEGER DEFAULT 0,
      total_incomplete INTEGER DEFAULT 0,
      critical_count INTEGER DEFAULT 0,
      serious_count INTEGER DEFAULT 0,
      moderate_count INTEGER DEFAULT 0,
      minor_count INTEGER DEFAULT 0,
      duration NUMERIC(8,3),
      started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS violations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
      rule_id VARCHAR(100) NOT NULL,
      impact VARCHAR(50),
      wcag_criteria TEXT[],
      description TEXT NOT NULL,
      help TEXT NOT NULL,
      help_url TEXT,
      tags TEXT[],
      affected_nodes JSONB NOT NULL,
      source_html TEXT,
      target TEXT,
      status VARCHAR(50) DEFAULT 'OPEN',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS repairs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
      violation_id UUID REFERENCES violations(id) ON DELETE CASCADE,
      rule_id VARCHAR(100) NOT NULL,
      strategy TEXT NOT NULL,
      confidence NUMERIC(5,2) DEFAULT 100.0,
      risk VARCHAR(50) DEFAULT 'LOW',
      original_code TEXT NOT NULL,
      patched_code TEXT NOT NULL,
      file_path TEXT NOT NULL,
      line_start INTEGER DEFAULT 1,
      line_end INTEGER DEFAULT 1,
      patch_hash VARCHAR(64) NOT NULL,
      status VARCHAR(50) DEFAULT 'GENERATED',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS test_runs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      repair_id UUID REFERENCES repairs(id) ON DELETE CASCADE,
      type VARCHAR(50) DEFAULT 'FULL',
      status VARCHAR(50) DEFAULT 'PASSED',
      violations_before INTEGER DEFAULT 1,
      violations_after INTEGER DEFAULT 0,
      regression_passed BOOLEAN DEFAULT TRUE,
      accessibility_passed BOOLEAN DEFAULT TRUE,
      build_passed BOOLEAN DEFAULT TRUE,
      visual_diff_passed BOOLEAN DEFAULT TRUE,
      test_output JSONB,
      started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS proof_certificates (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      certificate_id VARCHAR(100) UNIQUE NOT NULL,
      project_id UUID REFERENCES projects(id) ON DELETE RESTRICT,
      repair_id UUID REFERENCES repairs(id) ON DELETE RESTRICT,
      rule_id VARCHAR(100) NOT NULL,
      wcag_criteria TEXT[],
      source_hash VARCHAR(64) NOT NULL,
      patch_hash VARCHAR(64) NOT NULL,
      contract_hash VARCHAR(64) NOT NULL,
      test_hash VARCHAR(64) NOT NULL,
      verification_status VARCHAR(50) DEFAULT 'VALID',
      certificate_data JSONB NOT NULL,
      issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
  }
  return prismaInstance;
}

export const prisma = getPrismaClient();
export const pglite = getPGliteClient();

export async function checkDatabaseConnection(): Promise<boolean> {
  // 1. First try external PostgreSQL / Supabase connection if configured
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost:5432')) {
    try {
      await prisma.$queryRaw`SELECT 1 as connected`;
      isDbConnected = true;
      activeEngine = 'prisma';
      return true;
    } catch {
      // Fall through to embedded PostgreSQL
    }
  }

  // 2. Query embedded PostgreSQL (PGlite) engine
  try {
    const pgliteDb = getPGliteClient();
    const result = await pgliteDb.query('SELECT 1 as connected;');
    if (result && result.rows && result.rows.length > 0) {
      isDbConnected = true;
      activeEngine = 'pglite';
      return true;
    }
    isDbConnected = false;
    return false;
  } catch (error) {
    isDbConnected = false;
    return false;
  }
}

export function isDatabaseConnected(): boolean {
  return isDbConnected;
}

export function getActiveEngine(): 'prisma' | 'pglite' {
  return activeEngine;
}

export async function disconnectDatabase(): Promise<void> {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
  }
  if (pgliteInstance) {
    await pgliteInstance.close();
  }
  isDbConnected = false;
}
