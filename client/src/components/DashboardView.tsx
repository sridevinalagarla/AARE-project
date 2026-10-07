import React from 'react';
import { Search, Play, History, ArrowRight, ShieldCheck, CheckCircle2, AlertOctagon, Sparkles, Layers } from 'lucide-react';
import { ScanHistoryItem, ScanResult } from '../types';

interface DashboardViewProps {
  history: ScanHistoryItem[];
  onStartScan: () => void;
  onDemoScan: () => void;
  onSelectScan: (result: ScanResult) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  history,
  onStartScan,
  onDemoScan,
  onSelectScan,
}) => {
  const totalScans = history.length;
  const avgScore = totalScans > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / totalScans) 
    : 0;

  return (
    <div className="w-full max-w-5xl mx-auto py-8 space-y-8">
      
      {/* Hero Card */}
      <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-white/10 relative overflow-hidden bg-gradient-to-br from-[#0d1322] via-[#10172a] to-[#0d1322]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Automated Accessibility Repair Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Next-Gen WCAG <span className="cyber-gradient-text">Accessibility Scanner</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Scan any live URL to detect WCAG 2.1 & 2.2 accessibility barriers in real-time. Identify missing alt text, contrast violations, broken ARIA roles, and form labels with deep DOM inspection.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={onStartScan}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-teal-400 hover:from-brand-400 hover:to-teal-300 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-brand-500/20 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Scan Website</span>
            </button>

            <button
              onClick={onDemoScan}
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current text-indigo-400" />
              <span>Run Interactive Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
            <span>Total Audits</span>
            <History className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white">
            {totalScans}
          </div>
          <p className="text-[11px] text-slate-500">Recorded in local cache</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
            <span>Average Health Score</span>
            <ShieldCheck className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-black font-mono text-teal-400">
            {totalScans > 0 ? `${avgScore}%` : '—'}
          </div>
          <p className="text-[11px] text-slate-500">Across scanned domains</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-semibold">
            <span>Automated Engine</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-base font-bold text-white pt-1">
            Playwright + axe-core
          </div>
          <p className="text-[11px] text-slate-500">WCAG 2.1 / 2.2 A & AA</p>
        </div>
      </div>

      {/* Recent Scans preview if any */}
      {history.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-brand-400" />
              <span>Recent Scans</span>
            </h3>
          </div>

          <div className="space-y-2.5">
            {history.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectScan(item.resultData)}
                className="glass-panel glass-panel-hover rounded-xl p-4 border border-white/10 flex items-center justify-between gap-4 cursor-pointer transition-all"
              >
                <div className="space-y-1 min-w-0">
                  <div className="font-mono text-xs sm:text-sm font-semibold text-brand-300 truncate">
                    {item.url}
                  </div>
                  <div className="text-xs text-slate-400">
                    <span className="text-rose-400 font-semibold">{item.totalViolations} violations</span> • {new Date(item.timestamp).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
                    {item.score}%
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
