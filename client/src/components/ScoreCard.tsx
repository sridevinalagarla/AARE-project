import React from 'react';
import { Globe, ExternalLink, RefreshCw, CheckCircle, ShieldAlert, CheckCircle2, HelpCircle } from 'lucide-react';
import { ScanResult } from '../types';

interface ScoreCardProps {
  result: ScanResult;
  onScanAnother: () => void;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ result, onScanAnother }) => {
  const { score, url, pageTitle, durationMs, violations, passes, incomplete, disclaimer } = result;

  const getScoreColor = (val: number) => {
    if (val >= 90) return { stroke: '#34d399', text: 'text-emerald-400', badge: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' };
    if (val >= 75) return { stroke: '#2dd4bf', text: 'text-teal-400', badge: 'bg-teal-500/15 border-teal-500/30 text-teal-300' };
    if (val >= 50) return { stroke: '#fbbf24', text: 'text-amber-400', badge: 'bg-amber-500/15 border-amber-500/30 text-amber-300' };
    return { stroke: '#f87171', text: 'text-rose-400', badge: 'bg-rose-500/15 border-rose-500/30 text-rose-300' };
  };

  const scoreTheme = getScoreColor(score);
  const circumference = 2 * Math.PI * 38;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Target Website & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0d1322] border border-white/10">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span>SCAN COMPLETED</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ({(durationMs / 1000).toFixed(1)}s scan duration)
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-white truncate">
            <span>{pageTitle || 'Web Accessibility Scan'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-brand-300 truncate">
            <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1 truncate"
            >
              <span>{url}</span>
              <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
            </a>
          </div>
        </div>

        <div className="shrink-0 self-start sm:self-center">
          <button
            onClick={onScanAnother}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-brand-400" />
            <span>Scan Another Website</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 1: Accessibility Health Score */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 flex items-center justify-between gap-4 bg-[#0d1322]">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Health Score
            </span>
            <div className="text-sm font-semibold text-white">
              Accessibility Health Score
            </div>
            <p className="text-[11px] text-slate-500">
              Automated accessibility checks
            </p>
          </div>

          {/* Prominent Circular Gauge */}
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 90 90">
              <circle
                cx="45"
                cy="45"
                r="38"
                fill="transparent"
                stroke="#1f293d"
                strokeWidth="7"
              />
              <circle
                cx="45"
                cy="45"
                r="38"
                fill="transparent"
                stroke={scoreTheme.stroke}
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <span className="absolute text-lg font-black text-white font-mono">
              {score}%
            </span>
          </div>
        </div>

        {/* CARD 2: Total Violations */}
        <div className="glass-panel rounded-2xl p-5 border border-rose-500/20 bg-rose-950/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-rose-300 tracking-wider">
              Total Violations
            </span>
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black font-mono text-rose-400">
              {violations.length}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Automated WCAG failures detected
            </p>
          </div>
        </div>

        {/* CARD 3: Passed Checks */}
        <div className="glass-panel rounded-2xl p-5 border border-emerald-500/20 bg-emerald-950/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-emerald-300 tracking-wider">
              Passed Checks
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black font-mono text-emerald-400">
              {passes.length}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Automated rules verified passing
            </p>
          </div>
        </div>

        {/* CARD 4: Manual Review */}
        <div className="glass-panel rounded-2xl p-5 border border-purple-500/20 bg-purple-950/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-purple-300 tracking-wider">
              Manual Review
            </span>
            <HelpCircle className="w-5 h-5 text-purple-400" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black font-mono text-purple-300">
              {incomplete.length}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Checks requiring human audit
            </p>
          </div>
        </div>

      </div>

      {/* Subtle Explanation Note */}
      <div className="text-xs text-slate-500 italic text-center sm:text-left">
        Score based on automated accessibility checks performed during this scan. Not an official WCAG conformance certification.
      </div>

    </div>
  );
};
