import React from 'react';
import { AlertOctagon, AlertTriangle, AlertCircle, Info, Filter } from 'lucide-react';
import { SeverityBreakdown } from '../types';

interface SeverityStatsProps {
  severityBreakdown: SeverityBreakdown;
  activeFilter: 'all' | 'critical' | 'serious' | 'moderate' | 'minor';
  onFilterChange: (filter: 'all' | 'critical' | 'serious' | 'moderate' | 'minor') => void;
  totalViolations: number;
}

export const SeverityStats: React.FC<SeverityStatsProps> = ({
  severityBreakdown,
  activeFilter,
  onFilterChange,
  totalViolations,
}) => {
  const categories = [
    {
      id: 'critical' as const,
      label: 'Critical',
      count: severityBreakdown.critical,
      icon: AlertOctagon,
      textColor: 'text-red-400',
      badgeBg: 'bg-red-500/10 border-red-500/30',
      activeStyle: 'bg-red-500/20 text-red-300 border-red-500/50',
    },
    {
      id: 'serious' as const,
      label: 'Serious',
      count: severityBreakdown.serious,
      icon: AlertTriangle,
      textColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 border-amber-500/30',
      activeStyle: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
    },
    {
      id: 'moderate' as const,
      label: 'Moderate',
      count: severityBreakdown.moderate,
      icon: AlertCircle,
      textColor: 'text-yellow-300',
      badgeBg: 'bg-yellow-500/10 border-yellow-500/30',
      activeStyle: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    },
    {
      id: 'minor' as const,
      label: 'Minor',
      count: severityBreakdown.minor,
      icon: Info,
      textColor: 'text-sky-300',
      badgeBg: 'bg-sky-500/10 border-sky-500/30',
      activeStyle: 'bg-sky-500/20 text-sky-300 border-sky-500/50',
    },
  ];

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/10 bg-[#0d1322] space-y-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-400" />
          <span className="text-xs uppercase font-bold tracking-wider text-slate-300">
            Severity Breakdown
          </span>
        </div>

        {/* Severity Filter Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              activeFilter === 'all'
                ? 'bg-brand-500/20 text-brand-300 border-brand-500/40 shadow-sm'
                : 'bg-white/5 text-slate-400 hover:text-slate-200 border-transparent hover:bg-white/10'
            }`}
          >
            All ({totalViolations})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
                activeFilter === cat.id
                  ? cat.activeStyle
                  : 'bg-white/5 text-slate-400 hover:text-slate-200 border-transparent hover:bg-white/10'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`font-mono text-[11px] font-bold ${cat.textColor}`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Severity Counters Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              onClick={() => onFilterChange(cat.id)}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${cat.badgeBg}`}
            >
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase">
                  {cat.label}
                </div>
                <div className={`text-xl font-black font-mono mt-0.5 ${cat.textColor}`}>
                  {cat.count}
                </div>
              </div>
              <Icon className={`w-5 h-5 ${cat.textColor} opacity-80`} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
