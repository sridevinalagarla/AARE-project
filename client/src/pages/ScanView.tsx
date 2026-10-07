import React, { useState } from 'react';
import {
  Globe,
  FolderGit2,
  UploadCloud,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Play,
  CheckCircle2,
  FileCode,
  Layers,
  Cpu,
} from 'lucide-react';
import { ScanProgress } from '../components/ScanProgress';

interface ScanViewProps {
  onScanUrl: (url: string) => void;
  onAnalyzeRepo: (repoUrl: string) => void;
  onDemoScan: () => void;
  isLoading: boolean;
  scanningUrl: string;
  errorMessage: string | null;
  onRetry: () => void;
}

export const ScanView: React.FC<ScanViewProps> = ({
  onScanUrl,
  onAnalyzeRepo,
  onDemoScan,
  isLoading,
  scanningUrl,
  errorMessage,
  onRetry,
}) => {
  const [activeInputMode, setActiveInputMode] = useState<'url' | 'github' | 'upload'>('url');
  const [url, setUrl] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setValidationError('Please enter a valid public website URL.');
      return;
    }

    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})+)(:[0-9]{1,5})?(\/.*)?$/i;
    if (!urlPattern.test(trimmed)) {
      setValidationError('Please enter a valid public website URL.');
      return;
    }

    const lower = trimmed.toLowerCase();
    if (lower.includes('localhost') || lower.includes('127.0.0.1') || lower.startsWith('file://')) {
      setValidationError('Please enter a valid public website URL.');
      return;
    }

    let finalUrl = trimmed;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }

    onScanUrl(finalUrl);
  };

  const handleRepoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmed = repoUrl.trim();
    if (!trimmed || !trimmed.includes('github.com/')) {
      setValidationError('Please enter a valid GitHub repository URL (e.g. https://github.com/facebook/react).');
      return;
    }

    onAnalyzeRepo(trimmed);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-mono uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>USER INPUT & PROJECT INGESTION LAYER</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Start Accessibility Analysis
        </h1>

        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Scan any public URL, connect a GitHub repository, or upload a project package to initiate automated WCAG observation and formal repair planning.
        </p>
      </div>

      {/* Input Mode Selector Tabs */}
      <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-[#0c1220] border border-white/10 max-w-lg mx-auto">
        <button
          onClick={() => {
            setActiveInputMode('url');
            setValidationError(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeInputMode === 'url'
              ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white border border-transparent'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Website URL</span>
        </button>

        <button
          onClick={() => {
            setActiveInputMode('github');
            setValidationError(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeInputMode === 'github'
              ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white border border-transparent'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>GitHub Repository</span>
        </button>

        <button
          onClick={() => {
            setActiveInputMode('upload');
            setValidationError(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeInputMode === 'upload'
              ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white border border-transparent'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Project ZIP</span>
        </button>
      </div>

      {/* Main Scan Form Card */}
      {!isLoading && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 bg-[#0d1322] shadow-2xl relative overflow-hidden">
          
          {/* TAB 1: WEBSITE URL */}
          {activeInputMode === 'url' && (
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-bold tracking-wider text-slate-300 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-brand-400" />
                  <span>Target Website</span>
                </label>
                <p className="text-xs text-slate-500">
                  Enter any live URL to launch headless Playwright browser automation and axe-core analysis.
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Globe className="w-5 h-5" />
                </div>

                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="https://example.com"
                  className="w-full pl-12 pr-36 py-4 bg-[#080c16] rounded-xl text-white placeholder-slate-500 text-sm sm:text-base border border-white/10 focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 font-mono transition-all"
                />

                <div className="absolute inset-y-1.5 right-1.5 flex items-center">
                  <button
                    type="submit"
                    className="h-full px-5 rounded-lg bg-gradient-to-r from-brand-600 via-teal-500 to-indigo-500 hover:from-brand-500 hover:to-indigo-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-brand-500/20 transition-all cursor-pointer"
                  >
                    <span>Scan Website</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Sample Links & Demo Button */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-500">Quick test:</span>
                  <button
                    type="button"
                    onClick={() => setUrl('https://example.com')}
                    className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 font-mono transition-colors cursor-pointer"
                  >
                    example.com
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrl('https://www.rvit.edu.in/')}
                    className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 font-mono transition-colors cursor-pointer"
                  >
                    rvit.edu.in
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onDemoScan}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 transition-colors font-medium cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Try Demo Website</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: GITHUB REPO */}
          {activeInputMode === 'github' && (
            <form onSubmit={handleRepoSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-bold tracking-wider text-slate-300 flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-cyan-400" />
                  <span>GitHub Repository</span>
                </label>
                <p className="text-xs text-slate-500">
                  Connect a repository to parse component AST trees, inspect routes, and prepare automated pull requests.
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <FolderGit2 className="w-5 h-5" />
                </div>

                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => {
                    setRepoUrl(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="https://github.com/nexus-retail/frontend"
                  className="w-full pl-12 pr-40 py-4 bg-[#080c16] rounded-xl text-white placeholder-slate-500 text-sm sm:text-base border border-white/10 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 font-mono transition-all"
                />

                <div className="absolute inset-y-1.5 right-1.5 flex items-center">
                  <button
                    type="submit"
                    className="h-full px-5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                  >
                    <span>Analyze Repo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: PROJECT ZIP UPLOAD */}
          {activeInputMode === 'upload' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-bold tracking-wider text-slate-300 flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-indigo-400" />
                  <span>Project Package Upload</span>
                </label>
                <p className="text-xs text-slate-500">
                  Upload an archived project ZIP file to detect frameworks, components, and package dependencies.
                </p>
              </div>

              <div className="border-2 border-dashed border-white/15 hover:border-indigo-500/50 rounded-2xl p-8 text-center bg-[#080c16] transition-colors cursor-pointer">
                <UploadCloud className="w-10 h-10 text-indigo-400 mx-auto mb-3 animate-bounce" />
                <h4 className="text-sm font-bold text-white mb-1">
                  Drag and drop your project ZIP file here
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  Supports React, Next.js, Vue, Svelte, and static HTML bundles (Max 50MB)
                </p>
                <button
                  type="button"
                  onClick={() => onAnalyzeRepo('https://github.com/proofa11y/demo-react-app')}
                  className="px-4 py-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all cursor-pointer"
                >
                  Or Select Pre-Bundled Demo Package
                </button>
              </div>
            </div>
          )}

          {/* Validation Error Banner */}
          {validationError && (
            <div className="flex items-center gap-2 text-rose-400 text-xs sm:text-sm bg-rose-500/10 border border-rose-500/20 px-3.5 py-2.5 rounded-lg animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Engine Footnotes */}
          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-400" />
              <span>Playwright Isolated Execution + axe-core</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>WCAG 2.1 & 2.2 Automated Analysis</span>
            </div>
          </div>

        </div>
      )}

      {/* Loading Radar Animation */}
      {isLoading && (
        <ScanProgress targetUrl={scanningUrl} />
      )}

      {/* Error State Banner */}
      {errorMessage && !isLoading && (
        <div className="p-6 rounded-2xl bg-[#0d1322] border border-rose-500/30 text-slate-200 space-y-4 shadow-2xl animate-fadeIn">
          <div className="flex items-center gap-2.5 font-bold text-lg text-rose-400">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <span>Unable to scan this website.</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            The website may be unavailable, blocking automated browsers, or taking too long to respond.
          </p>
          <div className="p-3 rounded-lg bg-black/40 border border-rose-500/20 text-xs font-mono text-rose-300 break-all">
            {errorMessage}
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onRetry}
              className="px-4 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              Try Again
            </button>
            <button
              onClick={onDemoScan}
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
            >
              Or scan demo website
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
