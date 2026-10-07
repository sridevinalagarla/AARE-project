import React from 'react';
import {
  ShieldCheck,
  FolderGit2,
  AlertOctagon,
  Wrench,
  CheckCircle2,
  Award,
  ArrowRight,
  Sparkles,
  Zap,
  Lock,
  Cpu,
  RefreshCw,
  Search,
  Play,
  Layers,
  Terminal,
} from 'lucide-react';
import { NavTab } from '../components/Navbar';

interface DashboardViewProps {
  analytics: any;
  setActiveTab: (tab: NavTab) => void;
  onRunDemo: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  analytics,
  setActiveTab,
  onRunDemo,
}) => {
  const stats = [
    {
      label: 'Projects Scanned',
      value: analytics?.projectsScanned || 3,
      icon: FolderGit2,
      color: 'text-cyan-400',
      bg: 'bg-cyan-950/30 border-cyan-500/30',
    },
    {
      label: 'Violations Detected',
      value: analytics?.violationsDetected || 18,
      icon: AlertOctagon,
      color: 'text-rose-400',
      bg: 'bg-rose-950/30 border-rose-500/30',
    },
    {
      label: 'Violations Repaired',
      value: analytics?.violationsRepaired || 12,
      icon: Wrench,
      color: 'text-amber-400',
      bg: 'bg-amber-950/30 border-amber-500/30',
    },
    {
      label: 'Verified Repairs',
      value: analytics?.verifiedRepairs || 12,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/30 border-emerald-500/30',
    },
    {
      label: 'Regression Failures',
      value: analytics?.regressionFailures || 0,
      icon: ShieldCheck,
      color: 'text-teal-400',
      bg: 'bg-teal-950/30 border-teal-500/30',
    },
    {
      label: 'Proof Certificates',
      value: analytics?.proofCertificates || 12,
      icon: Award,
      color: 'text-indigo-400',
      bg: 'bg-indigo-950/30 border-indigo-500/30',
    },
  ];

  const pipelineSteps = [
    { id: 'detect', label: 'DETECT', desc: 'Playwright + axe-core Observation', color: 'text-cyan-400 border-cyan-500/40' },
    { id: 'understand', label: 'UNDERSTAND', desc: 'Semantic Context & Issue Analyzer', color: 'text-indigo-400 border-indigo-500/40' },
    { id: 'repair', label: 'REPAIR', desc: 'Multi-Agent Repair Planner & Patch', color: 'text-amber-400 border-amber-500/40' },
    { id: 'test', label: 'TEST', desc: 'Sandbox Execution & Regression Suite', color: 'text-purple-400 border-purple-500/40' },
    { id: 'prove', label: 'PROVE', desc: 'Formal Contract Invariant Verifier', color: 'text-emerald-400 border-emerald-500/40' },
    { id: 'deploy', label: 'DEPLOY', desc: 'Zero-Trust Conformance Gate', color: 'text-brand-400 border-brand-500/40' },
  ];

  const featureCards = [
    {
      title: 'AI Attack Simulator',
      badge: 'Red Teaming',
      desc: 'Simulates non-compliant DOM variations and screen-reader adversarial edges to stress-test accessibility resilience.',
      icon: Terminal,
      color: 'text-rose-400',
    },
    {
      title: 'Self-Improvement Loop',
      badge: 'Policy Learning',
      desc: 'Records verified repair contracts in pgvector knowledge storage to progressively optimize future patch accuracy.',
      icon: RefreshCw,
      color: 'text-cyan-400',
    },
    {
      title: 'Proof Registry',
      badge: 'Cryptographic Provenance',
      desc: 'Every applied patch is bundled with a SHA-256 machine-checkable certificate verifying WCAG postconditions.',
      icon: Award,
      color: 'text-indigo-400',
    },
    {
      title: 'Real-Time Monitoring',
      badge: 'WebSocket Telemetry',
      desc: 'Streams DOM analysis, AST transformation, and sandbox execution metrics in real-time.',
      icon: Zap,
      color: 'text-amber-400',
    },
    {
      title: 'Zero-Trust Deployment',
      badge: 'Conformance Gate',
      desc: 'Strictly prevents unauthorized code merges unless accessibility tests, regression suite, and formal proofs all pass.',
      icon: Lock,
      color: 'text-emerald-400',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-8 space-y-10">
      
      {/* Hero Card */}
      <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-white/10 relative overflow-hidden bg-gradient-to-br from-[#0c1220] via-[#10182c] to-[#0a0e1a]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32"></div>

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>PROOF A11Y ENGINE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Proof-Carrying <span className="cyber-gradient-text">WCAG Auto-Repair Engine</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            "Automated Accessibility Repair Engine That Detects and Perfectly Fixes Every WCAG Violation With Formal Correctness Guarantees."
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => setActiveTab('scan')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 via-teal-500 to-indigo-500 hover:from-brand-500 hover:to-indigo-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-brand-500/20 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Start Accessibility Scan</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('demo');
                onRunDemo();
              }}
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current text-indigo-400" />
              <span>Run Full Live Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Platform Metrics */}
      <div className="space-y-3">
        <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
          Platform Telemetry & Proof Metrics
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {stats.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={i}
                className={`p-4 rounded-2xl border flex flex-col justify-between ${st.bg} transition-all hover:scale-[1.02]`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">
                    {st.label}
                  </span>
                  <Icon className={`w-4 h-4 ${st.color}`} />
                </div>
                <div className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${st.color}`}>
                  {st.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6-Stage Core Workflow Pipeline */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 bg-[#0c1220] space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-400" />
              <span>The ProofA11y Closed-Loop Pipeline</span>
            </h2>
            <p className="text-xs text-slate-400">
              Deterministic formal verification cycle ensuring zero accessibility regressions before deployment.
            </p>
          </div>

          <div className="text-xs font-mono text-brand-300 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            DETECT → UNDERSTAND → REPAIR → TEST → PROVE → DEPLOY
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {pipelineSteps.map((step, idx) => (
            <div
              key={step.id}
              className={`p-4 rounded-xl bg-[#080c16] border flex flex-col justify-between gap-3 ${step.color} relative overflow-hidden`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white/5">
                  0{idx + 1}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-1">
                <div className="font-black text-sm text-white tracking-wide">
                  {step.label}
                </div>
                <div className="text-[11px] text-slate-400 leading-snug">
                  {step.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5 Key Architecture Feature Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white uppercase tracking-wider text-xs text-slate-400">
            Key Architecture Innovations
          </h3>
          <button
            onClick={() => setActiveTab('architecture')}
            className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-semibold cursor-pointer"
          >
            <span>View Complete Architecture Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureCards.map((fc, i) => {
            const Icon = fc.icon;
            return (
              <div
                key={i}
                className="glass-panel glass-panel-hover rounded-2xl p-5 border border-white/10 bg-[#0d1322] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                    <Icon className={`w-5 h-5 ${fc.color}`} />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10 font-mono">
                    {fc.badge}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white tracking-tight">
                  {fc.title}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {fc.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
