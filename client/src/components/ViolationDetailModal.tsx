import React, { useState } from 'react';
import { X, ExternalLink, Code2, Target, AlertTriangle, Copy, Check, ChevronDown, ChevronUp, BookOpen, Layers } from 'lucide-react';
import { AccessibilityViolation } from '../types';
import { getImpactBadge } from './ViolationCard';

interface ViolationDetailModalProps {
  violation: AccessibilityViolation | null;
  onClose: () => void;
}

export const ViolationDetailModal: React.FC<ViolationDetailModalProps> = ({ violation, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [collapsedNodes, setCollapsedNodes] = useState<Record<number, boolean>>({});

  if (!violation) return null;

  const badge = getImpactBadge(violation.impact);
  const Icon = badge.icon;
  const nodes = violation.nodes || [];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleNodeCollapse = (idx: number) => {
    setCollapsedNodes(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#0d1322] border border-white/15 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-[#101728]">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {/* Severity Pill */}
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold font-mono tracking-wider uppercase border ${badge.color}`}>
                <Icon className="w-3.5 h-3.5" />
                <span>{badge.label}</span>
              </span>

              {/* Rule ID */}
              <span className="font-mono text-xs font-bold text-brand-300 bg-[#0a0d14] px-2.5 py-0.5 rounded border border-white/10">
                {violation.id}
              </span>

              {/* WCAG Badges */}
              {violation.wcagCriteria?.map((criterion) => (
                <a
                  key={criterion.id}
                  href={criterion.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-0.5 rounded hover:bg-indigo-500/25 transition-colors"
                >
                  <BookOpen className="w-3 h-3 text-indigo-400" />
                  <span>WCAG {criterion.id} — {criterion.name} ({criterion.level})</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              ))}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {violation.help}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          
          {/* Rule Description & Guidance Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 p-4 rounded-xl bg-[#0a0d14] border border-white/5 space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Rule Description
              </span>
              <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                {violation.description}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0a0d14] border border-white/5 flex flex-col justify-between gap-3">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                WCAG & Engine Guidance
              </span>
              <a
                href={violation.helpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-brand-500/15 hover:bg-brand-500/25 border border-brand-500/30 text-brand-300 font-semibold text-xs transition-colors"
              >
                <span>View WCAG Guidance</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Affected Elements Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-400" />
                <h3 className="font-bold text-white text-base">
                  Affected Elements ({nodes.length})
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                DOM nodes failing automated check
              </span>
            </div>

            {/* Nodes List */}
            <div className="space-y-4">
              {nodes.map((node, idx) => {
                const isCollapsed = !!collapsedNodes[idx];

                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/10 bg-[#0a0d14] overflow-hidden"
                  >
                    {/* Node Header Accordion */}
                    <div 
                      onClick={() => toggleNodeCollapse(idx)}
                      className="p-3.5 bg-[#12192c] flex items-center justify-between cursor-pointer hover:bg-[#161f36] transition-colors border-b border-white/5"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 text-xs font-mono font-bold">
                          #{idx + 1}
                        </span>
                        <span className="font-mono text-xs text-slate-300 truncate max-w-xs sm:max-w-md">
                          {node.target.join(' > ') || 'Target element'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">
                          {isCollapsed ? 'Expand' : 'Collapse'}
                        </span>
                        {isCollapsed ? (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Node Details Body */}
                    {!isCollapsed && (
                      <div className="p-4 space-y-4">
                        
                        {/* Target Selector */}
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            <Target className="w-3.5 h-3.5 text-brand-400" />
                            <span>Target Selector</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-[#070a10] border border-white/5 font-mono text-xs text-amber-300 break-all select-all">
                            {node.target.join(', ')}
                          </div>
                        </div>

                        {/* Affected HTML Snippet */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              <Code2 className="w-3.5 h-3.5 text-brand-400" />
                              <span>Affected HTML Source</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleCopy(node.html, idx)}
                              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                            >
                              {copiedIndex === idx ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy HTML</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="p-3 rounded-lg bg-[#070a10] border border-white/5 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                            {node.html}
                          </div>
                        </div>

                        {/* Failure Summary */}
                        {node.failureSummary && (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 uppercase tracking-wider">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                              <span>Failure Summary</span>
                            </div>
                            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 font-mono whitespace-pre-wrap leading-relaxed">
                              {node.failureSummary}
                            </div>
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-[#101728] flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Rule engine: <span className="font-mono text-slate-300">axe-core</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};
