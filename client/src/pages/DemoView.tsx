import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Award,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Layers,
  Wrench,
  Cpu,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { runFullDemoCycle } from '../services/api';
import { NavTab } from '../components/Navbar';

interface DemoViewProps {
  setActiveTab: (tab: NavTab) => void;
  onRefreshCertificates: () => void;
}

export const DemoView: React.FC<DemoViewProps> = ({ setActiveTab, onRefreshCertificates }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [demoResult, setDemoResult] = useState<any | null>(null);

  const steps = [
    { name: 'DETECT', label: '1. Ingest & Run Playwright + axe-core Observation', score: 61, violations: 8 },
    { name: 'UNDERSTAND', label: '2. Multi-Agent Root Cause & Semantic Context Inference', score: 61, violations: 8 },
    { name: 'REPAIR', label: '3. Multi-Agent Patch Synthesis (8 WCAG Rules)', score: 78, violations: 4 },
    { name: 'TEST', label: '4. Isolated Sandbox Execution & Regression Suite', score: 92, violations: 1 },
    { name: 'PROVE', label: '5. Machine-Checkable Invariant Contract Verification', score: 100, violations: 0 },
    { name: 'DEPLOY', label: '6. Zero-Trust Conformance Gate: ALL CHECKS PASS', score: 100, violations: 0 },
  ];

  const handleStartFullDemo = async () => {
    setIsRunning(true);
    setDemoResult(null);
    setCurrentStep(1);

    // Progressive step simulation for presentation impact
    setTimeout(() => setCurrentStep(2), 900);
    setTimeout(() => setCurrentStep(3), 1800);
    setTimeout(() => setCurrentStep(4), 2700);
    setTimeout(() => setCurrentStep(5), 3600);

    try {
      const data = await runFullDemoCycle();
      setDemoResult(data);
      setCurrentStep(6);
      onRefreshCertificates();

      // Fire victory confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2dd4bf', '#38bdf8', '#818cf8', '#34d399'],
      });
    } catch (err) {
      console.error('Demo execution error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const activeStepData = steps[Math.max(0, currentStep - 1)] || steps[0];

  return (
    <div className="w-full max-w-5xl mx-auto py-8 space-y-8 animate-fadeIn">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-mono uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>FULL CLOSED-LOOP REPAIR DEMO</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          ProofA11y Live Self-Healing Pipeline
        </h1>

        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Execute the complete end-to-end self-healing cycle on an inaccessible web application: Detect $\rightarrow$ Understand $\rightarrow$ Repair $\rightarrow$ Test $\rightarrow$ Prove $\rightarrow$ Deploy.
        </p>

        <div className="pt-2">
          <button
            onClick={handleStartFullDemo}
            disabled={isRunning}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 via-teal-500 to-indigo-500 hover:from-brand-500 hover:to-indigo-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-brand-500/25 transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isRunning ? 'Executing Automated Pipeline...' : 'Start Live Self-Healing Demo'}</span>
          </button>
        </div>
      </div>

      {/* Real-Time Pipeline Progress Indicator */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 bg-[#0d1322] space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">
              Pipeline Stage: {currentStep > 0 ? steps[currentStep - 1]?.name : 'READY'}
            </span>
            <h3 className="text-base font-bold text-white">
              {currentStep > 0 ? steps[currentStep - 1]?.label : 'Click Start Demo to begin automated repair & formal proof'}
            </h3>
          </div>

          <div className="text-right font-mono">
            <div className="text-2xl font-black text-brand-400">
              {currentStep > 0 ? `${activeStepData.score}%` : '61%'}
            </div>
            <div className="text-[10px] uppercase text-slate-500">A11y Score</div>
          </div>
        </div>

        {/* 6 Stage Trackers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {steps.map((st, idx) => {
            const stepNum = idx + 1;
            const isDone = currentStep > stepNum || (currentStep === 6 && stepNum === 6);
            const isCurrent = currentStep === stepNum;

            return (
              <div
                key={st.name}
                className={`p-3.5 rounded-xl border text-xs font-mono transition-all ${
                  isDone
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : isCurrent
                    ? 'bg-brand-500/20 border-brand-500/60 text-brand-300 shadow-md shadow-brand-500/20'
                    : 'bg-[#080c16] border-white/5 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-[10px]">0{stepNum}</span>
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping"></span>
                  ) : null}
                </div>
                <div className="font-bold">{st.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Verification Summary Banner */}
      {demoResult && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/40 bg-gradient-to-br from-[#0c1626] via-[#0d1f33] to-[#0a1422] space-y-6 shadow-2xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% CONFORMANCE ACHIEVED</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                All 8 WCAG Violations Perfectly Repaired & Verified!
              </h2>
            </div>

            <button
              onClick={() => setActiveTab('certificates')}
              className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>Inspect Proof Registry ({demoResult.certificates.length} Certs)</span>
            </button>
          </div>

          {/* 4 Score Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="text-slate-500">Initial Score</div>
              <div className="text-rose-400 text-xl font-black">61% (8 Violations)</div>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="text-slate-500">Final Health Score</div>
              <div className="text-emerald-400 text-xl font-black">100% (0 Violations)</div>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="text-slate-500">Verified Repairs</div>
              <div className="text-cyan-400 text-xl font-black">8 of 8 Patches</div>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="text-slate-500">Conformance Gate</div>
              <div className="text-emerald-400 text-xl font-black">AUTHORIZED</div>
            </div>
          </div>

          {/* Repaired Rules List */}
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider font-mono">
              Verified Proof Contracts Issued:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {demoResult.repairs.map((r: any, idx: number) => (
                <div key={idx} className="p-2.5 rounded-lg bg-[#080c16] border border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-slate-200">{r.violation.id}</span>
                  </div>
                  <span className="text-[10px] text-indigo-400">{r.certificate.certificateId}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
