import React, { useState } from 'react';
import { CheckCircle2, Search, BookOpen, ExternalLink } from 'lucide-react';
import { AccessibilityPass } from '../types';

interface PassesListProps {
  passes: AccessibilityPass[];
}

export const PassesList: React.FC<PassesListProps> = ({ passes }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = passes.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.id.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.help.toLowerCase().includes(q) ||
      p.wcagCriteria.some((c) => c.id.includes(q) || c.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      {/* Search Filter Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0d1322] p-3 rounded-xl border border-white/5">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-white text-sm">
            Passed Automated Checks ({passes.length})
          </span>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter passed checks..."
            className="w-full bg-[#070a10] border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50"
          />
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((pass) => (
          <div
            key={pass.id}
            className="p-4 rounded-xl bg-[#0d1322]/70 border border-emerald-500/20 flex flex-col justify-between gap-2"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                  ✓ {pass.id}
                </span>

                {pass.nodesCount > 0 && (
                  <span className="text-[11px] text-slate-400 font-mono">
                    {pass.nodesCount} instances verified
                  </span>
                )}
              </div>

              <h4 className="text-sm font-semibold text-slate-100">
                {pass.help || pass.description}
              </h4>

              <p className="text-xs text-slate-400 line-clamp-2">
                {pass.description}
              </p>
            </div>

            {/* WCAG Badges & Doc link */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
              <div className="flex flex-wrap gap-1">
                {pass.wcagCriteria?.slice(0, 2).map((c) => (
                  <span
                    key={c.id}
                    className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-300 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded"
                  >
                    <BookOpen className="w-2.5 h-2.5 text-indigo-400" />
                    <span>WCAG {c.id}</span>
                  </span>
                ))}
              </div>

              {pass.helpUrl && (
                <a
                  href={pass.helpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-slate-400 hover:text-brand-300 inline-flex items-center gap-1"
                >
                  <span>Guidance</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-8 text-xs text-slate-500">
            No passed checks matched your search query.
          </div>
        )}
      </div>
    </div>
  );
};
