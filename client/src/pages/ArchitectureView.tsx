import React from 'react';
import {
  Layers,
  Globe,
  FolderGit2,
  Cpu,
  Code2,
  Wrench,
  ShieldCheck,
  Award,
  Lock,
  Zap,
  Server,
  Database,
  Terminal,
  RefreshCw,
  Sparkles,
  ArrowDown,
  ArrowRight,
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto py-8 space-y-10 animate-fadeIn">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>PROOFA11Y SYSTEM ARCHITECTURE BLUEPRINT</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Proof-Carrying WCAG Auto-Repair Architecture
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          End-to-end formal verification pipeline spanning AST observation, multi-agent repair synthesis, isolated sandbox regression testing, and cryptographic certificate issuance.
        </p>
      </div>

      {/* 4 Foundation Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="glass-panel rounded-2xl p-4 border border-white/10 bg-[#0d1322] space-y-2">
          <div className="flex items-center gap-2 text-brand-400 font-bold uppercase">
            <Code2 className="w-4 h-4" />
            <span>1. Frontend UI</span>
          </div>
          <p className="text-slate-400">React 19 + Vite + TypeScript + Tailwind CSS + Framer Motion</p>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-white/10 bg-[#0d1322] space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase">
            <Server className="w-4 h-4" />
            <span>2. Backend Server</span>
          </div>
          <p className="text-slate-400">Node.js + Express + TypeScript + WebSockets (/ws stream)</p>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-white/10 bg-[#0d1322] space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase">
            <Database className="w-4 h-4" />
            <span>3. Database & Cache</span>
          </div>
          <p className="text-slate-400">PostgreSQL + pgvector semantic store + Redis job queue</p>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-white/10 bg-[#0d1322] space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-bold uppercase">
            <Lock className="w-4 h-4" />
            <span>4. Storage & Armor</span>
          </div>
          <p className="text-slate-400">S3 Storage + SSRF Filters + Zero-Trust Gate Verification</p>
        </div>
      </div>

      {/* Main Core Flow Architecture Diagram */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 bg-[#0c1220] space-y-8">
        <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs text-slate-400">
          Core Pipeline Dataflow Diagram
        </h2>

        {/* Level 1: Input & Ingestion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#080c16] border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-400 text-sm">USER INPUT LAYER</span>
              <Globe className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-xs text-slate-400">
              Ingests live Website URLs, GitHub repositories, and ZIP packages with SSRF validation.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#080c16] border border-indigo-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-400 text-sm">PROJECT INGESTION & PARSER</span>
              <FolderGit2 className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-xs text-slate-400">
              Framework Adapters for HTML, React, Next.js, Vue, Angular, Svelte to extract component hierarchies.
            </p>
          </div>
        </div>

        <div className="flex justify-center text-slate-600">
          <ArrowDown className="w-6 h-6 animate-bounce" />
        </div>

        {/* Level 2: Observation & WCAG Knowledge */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#080c16] border border-brand-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-brand-400 text-sm">ACCESSIBILITY OBSERVATION</span>
              <Cpu className="w-4 h-4 text-brand-400" />
            </div>
            <p className="text-xs text-slate-400">
              Playwright headless Chromium + axe-core execution analyzing accessibility trees and color contrast.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#080c16] border border-teal-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-teal-400 text-sm">WCAG KNOWLEDGE LAYER</span>
              <Layers className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-xs text-slate-400">
              Rule Graph with formal preconditions, transformations, postconditions, and risk scoring.
            </p>
          </div>
        </div>

        <div className="flex justify-center text-slate-600">
          <ArrowDown className="w-6 h-6 animate-bounce" />
        </div>

        {/* Level 3: Multi-Agent Engine & Sandbox */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#080c16] border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 text-sm">MULTI-AGENT REPAIR ENGINE</span>
              <Wrench className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xs text-slate-400">
              Issue Analyzer $\rightarrow$ Context Agent $\rightarrow$ Repair Planner $\rightarrow$ Patch Generator $\rightarrow$ Counterexample Loop.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#080c16] border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-400 text-sm">SANDBOX & REGRESSION TESTING</span>
              <Terminal className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-xs text-slate-400">
              Applies patch to virtual AST, rebuilds, and executes baseline regression tests to ensure 0 side effects.
            </p>
          </div>
        </div>

        <div className="flex justify-center text-slate-600">
          <ArrowDown className="w-6 h-6 animate-bounce" />
        </div>

        {/* Level 4: Formal Verification & Conformance Gate */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0a1626] to-indigo-950/40 border border-emerald-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-400 text-sm">FORMAL VERIFICATION & CONFORMANCE GATE</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-xs text-slate-300">
            Validates machine-checkable repair contract, asserts postcondition compliance, generates cryptographic SHA-256 Proof Certificate, and enforces Zero-Trust gate approval before deployment.
          </p>
        </div>
      </div>

    </div>
  );
};
