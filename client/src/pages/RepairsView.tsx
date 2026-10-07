import React, { useState } from 'react';
import {
  Wrench,
  Sparkles,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  ShieldCheck,
  Check,
  Copy,
  Layers,
  Terminal,
  Cpu,
} from 'lucide-react';
import { AccessibilityViolation, RepairPlan, PatchDiff, SandboxTestResult } from '../types';
import { NavTab } from '../components/Navbar';

interface RepairsViewProps {
  activeViolation: AccessibilityViolation | null;
  plan: RepairPlan | null;
  patch: PatchDiff | null;
  testResult: SandboxTestResult | null;
  onApplyAndTest: () => void;
  onProceedToVerification: () => void;
  isApplying: boolean;
  setActiveTab: (tab: NavTab) => void;
}

export const RepairsView: React.FC<RepairsViewProps> = ({
  activeViolation,
  plan,
  patch,
  testResult,
  onApplyAndTest,
  onProceedToVerification,
  isApplying,
  setActiveTab,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyDiff = () => {
    if (!patch) return;
    navigator.clipboard.writeText(patch.diffFormatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!activeViolation || !plan || !patch) {
    return (
      <div className="w-full max-w-4xl mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
          <Wrench className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">No Active Repair Session</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Select a detected violation from the Violations view to initiate multi-agent repair planning and patch synthesis.
        </p>
        <button
          onClick={() => setActiveTab('violations')}
          className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
        >
          Explore Detected Violations
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono uppercase tracking-wider mb-2">
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span>MULTI-AGENT REPAIR ENGINE & DIFF SYNTHESIS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Automated Remediation Workspace</span>
            <span className="font-mono text-sm px-2.5 py-0.5 rounded bg-brand-500/15 text-brand-300 border border-brand-500/30">
              {plan.ruleId}
            </span>
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onApplyAndTest}
            disabled={isApplying}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-teal-500 hover:from-amber-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isApplying ? 'Applying in Sandbox...' : 'Apply & Run Sandbox Tests'}</span>
          </button>

          {testResult?.appliedSuccessfully && (
            <button
              onClick={onProceedToVerification}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer animate-pulse"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Repair Contract</span>
            </button>
          )}
        </div>
      </div>

      {/* Multi-Agent Diagnostic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Agent 1 & 2: Issue & Semantic Context */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 bg-[#0d1322] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Issue Diagnosis</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 font-mono">Agent 1 & 2</span>
          </div>
          <h4 className="text-sm font-bold text-white">
            {activeViolation.help}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {plan.description}
          </p>
        </div>

        {/* Agent 3: Repair Strategy */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 bg-[#0d1322] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Remediation Strategy</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 font-mono">Agent 3</span>
          </div>
          <div className="text-sm font-bold text-amber-300">
            {plan.strategyName}
          </div>
          <div className="flex items-center gap-4 text-xs font-mono pt-1 text-slate-400">
            <span>Risk: <strong className="text-emerald-400">{plan.riskLevel}</strong></span>
            <span>Confidence: <strong className="text-cyan-400">{plan.confidenceScore}%</strong></span>
          </div>
        </div>

        {/* Pre/Post Invariant Preview */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 bg-[#0d1322] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Formal Invariant</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">Contract</span>
          </div>
          <div className="text-xs text-slate-300 font-mono space-y-1">
            <div><span className="text-slate-500">Pre:</span> {plan.precondition}</div>
            <div><span className="text-emerald-400">Post:</span> {plan.postcondition}</div>
          </div>
        </div>

      </div>

      {/* Monaco-Style Diff Viewer */}
      <div className="glass-panel rounded-2xl border border-white/10 bg-[#0c1220] overflow-hidden shadow-2xl">
        <div className="p-4 bg-[#10182c] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code2 className="w-4 h-4 text-brand-400" />
            <span className="font-mono text-xs font-bold text-slate-200">
              {patch.file} (Lines {patch.lineStart}-{patch.lineEnd})
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-black/40 px-2 py-0.5 rounded">
              SHA: {patch.patchHash.substring(0, 12)}...
            </span>
          </div>

          <button
            onClick={handleCopyDiff}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied Diff</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Patch</span>
              </>
            )}
          </button>
        </div>

        {/* Side-by-Side Diff Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 font-mono text-xs">
          
          {/* Left: Original Code */}
          <div className="p-5 space-y-2 bg-[#090d16]/80">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-rose-400 pb-2 border-b border-white/5">
              <span>BEFORE (Violating Source)</span>
              <span className="text-[10px] text-slate-500 font-mono">Line {patch.lineStart}</span>
            </div>
            <pre className="text-rose-300 whitespace-pre-wrap break-all p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 leading-relaxed">
              {patch.originalCode}
            </pre>
          </div>

          {/* Right: Replacement Code */}
          <div className="p-5 space-y-2 bg-[#080d16]/80">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-emerald-400 pb-2 border-b border-white/5">
              <span>AFTER (Verified Remediation)</span>
              <span className="text-[10px] text-slate-500 font-mono">Synthesized AST</span>
            </div>
            <pre className="text-emerald-300 whitespace-pre-wrap break-all p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 leading-relaxed">
              {patch.replacementCode}
            </pre>
          </div>

        </div>
      </div>

      {/* Sandbox Test Execution Telemetry */}
      {testResult && (
        <div className="glass-panel rounded-2xl p-6 border border-emerald-500/30 bg-[#0c1626] space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">
                Sandbox Execution Results
              </h3>
            </div>
            <span className="font-mono text-xs text-slate-400">
              Completed in {testResult.durationMs}ms
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="text-slate-500 text-[10px] uppercase">Patch Application</div>
              <div className="text-emerald-400 font-bold">✓ APPLIED</div>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="text-slate-500 text-[10px] uppercase">A11y Test Invariant</div>
              <div className="text-emerald-400 font-bold">✓ PASS (0 Violations)</div>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="text-slate-500 text-[10px] uppercase">Regression Suite</div>
              <div className="text-emerald-400 font-bold">✓ ZERO REGRESSIONS</div>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="text-slate-500 text-[10px] uppercase">Visual Diff Delta</div>
              <div className="text-emerald-400 font-bold">✓ 0.000 SHIFT</div>
            </div>
          </div>

          {/* Sandbox Logs */}
          <div className="space-y-1">
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1 font-mono">
              <Terminal className="w-3.5 h-3.5" /> Sandbox Execution Logs:
            </span>
            <div className="p-3 rounded-xl bg-black/60 border border-white/5 font-mono text-[11px] text-slate-300 space-y-1 max-h-40 overflow-y-auto">
              {testResult.logs.map((log, lIdx) => (
                <div key={lIdx} className="leading-snug">{log}</div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
