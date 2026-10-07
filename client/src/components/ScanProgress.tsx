import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Circle, Globe, Radio, Shield } from 'lucide-react';

interface ScanProgressProps {
  targetUrl: string;
}

interface StepItem {
  id: number;
  label: string;
  minDuration: number;
}

const STAGES: StepItem[] = [
  { id: 1, label: 'URL validated', minDuration: 300 },
  { id: 2, label: 'Browser initialized', minDuration: 800 },
  { id: 3, label: 'Website loaded', minDuration: 1800 },
  { id: 4, label: 'Inspecting accessibility', minDuration: 2800 },
  { id: 5, label: 'Running WCAG rules', minDuration: 3800 },
  { id: 6, label: 'Processing violations', minDuration: 4800 },
  { id: 7, label: 'Generating accessibility report', minDuration: 5600 },
];

export const ScanProgress: React.FC<ScanProgressProps> = ({ targetUrl }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setElapsedMs(elapsed);

      for (let i = STAGES.length - 1; i >= 0; i--) {
        if (elapsed >= STAGES[i].minDuration) {
          setActiveStepIndex(Math.min(i, STAGES.length - 1));
          break;
        }
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto py-12">
      <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl border border-brand-500/20 relative overflow-hidden bg-[#0d1322]/95">
        
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-400 to-transparent animate-pulse"></div>

        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 mb-1">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Scanning Website
          </h2>
          
          <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-mono text-slate-300">
            <span className="text-slate-500">Scanning:</span>
            <span className="text-brand-300 font-semibold truncate max-w-xs sm:max-w-md">
              {targetUrl}
            </span>
          </div>
        </div>

        {/* Stages Checklist */}
        <div className="space-y-3 bg-[#080c16] p-5 rounded-xl border border-white/5">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < activeStepIndex;
            const isCurrent = idx === activeStepIndex;
            const isPending = idx > activeStepIndex;

            return (
              <div
                key={stage.id}
                className={`flex items-center gap-3 text-xs sm:text-sm transition-all duration-200 ${
                  isCompleted
                    ? 'text-slate-200'
                    : isCurrent
                    ? 'text-brand-300 font-medium translate-x-1'
                    : 'text-slate-600'
                }`}
              >
                <div className="shrink-0">
                  {isCompleted && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  {isCurrent && (
                    <Loader2 className="w-4 h-4 text-brand-400 animate-spin" />
                  )}
                  {isPending && (
                    <Circle className="w-4 h-4 text-slate-700" />
                  )}
                </div>

                <span className="truncate">{stage.label}</span>
              </div>
            );
          })}
        </div>

        {/* Elapsed Timer Footer */}
        <div className="mt-6 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-brand-400" />
            <span>Playwright headless execution</span>
          </span>
          <span>{(elapsedMs / 1000).toFixed(1)}s elapsed</span>
        </div>

      </div>
    </div>
  );
};
