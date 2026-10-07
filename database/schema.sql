-- ProofA11y Database Schema
-- Compatible with PostgreSQL 15+ and pgvector

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'developer' CHECK (role IN ('admin', 'developer', 'reviewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('URL', 'GITHUB', 'ZIP_UPLOAD')),
    source_url TEXT,
    framework VARCHAR(50) NOT NULL DEFAULT 'HTML',
    package_manager VARCHAR(50) DEFAULT 'npm',
    score INT DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Scans Table
CREATE TABLE IF NOT EXISTS scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    target_url TEXT NOT NULL,
    health_score INT NOT NULL,
    violations_count INT DEFAULT 0,
    passes_count INT DEFAULT 0,
    incomplete_count INT DEFAULT 0,
    scan_duration_ms INT NOT NULL,
    page_title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Violations Table
CREATE TABLE IF NOT EXISTS violations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
    rule_id VARCHAR(100) NOT NULL,
    wcag_criterion VARCHAR(50) NOT NULL,
    impact VARCHAR(20) CHECK (impact IN ('critical', 'serious', 'moderate', 'minor')),
    description TEXT NOT NULL,
    help_url TEXT,
    affected_html TEXT,
    target_selector TEXT,
    failure_summary TEXT,
    status VARCHAR(50) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_REPAIR', 'REPAIRED', 'VERIFIED'))
);

-- 5. Repairs & Patches Table
CREATE TABLE IF NOT EXISTS repairs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    violation_id UUID REFERENCES violations(id) ON DELETE CASCADE,
    strategy_name VARCHAR(255) NOT NULL,
    target_file TEXT NOT NULL,
    original_code TEXT NOT NULL,
    replacement_code TEXT NOT NULL,
    diff_snippet TEXT NOT NULL,
    patch_hash VARCHAR(64) NOT NULL,
    confidence_score INT NOT NULL,
    risk_level VARCHAR(20) CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Sandbox Test Runs Table
CREATE TABLE IF NOT EXISTS test_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    repair_id UUID REFERENCES repairs(id) ON DELETE CASCADE,
    applied_successfully BOOLEAN NOT NULL DEFAULT TRUE,
    accessibility_passed BOOLEAN NOT NULL DEFAULT TRUE,
    regression_passed BOOLEAN NOT NULL DEFAULT TRUE,
    build_passed BOOLEAN NOT NULL DEFAULT TRUE,
    violations_before INT NOT NULL,
    violations_after INT NOT NULL,
    logs JSONB,
    duration_ms INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Verification Contracts Table
CREATE TABLE IF NOT EXISTS verification_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    repair_id UUID REFERENCES repairs(id) ON DELETE CASCADE,
    rule_id VARCHAR(100) NOT NULL,
    wcag_criterion VARCHAR(50) NOT NULL,
    precondition TEXT NOT NULL,
    transformation TEXT NOT NULL,
    postcondition TEXT NOT NULL,
    machine_checkable_logic TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Proof Certificates Table (Proof Registry)
CREATE TABLE IF NOT EXISTS proof_certificates (
    id VARCHAR(100) PRIMARY KEY,
    contract_id UUID REFERENCES verification_contracts(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    rule_id VARCHAR(100) NOT NULL,
    wcag_criterion VARCHAR(50) NOT NULL,
    source_hash VARCHAR(64) NOT NULL,
    patch_hash VARCHAR(64) NOT NULL,
    certificate_hash VARCHAR(64) NOT NULL,
    verification_status VARCHAR(20) DEFAULT 'VALID' CHECK (verification_status IN ('VALID', 'INVALID', 'PENDING')),
    issued_by TEXT NOT NULL,
    engine_version VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. WCAG Knowledge Embeddings (pgvector)
CREATE TABLE IF NOT EXISTS wcag_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_id VARCHAR(100) NOT NULL,
    wcag_criterion VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(100) NOT NULL,
    target_id TEXT NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
