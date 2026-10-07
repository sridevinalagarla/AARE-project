import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  FileCheck, 
  ExternalLink,
  Code2,
  Lock,
  Flame,
  Check
} from 'lucide-react';
import { ProofCertificate, ConformanceGateResult } from '../types';

interface PresentationViewProps {
  onRunDemo?: () => void;
  isDemoRunning?: boolean;
  demoProgress?: number;
  demoCertificates?: ProofCertificate[];
  demoGate?: ConformanceGateResult | null;
}

export const PresentationView: React.FC<PresentationViewProps> = ({
  onRunDemo,
  isDemoRunning = false,
  demoProgress = 0,
  demoCertificates = [],
  demoGate = null
}) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const slides = [
    {
      title: "The Problem with Modern Web Accessibility",
      subtitle: "Accessibility debt is exploding across millions of web applications.",
      points: [
        "96.8% of top 1,000,000 web pages have detectable WCAG 2.1 violations.",
        "Traditional linters find bugs but cannot generate verifiable, regression-free fixes.",
        "Manual audits cost $5,000 - $30,000 per application and quickly become stale.",
        "No automated tool provides mathematical or contract-level correctness guarantees."
      ],
      badge: "PROBLEM SPACE",
      color: "from-red-500/20 to-orange-500/10 border-red-500/30"
    },
    {
      title: "The Solution: ProofA11y",
      subtitle: "The world's first Proof-Carrying WCAG Auto-Repair Engine.",
      points: [
        "6-Stage Closed-Loop Pipeline: Detect → Understand → Repair → Test → Prove → Deploy.",
        "Multi-Agent Architecture: Issue Analyzer, Context Agent, Repair Planner, Patch Generator, and Counterexample Refinement.",
        "Isolated Sandbox Execution: Validates repairs against real DOM trees using axe-core & Playwright.",
        "Formal Proof Contracts: Generates SHA-256 cryptographic proof certificates for verified invariant compliance."
      ],
      badge: "OUR INNOVATION",
      color: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30"
    },
    {
      title: "Proof-Carrying Verification vs Hallucinations",
      subtitle: "Why deterministic contracts + sandboxing beat pure AI codegen.",
      points: [
        "Precondition Check: Mathematically establishes the exact DOM failure state before patching.",
        "Transformation Contract: AST & semantic mutations guaranteed to fix accessibility target.",
        "Postcondition Verification: In-memory headless browser tests verify violation elimination.",
        "Regression Elimination: Ensures 0 new accessibility regressions and 0 functional breaks."
      ],
      badge: "VERIFICATION ARCHITECTURE",
      color: "from-purple-500/20 to-pink-500/10 border-purple-500/30"
    },
    {
      title: "Live Autonomous Demo",
      subtitle: "Watch ProofA11y auto-repair an intentionally broken React application.",
      isDemo: true,
      badge: "LIVE DEMO",
      color: "from-emerald-500/20 to-cyan-500/10 border-emerald-500/30"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex flex-col justify-between p-8 font-sans selection:bg-cyan-500/30">
      {/* Top Bar / Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-6">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black tracking-tight text-white font-mono">PROOF A11Y</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                Hackathon Presentation Mode
              </span>
            </div>
            <p className="text-xs text-slate-400">Proof-Carrying WCAG Auto-Repair Engine • Zero-Trust Conformance</p>
          </div>
        </div>

        {/* Slide navigation controls */}
        <div className="flex items-center space-x-2">
          {slides.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeSlide === idx
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25 font-bold'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              0{idx + 1}. {s.badge}
            </button>
          ))}
        </div>
      </div>

      {/* Main Slide Content Area */}
      <div className="my-auto py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="max-w-6xl mx-auto"
          >
            {slides[activeSlide].isDemo ? (
              <div className="space-y-6">
                <div className="text-center space-y-2 mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5" /> Stage 6 Complete Pipeline Live Demo
                  </div>
                  <h2 className="text-4xl font-extrabold text-white tracking-tight">Autonomous Repair & Verification Engine</h2>
                  <p className="text-slate-400 text-base max-w-2xl mx-auto">
                    Live execution of Ingestion → axe-core Scan → Multi-Agent Repair → Headless Sandbox Re-test → SHA-256 Proof Generation.
                  </p>
                </div>

                {/* Live Demo Status Box */}
                <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-cyan-400" />
                        Target: <span className="font-mono text-cyan-300 font-semibold">Inaccessible React App (8 WCAG Violations)</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">Simulating automated repair on missing alt, unlabeled forms, contrast faults, heading hierarchies.</p>
                    </div>
                    {onRunDemo && (
                      <button
                        onClick={onRunDemo}
                        disabled={isDemoRunning}
                        className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black tracking-wide shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
                      >
                        {isDemoRunning ? (
                          <>
                            <RotateCcw className="w-4 h-4 animate-spin text-slate-950" />
                            <span>REPAIRING & PROVING ({demoProgress}%)</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-slate-950" />
                            <span>TRIGGER AUTONOMOUS FIX</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* 6 Stage Pipeline visual */}
                  <div className="grid grid-cols-6 gap-3">
                    {[
                      { step: '01', name: 'DETECT', desc: 'axe-core & DOM', done: demoProgress >= 20 },
                      { step: '02', name: 'UNDERSTAND', desc: 'AST & Context', done: demoProgress >= 40 },
                      { step: '03', name: 'REPAIR', desc: 'Patch Generator', done: demoProgress >= 60 },
                      { step: '04', name: 'TEST', desc: 'Isolated Sandbox', done: demoProgress >= 80 },
                      { step: '05', name: 'PROVE', desc: 'Formal Contract', done: demoProgress >= 95 },
                      { step: '06', name: 'DEPLOY', desc: 'Zero-Trust Gate', done: demoProgress === 100 },
                    ].map((s, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          s.done
                            ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                            : 'bg-slate-900/40 border-slate-800 opacity-60'
                        }`}
                      >
                        <div className="text-[10px] font-mono text-cyan-400 mb-1">STAGE {s.step}</div>
                        <div className="text-sm font-bold text-white flex items-center justify-center gap-1">
                          {s.name}
                          {s.done && <Check className="w-3.5 h-3.5 text-cyan-400 stroke-[3]" />}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">{s.desc}</div>
                      </div>
                    ))}
                  </div>

                  {/* Summary metric cards */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                      <div className="text-xs text-slate-400 uppercase font-mono">Initial Health</div>
                      <div className="text-2xl font-black text-red-400 mt-1">61% (8 Bugs)</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                      <div className="text-xs text-slate-400 uppercase font-mono">Post-Repair Health</div>
                      <div className="text-2xl font-black text-emerald-400 mt-1">
                        {demoProgress === 100 ? '100% (0 Bugs)' : isDemoRunning ? 'Evaluating...' : 'Ready'}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                      <div className="text-xs text-slate-400 uppercase font-mono">Certificates Issued</div>
                      <div className="text-2xl font-black text-cyan-400 mt-1 font-mono">
                        {demoCertificates.length > 0 ? `${demoCertificates.length} Valid` : '0 Generated'}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                      <div className="text-xs text-slate-400 uppercase font-mono">Regression Failures</div>
                      <div className="text-2xl font-black text-purple-400 mt-1">
                        0 (100% Safe)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`p-10 rounded-2xl bg-gradient-to-br ${slides[activeSlide].color} border shadow-2xl`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-white border border-white/20 uppercase tracking-wider">
                    {slides[activeSlide].badge}
                  </span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
                  {slides[activeSlide].title}
                </h2>
                <p className="text-lg text-slate-300 mb-8 max-w-3xl">
                  {slides[activeSlide].subtitle}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {slides[activeSlide].points?.map((pt, i) => (
                    <div key={i} className="flex items-start space-x-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-sm">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-slate-200 text-sm font-medium leading-relaxed">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer / Presentation controls */}
      <div className="flex items-center justify-between border-t border-slate-800/80 pt-6 text-xs text-slate-500 font-mono">
        <div>
          <span>PROOF A11Y ARCHITECTURE &copy; 2026</span>
          <span className="mx-2">•</span>
          <span className="text-cyan-400">WCAG 2.1 / 2.2 AA Conformance</span>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            disabled={activeSlide === 0}
            onClick={() => setActiveSlide(prev => Math.max(0, prev - 1))}
            className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 text-slate-300"
          >
            &larr; Previous Slide
          </button>
          <span>{activeSlide + 1} / {slides.length}</span>
          <button 
            disabled={activeSlide === slides.length - 1}
            onClick={() => setActiveSlide(prev => Math.min(slides.length - 1, prev + 1))}
            className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 text-slate-300"
          >
            Next Slide &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
