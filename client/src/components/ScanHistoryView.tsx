import React from 'react';
import { History, Globe, Trash2, ArrowRight, Clock, ShieldAlert, CheckCircle } from 'lucide-react';
import { ScanHistoryItem, ScanResult } from '../types';

interface ScanHistoryViewProps {
  history: ScanHistoryItem[];
  onSelectScan: (result: ScanResult) => void;
  onClearHistory: () => void;
  onStartNewScan: () => void;
}

export const ScanHistoryView: React.FC<ScanHistoryViewProps> = ({
  history,
  onSelectScan,
  onClearHistory,
  onStartNewScan,
}) => {
  const formatTime = (ts: string) => {
    try {
      return new Date(ts).toLocaleString();
    } catch {
      return ts;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
    if (score >= 75) return 'text-teal-400 bg-teal-500/15 border-teal-500/30';
    if (score >= 50) return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/15 border-rose-500/30';
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-brand-400" />
            <span>Scan History</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Stored locally in your browser for instant retrieval and re-inspection.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* History Items List */}
      {history.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center space-y-4 border border-white/10">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-500">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No scans recorded yet</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Enter a website URL on the scanner page or try the demo page to generate your first accessibility report.
          </p>
          <button
            onClick={onStartNewScan}
            className="px-5 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Scan a Website Now
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectScan(item.resultData)}
              className="glass-panel glass-panel-hover rounded-xl p-4 sm:p-5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-all"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="font-mono text-xs sm:text-sm font-semibold text-brand-300 truncate">
                    {item.url}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shrink-0">
                    Completed
                  </span>
                </div>

                {item.pageTitle && (
                  <p className="text-xs text-slate-300 truncate pl-6">
                    {item.pageTitle}
                  </p>
                )}

                <div className="flex items-center gap-4 pl-6 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {formatTime(item.timestamp)}
                  </span>
                  <span>
                    <strong className="text-rose-400">{item.totalViolations}</strong> violations ({item.criticalCount} critical)
                  </span>
                </div>
              </div>

              {/* Score and Reopen action */}
              <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                <div className={`px-3 py-1.5 rounded-lg border font-mono text-center ${getScoreColor(item.score)}`}>
                  <div className="text-lg font-black">{item.score}%</div>
                  <div className="text-[9px] uppercase font-bold tracking-wider">Score</div>
                </div>

                <div className="p-2 rounded-lg bg-white/5 hover:bg-brand-500/20 text-slate-400 hover:text-brand-300 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
