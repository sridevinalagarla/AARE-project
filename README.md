# PROOF A11Y — Proof-Carrying WCAG Auto-Repair Engine

> **Full Product Name:** ProofA11y – Proof-Carrying WCAG Auto-Repair Engine  
> **Core Pipeline:** DETECT → UNDERSTAND → REPAIR → TEST → PROVE → DEPLOY  
> **Problem Statement:** *"Automated Accessibility Repair Engine That Detects and Perfectly Fixes Every WCAG Violation With Formal Correctness Guarantees."*

---

## 🏛️ System Architecture

```text
                                  PROOF A11Y ARCHITECTURE
                                  
+---------------------------------------------------------------------------------------------------+
|                                      USER INPUT LAYER                                             |
|          [ Website URL ]                [ GitHub Repository ]             [ ZIP / Project Upload ]|
+-------------------------------------------------+-------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                               PROJECT INGESTION & ANALYSIS                                        |
|  - Multi-Framework Adapters: React, Next.js, Vue, Angular, Svelte, Static HTML                    |
|  - AST & Normalized Project Model: Component / Route / DOM Extractor                              |
+-------------------------------------------------+-------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                               ACCESSIBILITY OBSERVATION LAYER                                     |
|  - Playwright Headless Browser Runtime        - axe-core Injected WCAG 2.1/2.2 Detection Engine   |
|  - Full Accessibility Tree & Landmarks        - Color Contrast Ratio & Keyboard Focus Evaluator   |
+-------------------------------------------------+-------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                    WCAG KNOWLEDGE LAYER                                           |
|  - Structured Rule Graph (image-alt, button-name, label, contrast, lang, heading-order, aria-*)  |
|  - Precondition / Postcondition Contracts & Machine-Checkable Invariants                          |
+-------------------------------------------------+-------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                 MULTI-AGENT REPAIR ENGINE                                         |
|  1. ISSUE ANALYZER: Root Cause & Code Context   2. CONTEXT AGENT: Semantic Hierarchy Inference    |
|  3. REPAIR PLANNER: AST Mutation Strategy       4. PATCH GENERATOR: Unified Diff + SHA-256 Hashing|
|  5. COUNTEREXAMPLE AGENT: Regression & Invariant Violation Refinement Loop                        |
+-------------------------------------------------+-------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                    SANDBOX & TESTING LAYER                                        |
|  - Isolated In-Memory Headless Environment     - Post-Patch axe-core Re-evaluation               |
|  - Structural DOM Regression Suite             - Visual & Behavioral Regression Invariant Checks  |
+-------------------------------------------------+-------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                   FORMAL VERIFICATION LAYER                                       |
|  - Proof-Carrying Repair Contracts             - Machine-Checkable Postcondition Evaluation       |
|  - Cryptographic Proof Certificate Issuer (SHA-256 Hashes: Source, Patch, Certificate)            |
+-------------------------------------------------+-------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                   ZERO-TRUST CONFORMANCE GATE                                     |
|  [✓] WCAG Re-Scan Passes       [✓] 0 Regressions Introduced       [✓] Proof Certificate Valid     |
|                                                                                                   |
|                    [ ALL PASS? ]  ---> YES ---> DEPLOY VERIFIED PATCH                             |
|                           |                                                                       |
|                           NO ---> FEEDBACK LOOP TO REPAIR PLANNER (Counterexample Guided)        |
+---------------------------------------------------------------------------------------------------+
```

---

## ⚡ Key Features

1. **6-Stage Autonomous Closed Loop**: Ingests projects, diagnoses violations, plans AST modifications, tests inside isolated sandboxes, proves machine-checkable invariants, and passes zero-trust gates.
2. **Multi-Agent Orchestration**: Specialized logical agents coordinate root-cause analysis, context inference, patch synthesis, and counterexample generation.
3. **Proof-Carrying Verification**: Generates immutable, machine-checkable SHA-256 proof certificates (`PA11Y-2026-XXXX`) containing formal preconditions, transformations, postconditions, and cryptographic provenance.
4. **Resilient Local Fallbacks**: Runs seamlessly with or without external PostgreSQL, Redis, S3, or LLM API keys using high-performance in-memory engines.
5. **Interactive Live Demo**: Features an autonomous self-healing demonstration repairing 8 WCAG violations from 61% to 100% health score with zero regressions.
6. **Hackathon Presentation Mode**: Optimized presenter deck with slide controls and live system telemetry.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React, Canvas Confetti.
- **Backend**: Node.js, Express, TypeScript, Playwright, axe-core, Adm-Zip, WebSocket (`ws`), Rate-Limiting.
- **Database & Storage**: PostgreSQL schema with `pgvector` RAG support, Redis queue, and local disk fallback.

---

## 🚀 Quick Start

### 1. Install Dependencies & Playwright Browsers

```bash
# Install root, server, and client packages
npm run install:all

# Install Playwright browser binaries
cd server && npx playwright install chromium && cd ..
```

### 2. Start Both Services

```bash
# Runs backend on http://localhost:3001 and frontend on http://localhost:5173
npm run dev
```

### 3. Run Automated Unit & Invariant Tests

```bash
npm test
```

---

## 📡 REST API & WebSocket Reference

- `POST /api/scan`: Ingests and scans a live website URL.
- `POST /api/projects/analyze`: Ingests a GitHub repo or project structure.
- `POST /api/violations/analyze`: Runs Issue Analyzer and Context Agent on a violation.
- `POST /api/repairs/generate`: Synthesizes an AST patch diff and repair plan.
- `POST /api/repairs/apply`: Applies patch inside an isolated sandbox and re-scans with axe-core.
- `POST /api/verify`: Evaluates the formal repair contract and issues a Proof Certificate.
- `GET /api/certificates`: Retrieves the immutable Proof Registry.
- `POST /api/demo/full-cycle`: Executes the complete 6-stage autonomous self-healing demo.
- `WebSocket /ws`: Streams live progress telemetry across all pipeline stages.

---

## 🔒 Scope & Research Disclaimer

> **Prototype Scope:**  
> Automated accessibility testing cannot detect every WCAG criterion (e.g. subjective content quality). ProofA11y implements formal verification as proof-carrying repair contracts with machine-checkable postconditions for supported rules. Full universal theorem proving across arbitrary JavaScript/CSS remains an active area of future research.
