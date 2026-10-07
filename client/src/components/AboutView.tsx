import React from 'react';
import { ShieldCheck, Cpu, Code2, Server, Globe, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-mono uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
          <span>AccessFix AI Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Module 1: URL Accessibility Scanner
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Automated WCAG 2.1 & 2.2 accessibility scanning engine powered by Playwright headless automation and Deque axe-core.
        </p>
      </div>

      {/* Mandatory Limitation Notice Box */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm leading-relaxed space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Important Technical Limitation</span>
        </div>
        <p>
          Automated accessibility testing cannot detect every possible accessibility issue. AccessFix AI currently uses axe-core and browser-based analysis to identify a supported set of automatically testable accessibility rules. Manual testing is still required for some WCAG criteria.
        </p>
      </div>

      {/* Problem Statement Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-4 border border-white/10">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-400"></span>
          <span>Problem Statement</span>
        </h2>
        <blockquote className="p-4 rounded-xl bg-[#0d1322] border-l-4 border-brand-500 text-slate-300 italic text-sm sm:text-base">
          "Automated Accessibility Repair Engine That Detects and Perfectly Fixes Every WCAG Violation With Formal Correctness Guarantees."
        </blockquote>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Millions of websites remain inaccessible to individuals with disabilities due to missing alt text, poor color contrast, unlabeled interactive controls, and broken document landmarks. Module 1 establishes the rock-solid scanner foundation that feeds verified violation AST nodes to downstream analysis.
        </p>
      </div>

      {/* Architecture Flow */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6 border border-white/10">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-brand-400" />
          <span>Module 1 Architecture Flow</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
          <div className="p-3 rounded-lg bg-[#0d1322] border border-white/5 space-y-1">
            <Globe className="w-4 h-4 mx-auto text-brand-400" />
            <div className="font-bold text-slate-200">1. User Input</div>
            <div className="text-[10px] text-slate-500">URL & SSRF Filter</div>
          </div>
          <div className="p-3 rounded-lg bg-[#0d1322] border border-white/5 space-y-1">
            <Server className="w-4 h-4 mx-auto text-cyan-400" />
            <div className="font-bold text-slate-200">2. Express API</div>
            <div className="text-[10px] text-slate-500">Node.js + TS</div>
          </div>
          <div className="p-3 rounded-lg bg-[#0d1322] border border-white/5 space-y-1">
            <Cpu className="w-4 h-4 mx-auto text-indigo-400" />
            <div className="font-bold text-slate-200">3. Playwright</div>
            <div className="text-[10px] text-slate-500">Headless Chromium</div>
          </div>
          <div className="p-3 rounded-lg bg-[#0d1322] border border-white/5 space-y-1">
            <Code2 className="w-4 h-4 mx-auto text-teal-400" />
            <div className="font-bold text-slate-200">4. axe-core</div>
            <div className="text-[10px] text-slate-500">WCAG Rule Engine</div>
          </div>
          <div className="p-3 rounded-lg bg-[#0d1322] border border-white/5 space-y-1">
            <ShieldCheck className="w-4 h-4 mx-auto text-emerald-400" />
            <div className="font-bold text-slate-200">5. Dashboard</div>
            <div className="text-[10px] text-slate-500">React + Tailwind</div>
          </div>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-[#0d1322] border border-white/10 space-y-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Code2 className="w-4 h-4 text-brand-400" />
            <span>Frontend Stack</span>
          </h3>
          <ul className="text-xs text-slate-300 space-y-2">
            <li className="flex items-center gap-2">✓ React 18 + TypeScript</li>
            <li className="flex items-center gap-2">✓ Vite for ultra-fast HMR and bundling</li>
            <li className="flex items-center gap-2">✓ Tailwind CSS + Glassmorphism design tokens</li>
            <li className="flex items-center gap-2">✓ Lucide React Developer Icons</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d1322] border border-white/10 space-y-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>Backend & Engine Stack</span>
          </h3>
          <ul className="text-xs text-slate-300 space-y-2">
            <li className="flex items-center gap-2">✓ Node.js + Express + TypeScript</li>
            <li className="flex items-center gap-2">✓ Playwright Chromium browser automation</li>
            <li className="flex items-center gap-2">✓ axe-core WCAG analysis injection</li>
            <li className="flex items-center gap-2">✓ Multi-tiered SSRF protection & Rate limiting</li>
          </ul>
        </div>
      </div>

    </div>
  );
};
