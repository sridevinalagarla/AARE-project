import React, { useState } from 'react';
import { Globe, Sparkles, AlertCircle, ArrowRight, Play, Cpu, ShieldCheck } from 'lucide-react';

interface UrlInputSectionProps {
  onScan: (url: string) => void;
  onDemoScan: () => void;
  isLoading: boolean;
  initialUrl?: string;
}

export const UrlInputSection: React.FC<UrlInputSectionProps> = ({
  onScan,
  onDemoScan,
  isLoading,
  initialUrl = '',
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleValidateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setErrorMessage('Please enter a valid public website URL.');
      return;
    }

    // Comprehensive URL validation
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})+)(:[0-9]{1,5})?(\/.*)?$/i;
    
    if (!urlPattern.test(trimmed)) {
      setErrorMessage('Please enter a valid public website URL.');
      return;
    }

    // Reject localhost, 127.0.0.1, private IPs on frontend before firing
    const lower = trimmed.toLowerCase();
    if (
      lower.includes('localhost') ||
      lower.includes('127.0.0.1') ||
      lower.includes('0.0.0.0') ||
      lower.startsWith('file://')
    ) {
      setErrorMessage('Please enter a valid public website URL.');
      return;
    }

    let finalUrl = trimmed;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }

    onScan(finalUrl);
  };

  const handleQuickUrl = (sampleUrl: string) => {
    setUrl(sampleUrl);
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-10 sm:py-14">
      {/* Centered Hero Heading */}
      <div className="text-center space-y-4 mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-mono uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>ACCESSFIX AI SCANNER</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Find accessibility barriers <br className="hidden sm:inline" />
          <span className="cyber-gradient-text">before your users do.</span>
        </h1>
        
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Scan your website for WCAG accessibility issues and identify barriers that may prevent people from using your product.
        </p>
      </div>

      {/* Main Scan Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 relative overflow-hidden bg-[#0d1322]/90">
        <div className="space-y-4">
          
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase font-bold tracking-wider text-slate-300 flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-400" />
              <span>Target Website</span>
            </label>
            <span className="text-[11px] text-slate-500 font-mono">
              Public HTTP / HTTPS URL
            </span>
          </div>

          <form onSubmit={handleValidateAndSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Globe className="w-5 h-5" />
              </div>

              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="https://example.com"
                disabled={isLoading}
                className={`w-full pl-12 pr-36 py-4 bg-[#080c16] rounded-xl text-white placeholder-slate-500 text-sm sm:text-base border transition-all focus:outline-none focus:ring-2 font-mono ${
                  errorMessage
                    ? 'border-rose-500/70 focus:ring-rose-500/30'
                    : 'border-white/10 focus:border-brand-500/50 focus:ring-brand-500/20'
                }`}
              />

              <div className="absolute inset-y-1.5 right-1.5 flex items-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-full px-5 rounded-lg bg-gradient-to-r from-brand-600 to-teal-500 hover:from-brand-500 hover:to-teal-400 text-slate-950 font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>{isLoading ? 'Scanning...' : 'Scan Website'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Validation Error Message */}
            {errorMessage && (
              <div className="flex items-center gap-2 text-rose-400 text-xs sm:text-sm bg-rose-500/10 border border-rose-500/20 px-3.5 py-2.5 rounded-lg animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Quick Demo & Example Prompts */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-500">Try public URLs:</span>
                <button
                  type="button"
                  onClick={() => handleQuickUrl('https://example.com')}
                  className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 font-mono transition-colors cursor-pointer"
                >
                  example.com
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickUrl('https://www.rvit.edu.in/')}
                  className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 font-mono transition-colors cursor-pointer"
                >
                  rvit.edu.in
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickUrl('https://www.w3.org')}
                  className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 font-mono transition-colors cursor-pointer"
                >
                  w3.org
                </button>
              </div>

              <button
                type="button"
                onClick={onDemoScan}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 transition-colors font-medium cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Try Demo Website</span>
              </button>
            </div>
          </form>

          {/* Engine Footnotes */}
          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-400" />
              <span>Powered by <strong className="text-slate-200">Playwright + axe-core</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>WCAG 2.2 automated accessibility analysis</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
