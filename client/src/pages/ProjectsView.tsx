import React from 'react';
import {
  FolderGit2,
  Globe,
  Code2,
  CheckCircle2,
  ArrowRight,
  Layers,
  Sparkles,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { ProjectModel } from '../types';
import { NavTab } from '../components/Navbar';

interface ProjectsViewProps {
  projects: ProjectModel[];
  setActiveTab: (tab: NavTab) => void;
  onSelectProject: (proj: ProjectModel) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  setActiveTab,
  onSelectProject,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-2">
            <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>PROJECT INGESTION REPOSITORY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Ingested Projects & Repositories
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Parsed component hierarchies, detected frameworks, and live verification status.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('scan')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ingest New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj) => {
          const scoreColor =
            proj.score >= 90
              ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30'
              : proj.score >= 70
              ? 'text-teal-400 border-teal-500/30 bg-teal-950/30'
              : 'text-amber-400 border-amber-500/30 bg-amber-950/30';

          return (
            <div
              key={proj.projectId}
              className="glass-panel glass-panel-hover rounded-2xl p-5 border border-white/10 bg-[#0d1322] flex flex-col justify-between space-y-4 cursor-pointer transition-all"
              onClick={() => onSelectProject(proj)}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono">
                      {proj.framework}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Pkg: {proj.packageManager}
                    </span>
                  </div>

                  <div className={`px-2.5 py-0.5 rounded-md font-mono text-xs font-bold border ${scoreColor}`}>
                    {proj.score}% Score
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white tracking-tight truncate">
                    {proj.name}
                  </h3>
                  {proj.sourceUrl && (
                    <div className="flex items-center gap-1 text-xs text-brand-300 font-mono truncate mt-0.5">
                      <Globe className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{proj.sourceUrl}</span>
                    </div>
                  )}
                </div>

                {/* File & Component Stats */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                  <div className="p-2 rounded bg-black/40 border border-white/5">
                    <div className="text-xs font-bold text-slate-200">{proj.totalFiles}</div>
                    <div className="text-[9px] uppercase text-slate-500">Files</div>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-white/5">
                    <div className="text-xs font-bold text-slate-200">{proj.componentsCount}</div>
                    <div className="text-[9px] uppercase text-slate-500">Components</div>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-white/5">
                    <div className="text-xs font-bold text-slate-200">{proj.routesCount}</div>
                    <div className="text-[9px] uppercase text-slate-500">Routes</div>
                  </div>
                </div>
              </div>

              {/* Pipeline State Footer */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="font-mono text-emerald-400">●</span>
                  <span>Pipeline: <strong className="text-slate-200">{proj.pipelineState}</strong></span>
                </div>

                <div className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-brand-300 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
