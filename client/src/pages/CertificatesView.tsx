import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  Download,
  ExternalLink,
  Search,
  CheckCircle2,
  X,
  FileCode,
  Copy,
  Check,
} from 'lucide-react';
import { ProofCertificate } from '../types';

interface CertificatesViewProps {
  certificates: ProofCertificate[];
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({ certificates }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCert, setSelectedCert] = useState<ProofCertificate | null>(null);
  const [copied, setCopied] = useState(false);

  const filtered = certificates.filter((c) => {
    const q = searchTerm.toLowerCase();
    return (
      c.certificateId.toLowerCase().includes(q) ||
      c.ruleId.toLowerCase().includes(q) ||
      c.wcagCriterion.includes(q) ||
      c.projectUrl.toLowerCase().includes(q)
    );
  });

  const handleCopyJson = (cert: ProofCertificate) => {
    navigator.clipboard.writeText(JSON.stringify(cert, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCert = (cert: ProofCertificate) => {
    const blob = new Blob([JSON.stringify(cert, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cert.certificateId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span>CRYPTOGRAPHIC PROOF REGISTRY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Machine-Checkable Proof Certificates ({certificates.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Immutable registry of mathematically verified WCAG repair postconditions and patch hashes.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search certificate ID, rule..."
            className="w-full bg-[#080c16] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>
      </div>

      {/* Registry Table */}
      <div className="glass-panel rounded-2xl border border-white/10 bg-[#0d1322] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#10182c] border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Certificate ID</th>
                <th className="p-4">Project / URL</th>
                <th className="p-4">WCAG Rule</th>
                <th className="p-4">Verification</th>
                <th className="p-4">Certificate Hash</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filtered.map((cert) => (
                <tr
                  key={cert.certificateId}
                  className="hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setSelectedCert(cert)}
                >
                  <td className="p-4 font-bold text-indigo-400">
                    {cert.certificateId}
                  </td>
                  <td className="p-4 truncate max-w-xs text-slate-400">
                    {cert.projectUrl}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
                      {cert.ruleId} (WCAG {cert.wcagCriterion})
                    </span>
                  </td>
                  <td className="p-4 text-emerald-400 font-semibold">
                    ✓ Verified
                  </td>
                  <td className="p-4 text-slate-500 text-[11px] font-mono">
                    {cert.certificateHash.substring(0, 14)}...
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      VALID
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCert(cert);
                      }}
                      className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No proof certificates recorded in registry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Modal Inspector */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#0d1322] border border-white/15 rounded-2xl shadow-2xl p-6 space-y-6 font-mono text-xs">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" />
                <span className="font-bold text-white text-sm">
                  Proof Certificate: {selectedCert.certificateId}
                </span>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 bg-[#080c16] p-4 rounded-xl border border-white/5">
              <div><span className="text-slate-500">Project Target:</span> <span className="text-brand-300">{selectedCert.projectUrl}</span></div>
              <div><span className="text-slate-500">WCAG Criterion:</span> <span className="text-white">{selectedCert.ruleId} (WCAG {selectedCert.wcagCriterion})</span></div>
              <div><span className="text-slate-500">Precondition:</span> <span className="text-slate-300">{selectedCert.precondition}</span></div>
              <div><span className="text-slate-500">Transformation:</span> <span className="text-slate-300">{selectedCert.transformation}</span></div>
              <div><span className="text-slate-500">Postcondition:</span> <span className="text-emerald-400">{selectedCert.postcondition}</span></div>
              <div><span className="text-slate-500">A11y Test:</span> <span className="text-emerald-400 font-bold">{selectedCert.accessibilityTest}</span></div>
              <div><span className="text-slate-500">Regression Test:</span> <span className="text-emerald-400 font-bold">{selectedCert.regressionTest}</span></div>
              <div className="pt-2 border-t border-white/5 space-y-1">
                <div><span className="text-slate-500 text-[10px]">Source Hash:</span> <span className="text-slate-400 text-[10px] break-all">{selectedCert.sourceHash}</span></div>
                <div><span className="text-slate-500 text-[10px]">Patch Hash:</span> <span className="text-brand-400 text-[10px] break-all">{selectedCert.patchHash}</span></div>
                <div><span className="text-slate-500 text-[10px]">Cert Hash:</span> <span className="text-emerald-400 text-[10px] break-all">{selectedCert.certificateHash}</span></div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <button
                onClick={() => handleCopyJson(selectedCert)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
              </button>

              <button
                onClick={() => handleDownloadCert(selectedCert)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Proof Certificate (.json)</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
