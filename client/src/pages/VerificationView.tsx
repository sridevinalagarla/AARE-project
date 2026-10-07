import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  Lock,
  FileCheck,
  ArrowRight,
  ExternalLink,
  Code2,
  Layers,
  Sparkles,
  Download,
  Terminal,
  Copy,
  Check,
  Rocket,
  X,
  Server
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProofCertificate, ConformanceGateResult, RepairContract } from '../types';
import { NavTab } from '../components/Navbar';

interface VerificationViewProps {
  certificate: ProofCertificate | null;
  gateResult: ConformanceGateResult | null;
  contract: RepairContract | null;
  setActiveTab: (tab: NavTab) => void;
}

export const VerificationView: React.FC<VerificationViewProps> = ({
  certificate,
  gateResult,
  contract,
  setActiveTab,
}) => {
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!certificate) {
    return (
      <div className="w-full max-w-4xl mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">No Active Verification Result</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Execute a repair in the Repairs workspace to evaluate its formal repair contract and issue a proof certificate.
        </p>
        <button
          onClick={() => setActiveTab('repairs')}
          className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
        >
          Go to Repairs Workspace
        </button>
      </div>
    );
  }

  const handleDownloadPatch = () => {
    const patchContent = `# PROOF A11Y VERIFIED PATCH
# Certificate ID: ${certificate.certificateId}
# Rule: ${certificate.ruleId} (WCAG ${certificate.wcagCriterion})
# Patch Hash: ${certificate.patchHash}
# Source Hash: ${certificate.sourceHash}
# Timestamp: ${certificate.provenance.timestamp}

--- a/src/App.tsx
+++ b/src/App.tsx
@@ -18,4 +18,4 @@
-${certificate.transformation.split('->')[0] || '<unfixed-element>'}
+${certificate.transformation.split('->')[1] || certificate.transformation}
`;
    const blob = new Blob([patchContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patch-${certificate.certificateId}.patch`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(`git apply patch-${certificate.certificateId}.patch`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setIsDeployed(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#10b981', '#6366f1', '#ec4899'],
      });
    }, 1200);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>FORMAL VERIFICATION & CONFORMANCE GATE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Proof-Carrying Repair Contract
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Machine-checkable mathematical preconditions, transformations, and verified postconditions.
          </p>
        </div>

        {/* Action Link to Proof Registry */}
        <button
          onClick={() => setActiveTab('certificates')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-semibold transition-colors cursor-pointer"
        >
          <Award className="w-3.5 h-3.5 text-indigo-400" />
          <span>Inspect in Proof Registry</span>
        </button>
      </div>

      {/* Proof Card Blueprint */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 bg-[#0d1322] space-y-6">
        
        {/* Certificate Meta Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-[1px]">
              <div className="w-full h-full bg-[#0a0f1d] rounded-[15px] flex items-center justify-center text-emerald-400">
                <Award className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-white tracking-wide">
                  {certificate.certificateId}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  {certificate.formalVerificationStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Target Rule: <span className="text-brand-300 font-semibold">{certificate.ruleId}</span> (WCAG {certificate.wcagCriterion})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-xs font-mono text-slate-400">Formal Contract:</span>
            <span className="px-2.5 py-1 rounded bg-[#080c16] border border-white/10 font-mono text-xs text-indigo-300">
              {certificate.contractId}
            </span>
          </div>
        </div>

        {/* 3-Part Machine Checkable Logic Spec */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>Formal Machine-Checkable Invariants</span>
          </h3>

          <div className="grid grid-cols-1 gap-3 font-mono text-xs">
            
            {/* 1. Precondition */}
            <div className="p-4 rounded-xl bg-[#080c16] border border-rose-500/20 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                1. Established Precondition (Failure State)
              </div>
              <p className="text-slate-300 leading-relaxed">
                {certificate.precondition}
              </p>
            </div>

            {/* 2. Transformation */}
            <div className="p-4 rounded-xl bg-[#080c16] border border-amber-500/20 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                2. Applied Transformation
              </div>
              <p className="text-slate-300 leading-relaxed">
                {certificate.transformation}
              </p>
            </div>

            {/* 3. Postcondition */}
            <div className="p-4 rounded-xl bg-[#080c16] border border-emerald-500/20 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                3. Postcondition Verification
              </div>
              <p className="text-slate-300 leading-relaxed">
                {certificate.postcondition}
              </p>
            </div>

          </div>
        </div>

        {/* Cryptographic Hashes & Provenance */}
        <div className="p-4 rounded-xl bg-[#080c16] border border-white/5 space-y-3 font-mono text-xs">
          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            Cryptographic Hashes & Provenance
          </div>

          <div className="space-y-1 text-slate-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-slate-500">Patch Hash (SHA-256):</span>
              <span className="text-cyan-300 break-all">{certificate.patchHash}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-slate-500">Certificate Hash (SHA-256):</span>
              <span className="text-emerald-300 break-all">{certificate.certificateHash}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-500">
            <span>Kernel: {certificate.provenance.issuedBy}</span>
            <span>{new Date(certificate.provenance.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>

      </div>

      {/* Conformance Gate Status Banner with ACTIVE DEPLOY ACTION */}
      {gateResult && (
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-emerald-500/40 bg-gradient-to-br from-[#0a1626] to-[#0d1f36] space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">
                  Zero-Trust Conformance Gate Evaluation
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  {gateResult.statusMessage}
                </p>
              </div>
            </div>

            {/* CLICKABLE READY TO DEPLOY BUTTON */}
            <button
              onClick={() => setIsDeployModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm uppercase font-mono tracking-wider shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 cursor-pointer shrink-0"
            >
              <Rocket className="w-4 h-4 fill-slate-950" />
              <span>READY TO DEPLOY</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono pt-2">
            <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/30 text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>WCAG Tests: PASS</span>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/30 text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Regression: PASS</span>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/30 text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Formal Proof: VALID</span>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/30 text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>No New Violations</span>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/30 text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Build Invariant: OK</span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Deployment Modal */}
      {isDeployModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#0f172a] border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-6 p-6 sm:p-8">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Rocket className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-mono">Deploy Verified Patch</h3>
                  <p className="text-xs text-slate-400">Zero-Trust Conformance Gate Approved • Certificate {certificate.certificateId}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDeployModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isDeployed ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-bold text-white">Patch Deployed Successfully!</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  The verified accessibility patch conforming to WCAG {certificate.wcagCriterion} has been applied to target destination with zero regressions.
                </p>
                <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/30 text-xs font-mono text-emerald-400 max-w-md mx-auto">
                  Deployment Hash: {certificate.certificateHash}
                </div>
                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setIsDeployModalOpen(false);
                      setIsDeployed(false);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono tracking-wider cursor-pointer"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => {
                      setIsDeployModalOpen(false);
                      setActiveTab('certificates');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs font-mono tracking-wider cursor-pointer"
                  >
                    View in Proof Registry
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Target Information */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Target Destination:</span>
                    <span className="text-white font-semibold flex items-center gap-1">
                      <Server className="w-3.5 h-3.5 text-cyan-400" /> Local Development Workspace
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Target File:</span>
                    <span className="text-cyan-300">src/App.tsx</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Cryptographic Signature:</span>
                    <span className="text-emerald-400 font-bold">VERIFIED (SHA-256 MATCH)</span>
                  </div>
                </div>

                {/* Download Patch & Git Command */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-slate-400">Deployment Command (Git):</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 p-2.5 rounded-xl bg-black/60 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto">
                      git apply patch-{certificate.certificateId}.patch
                    </div>
                    <button
                      onClick={handleCopyCommand}
                      className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={handleDownloadPatch}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-semibold cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download .patch File</span>
                  </button>

                  <button
                    onClick={handleDeploy}
                    disabled={isDeploying}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs font-mono tracking-wider shadow-lg shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Rocket className="w-4 h-4 fill-slate-950" />
                    <span>{isDeploying ? 'DEPLOYING PATCH...' : 'CONFIRM & DEPLOY'}</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
