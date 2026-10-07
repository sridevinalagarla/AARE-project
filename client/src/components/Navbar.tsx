import React from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  Search,
  FolderGit2,
  AlertOctagon,
  Wrench,
  CheckCircle2,
  Award,
  Layers,
  Sparkles,
  Presentation,
  Settings,
  Play,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'scan'
  | 'projects'
  | 'violations'
  | 'repairs'
  | 'verification'
  | 'certificates'
  | 'architecture'
  | 'demo'
  | 'presentation'
  | 'settings';

export type TabType = NavTab;

export interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onRunDemo?: () => void;
  violationsCount?: number;
  violationCount?: number;
  certificatesCount?: number;
  certificateCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onRunDemo,
  violationsCount,
  violationCount = 0,
  certificatesCount,
  certificateCount = 0,
}) => {
  const vCount = violationsCount ?? violationCount;
  const cCount = certificatesCount ?? certificateCount;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#080c14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Header */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-cyan-400 to-indigo-500 p-[1px] shadow-lg shadow-brand-500/20">
            <div className="w-full h-full bg-[#0c1220] rounded-[11px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-brand-400 transition-transform group-hover:scale-110" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wider text-white font-mono">
                PROOF<span className="text-brand-400">A11Y</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                PROVE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wide font-mono hidden sm:block">
              Proof-Carrying WCAG Auto-Repair Engine
            </p>
          </div>
        </div>

        {/* Center Nav Scrollable */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('scan')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
              activeTab === 'scan'
                ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Scan & Ingest</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Projects</span>
          </button>

          <button
            onClick={() => setActiveTab('violations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
              activeTab === 'violations'
                ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            <span>Violations</span>
            {vCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-mono">
                {vCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('repairs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
              activeTab === 'repairs'
                ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span>Repairs</span>
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
              activeTab === 'verification'
                ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verification</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
              activeTab === 'certificates'
                ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span>Proof Registry</span>
            {cCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                {cCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('presentation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
              activeTab === 'presentation'
                ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Presentation className="w-3.5 h-3.5 text-purple-400" />
            <span>Presentation</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`p-1.5 rounded-lg text-xs transition-all shrink-0 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
            title="Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </nav>

        {/* Quick Action: Run Full Demo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setActiveTab('demo');
              onRunDemo?.();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-brand-500 via-teal-500 to-indigo-500 hover:from-brand-400 hover:to-indigo-400 text-slate-950 font-bold text-xs shadow-md shadow-brand-500/25 transition-all cursor-pointer animate-pulse-subtle"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Full Demo</span>
          </button>
        </div>

      </div>
    </header>
  );
};
