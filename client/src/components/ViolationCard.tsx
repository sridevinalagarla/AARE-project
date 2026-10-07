import React, { useState } from 'react';
import { ChevronRight, ChevronDown, ChevronUp, AlertOctagon, AlertTriangle, AlertCircle, Info, Layers, BookOpen, Code2, Target } from 'lucide-react';
import { AccessibilityViolation, ImpactLevel } from '../types';

interface ViolationCardProps {
  violation: AccessibilityViolation;
  onSelect: (violation: AccessibilityViolation) => void;
}

export const getImpactBadge = (impact: ImpactLevel) => {
  switch (impact) {
    case 'critical':
      return {
        label: 'CRITICAL',
        color: 'text-red-400 bg-red-500/15 border-red-500/30',
        icon: AlertOctagon,
      };
    case 'serious':
      return {
        label: 'SERIOUS',
        color: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
        icon: AlertTriangle,
      };
    case 'moderate':
      return {
        label: 'MODERATE',
        color: 'text-yellow-300 bg-yellow-500/15 border-yellow-500/30',
        icon: AlertCircle,
      };
    case 'minor':
    default:
      return {
        label: 'MINOR',
        color: 'text-sky-300 bg-sky-500/15 border-sky-500/30',
        icon: Info,
      };
  }
};

export const ViolationCard: React.FC<ViolationCardProps> = ({ violation, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const badge = getImpactBadge(violation.impact);
  const Icon = badge.icon;
  const elementCount = violation.nodes?.length || 0;

  return (
    <div className="glass-panel glass-panel-hover rounded-xl p-5 border border-white/10 transition-all bg-[#0d1322]">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        
        {/* Violation Info */}
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {/* Severity Pill */}
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase border font-mono ${badge.color}`}>
              <Icon className="w-3 h-3" />
              <span>{badge.label}</span>
            </span>

            {/* Rule ID */}
            <span className="font-mono text-xs font-semibold text-brand-300 bg-[#080c16] px-2.5 py-0.5 rounded border border-white/10">
              {violation.id}
            </span>

            {/* WCAG Badges */}
            {violation.wcagCriteria?.map((criterion) => (
              <span
                key={criterion.id}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded"
              >
                <BookOpen className="w-3 h-3 text-indigo-400" />
                <span>WCAG {criterion.id}</span>
              </span>
            ))}
          </div>

          {/* Help Title */}
          <h3 className="text-base font-bold text-white tracking-tight">
            {violation.help}
          </h3>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {violation.description}
          </p>

          {/* Affected Elements Counter */}
          <div className="flex items-center gap-4 pt-1 text-xs text-slate-400 font-mono">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 text-brand-300 hover:text-brand-200 font-semibold cursor-pointer underline-offset-2 hover:underline"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{elementCount} affected {elementCount === 1 ? 'element' : 'elements'}</span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 flex items-center self-end sm:self-center gap-2">
          <button
            onClick={() => onSelect(violation)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-brand-500/20 text-slate-200 hover:text-brand-300 border border-white/10 hover:border-brand-500/40 text-xs font-semibold transition-all cursor-pointer group"
          >
            <span>View Details</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

      </div>

      {/* Inline Expandable Affected Elements Accordion */}
      {isExpanded && violation.nodes && violation.nodes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5 space-y-3 animate-fadeIn">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span>Affected Elements ({elementCount})</span>
          </div>

          <div className="space-y-2.5">
            {violation.nodes.map((node, nIdx) => (
              <div
                key={nIdx}
                className="p-3 rounded-lg bg-[#080c16] border border-white/5 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between text-slate-400 font-mono">
                  <span className="font-bold text-slate-300">▼ Element {nIdx + 1}</span>
                  <span className="text-[11px] text-brand-400/90 truncate max-w-xs">{node.target.join(' > ')}</span>
                </div>

                {/* HTML */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                    <Code2 className="w-3 h-3" /> HTML:
                  </span>
                  <div className="p-2 rounded bg-black/50 border border-white/5 font-mono text-emerald-300 text-[11px] overflow-x-auto whitespace-pre-wrap break-all">
                    {node.html}
                  </div>
                </div>

                {/* Target */}
                <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                  <span className="font-bold text-slate-500 flex items-center gap-1">
                    <Target className="w-3 h-3" /> Target:
                  </span>
                  <span className="text-amber-300/90">{node.target.join(', ')}</span>
                </div>

                {/* Failure */}
                {node.failureSummary && (
                  <div className="space-y-0.5 text-rose-300/90 font-mono text-[11px] bg-rose-500/10 p-2 rounded border border-rose-500/20">
                    <span className="font-bold text-rose-400">Failure: </span>
                    <span>{node.failureSummary}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
