import React from 'react';
import { HelpCircle, ExternalLink } from 'lucide-react';
import { AccessibilityIncomplete } from '../types';

interface IncompleteListProps {
  incomplete: AccessibilityIncomplete[];
}

export const IncompleteList: React.FC<IncompleteListProps> = ({ incomplete }) => {
  return (
    <div className="space-y-4">
      {/* Notice Banner */}
      <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-purple-200">
            Manual Review Required ({incomplete.length} checks)
          </h4>
          <p className="text-xs text-purple-300/90 leading-relaxed">
            Some accessibility checks require manual review because automated testing cannot determine the correct result with certainty.
          </p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {incomplete.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-[#0d1322] border border-white/10 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-purple-300 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-500/30">
                  {item.id}
                </span>
                <span className="text-sm font-bold text-white">
                  {item.help}
                </span>
              </div>

              {item.helpUrl && (
                <a
                  href={item.helpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-purple-300 inline-flex items-center gap-1 font-mono"
                >
                  <span>Manual Review Spec</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <p className="text-xs text-slate-400">
              {item.description}
            </p>

            {/* Affected Nodes */}
            {item.nodes && item.nodes.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Elements Requiring Manual Verification ({item.nodes.length}):
                </span>
                {item.nodes.map((node, nIdx) => (
                  <div key={nIdx} className="p-2.5 rounded bg-[#070a10] border border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Target: {node.target.join(', ')}</span>
                    </div>
                    {node.html && (
                      <div className="font-mono text-xs text-purple-200/90 overflow-x-auto whitespace-pre-wrap break-all bg-black/40 p-2 rounded">
                        {node.html}
                      </div>
                    )}
                    {node.failureSummary && (
                      <div className="text-[11px] text-amber-300/80 font-mono">
                        Reason: {node.failureSummary}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {incomplete.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-500">
            No incomplete or ambiguous checks detected on this webpage.
          </div>
        )}
      </div>
    </div>
  );
};
