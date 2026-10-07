import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  AlertCircle,
  Info,
  BookOpen,
  Search,
  Filter,
  Wrench,
  Code2,
  Target,
  Sparkles,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { AccessibilityViolation, ImpactLevel } from '../types';
import { getImpactBadge } from '../components/ViolationCard';

interface ViolationsViewProps {
  violations?: AccessibilityViolation[];
  onSelectViolationForRepair?: (violation: AccessibilityViolation) => void;
  onAnalyzeViolation?: (violation: AccessibilityViolation) => void;
  // Alternative prop names for compatibility
  project?: any;
  onSelectViolation?: (violation: AccessibilityViolation) => void;
  onInspectViolation?: (violation: AccessibilityViolation) => void;
  onSwitchToScan?: () => void;
}

export const ViolationsView: React.FC<ViolationsViewProps> = ({
  violations = [],
  onSelectViolationForRepair,
  onAnalyzeViolation,
  project,
  onSelectViolation,
  onInspectViolation,
  onSwitchToScan,
}) => {
  const activeViolations = project?.violations || violations;
  const handleSelect = onSelectViolationForRepair || onSelectViolation || (() => {});
  const handleAnalyze = onAnalyzeViolation || onInspectViolation || (() => {});

  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'serious' | 'moderate' | 'minor'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = activeViolations.filter((v: AccessibilityViolation) => {
    if (severityFilter !== 'all' && v.impact !== severityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesId = v.id.toLowerCase().includes(q);
      const matchesHelp = v.help.toLowerCase().includes(q);
      const matchesDesc = v.description.toLowerCase().includes(q);
      const matchesWcag = v.wcagCriteria?.some((c: any) => c.id.includes(q) || c.name.toLowerCase().includes(q));
      return matchesId || matchesHelp || matchesDesc || matchesWcag;
    }
    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono uppercase tracking-wider mb-2">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            <span>ACCESSIBILITY OBSERVATION & DIAGNOSTICS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Detected WCAG Violations ({activeViolations.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Machine-analyzed WCAG 2.1 & 2.2 criteria violations extracted from live DOM and AST trees.
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#0d1322] p-4 rounded-2xl border border-white/10">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search violations by rule ID, WCAG criterion, HTML..."
            className="w-full bg-[#080c16] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50 font-mono"
          />
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            <span>Filter:</span>
          </span>
          {(['all', 'critical', 'serious', 'moderate', 'minor'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                severityFilter === sev
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-transparent'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Violations Explorer List */}
      <div className="space-y-4">
        {filtered.map((violation: AccessibilityViolation) => {
          const badge = getImpactBadge(violation.impact);
          const Icon = badge.icon;
          const node = violation.nodes[0] || { html: '<element>', target: [] };

          return (
            <div
              key={violation.id}
              className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10 bg-[#0d1322] space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase border font-mono ${badge.color}`}>
                      <Icon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>

                    <span className="font-mono text-xs font-bold text-brand-300 bg-[#080c16] px-2.5 py-0.5 rounded border border-white/10">
                      {violation.id}
                    </span>

                    {violation.wcagCriteria?.map((criterion: any) => (
                      <span
                        key={criterion.id}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded"
                      >
                        <BookOpen className="w-3 h-3 text-indigo-400" />
                        <span>WCAG {criterion.id} ({criterion.level})</span>
                      </span>
                    ))}
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight">
                    {violation.help}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {violation.description}
                  </p>
                </div>

                {/* Multi-Agent Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                  <button
                    onClick={() => handleSelect(violation)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-teal-500 hover:from-brand-500 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Generate Repair</span>
                  </button>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="p-3.5 rounded-xl bg-[#080c16] border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1 text-brand-300">
                    <Target className="w-3.5 h-3.5" /> Target: {node.target.join(', ') || 'Element'}
                  </span>
                  <span>{violation.nodes.length} affected node(s)</span>
                </div>
                <div className="font-mono text-xs text-emerald-300 p-2.5 rounded bg-black/50 border border-white/5 overflow-x-auto whitespace-pre-wrap break-all">
                  {node.html}
                </div>
                {node.failureSummary && (
                  <div className="text-[11px] font-mono text-rose-300/90 bg-rose-500/10 p-2 rounded border border-rose-500/20">
                    {node.failureSummary}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="glass-panel rounded-2xl p-12 text-center space-y-2 border border-white/10 bg-[#0d1322]">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">No violations in current filter</h3>
            <p className="text-xs text-slate-400">All matching criteria pass automated verification.</p>
          </div>
        )}
      </div>

    </div>
  );
};
