import React, { useState, useEffect } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { DashboardView } from './pages/DashboardView';
import { ScanView } from './pages/ScanView';
import { ProjectsView } from './pages/ProjectsView';
import { ViolationsView } from './pages/ViolationsView';
import { RepairsView } from './pages/RepairsView';
import { VerificationView } from './pages/VerificationView';
import { CertificatesView } from './pages/CertificatesView';
import { ArchitectureView } from './pages/ArchitectureView';
import { DemoView } from './pages/DemoView';
import { PresentationView } from './pages/PresentationView';
import { SettingsView } from './pages/SettingsView';
import { ViolationDetailModal } from './components/ViolationDetailModal';

import { 
  api, 
  scanWebsite, 
  scanDemoWebsite, 
  analyzeProjectRepo, 
  analyzeViolation, 
  generateRepair, 
  applyRepairAndTest, 
  verifyRepair 
} from './services/api';
import { 
  ProjectModel, 
  AccessibilityViolation, 
  RepairPlan, 
  PatchDiff, 
  SandboxTestResult, 
  RepairContract, 
  ProofCertificate, 
  ConformanceGateResult,
  PlatformAnalytics,
  ScanResult
} from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [projects, setProjects] = useState<ProjectModel[]>([]);
  const [activeProject, setActiveProject] = useState<ProjectModel | null>(null);
  const [selectedViolation, setSelectedViolation] = useState<AccessibilityViolation | null>(null);
  const [detailModalViolation, setDetailModalViolation] = useState<AccessibilityViolation | null>(null);
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);
  
  // Scanning state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scanningUrl, setScanningUrl] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active repair & proof workflow state
  const [repairPlan, setRepairPlan] = useState<RepairPlan | null>(null);
  const [patch, setPatch] = useState<PatchDiff | null>(null);
  const [testResult, setTestResult] = useState<SandboxTestResult | null>(null);
  const [contract, setContract] = useState<RepairContract | null>(null);
  const [certificate, setCertificate] = useState<ProofCertificate | null>(null);
  const [gateResult, setGateResult] = useState<ConformanceGateResult | null>(null);
  const [certificatesList, setCertificatesList] = useState<ProofCertificate[]>([]);
  const [isApplyingRepair, setIsApplyingRepair] = useState<boolean>(false);

  // Demo state for presentation sync
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [demoProgress, setDemoProgress] = useState<number>(0);

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projList, stats, certs] = await Promise.all([
        api.getProjects(),
        api.getAnalytics(),
        api.getCertificates()
      ]);
      setProjects(projList);
      if (projList.length > 0 && !activeProject) {
        setActiveProject(projList[0]);
      }
      setAnalytics(stats);
      setCertificatesList(certs);
    } catch (err) {
      console.error("Error loading initial data:", err);
    }
  };

  // Website URL Scan Handler
  const handleScanUrl = async (url: string) => {
    setIsLoading(true);
    setScanningUrl(url);
    setErrorMessage(null);

    try {
      const result: ScanResult = await scanWebsite(url);
      const newProj: ProjectModel = {
        projectId: result.projectId || `PROJ-${Date.now().toString().slice(-4)}`,
        name: result.pageTitle || url.replace(/^https?:\/\//, ''),
        sourceType: 'URL',
        sourceUrl: url,
        framework: 'React',
        packageManager: 'npm',
        totalFiles: 14,
        componentsCount: 6,
        routesCount: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        score: result.score,
        violationsCount: result.violations.length,
        repairsCount: 0,
        verifiedCount: 0,
        pipelineState: 'DETECT',
      };
      // Attach violations to project model for local session
      (newProj as any).violations = result.violations;
      setProjects(prev => [newProj, ...prev.filter(p => p.projectId !== newProj.projectId)]);
      setActiveProject(newProj);
      setActiveTab('violations');
      loadData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to scan this website.');
    } finally {
      setIsLoading(false);
    }
  };

  // GitHub Repository Ingestion Handler
  const handleAnalyzeRepo = async (repoUrl: string) => {
    setIsLoading(true);
    setScanningUrl(repoUrl);
    setErrorMessage(null);

    try {
      const { project } = await analyzeProjectRepo(repoUrl);
      setProjects(prev => [project, ...prev.filter(p => p.projectId !== project.projectId)]);
      setActiveProject(project);
      setActiveTab('violations');
      loadData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to analyze repository.');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo Scan Handler
  const handleDemoScan = async () => {
    setIsLoading(true);
    setScanningUrl('http://127.0.0.1:3001/demo.html (Sample React App)');
    setErrorMessage(null);

    try {
      const result: ScanResult = await scanDemoWebsite();
      const demoProj: ProjectModel = {
        projectId: 'PROJ-DEMO-001',
        name: 'Inaccessible React Showcase',
        sourceType: 'URL',
        sourceUrl: 'http://127.0.0.1:3001/demo.html',
        framework: 'React',
        packageManager: 'npm',
        totalFiles: 28,
        componentsCount: 12,
        routesCount: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        score: result.score,
        violationsCount: result.violations.length,
        repairsCount: 0,
        verifiedCount: 0,
        pipelineState: 'DETECT',
      };
      (demoProj as any).violations = result.violations;
      setProjects(prev => [demoProj, ...prev.filter(p => p.projectId !== demoProj.projectId)]);
      setActiveProject(demoProj);
      setActiveTab('violations');
      loadData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to run demo scan.');
    } finally {
      setIsLoading(false);
    }
  };

  // Violation Selection & Repair Generation
  const handleSelectViolationForRepair = async (v: AccessibilityViolation) => {
    setSelectedViolation(v);
    setActiveTab('repairs');

    try {
      const { plan, patch: pDiff, contract: cCont } = await generateRepair(v, 0);
      setRepairPlan(plan);
      setPatch(pDiff);
      setContract(cCont);
    } catch (err) {
      console.error("Error generating repair:", err);
    }
  };

  // Apply repair & test in isolated sandbox
  const handleApplyAndTestRepair = async () => {
    if (!patch || !repairPlan) return;
    setIsApplyingRepair(true);

    try {
      const { testResult: tResult } = await applyRepairAndTest(patch, repairPlan);
      setTestResult(tResult);
    } catch (err) {
      console.error("Error applying sandbox test:", err);
    } finally {
      setIsApplyingRepair(false);
    }
  };

  // Proceed to formal verification
  const handleProceedToVerification = async () => {
    if (!contract || !repairPlan || !patch || !testResult) return;

    try {
      const { certificate: cert, gateResult: gate } = await verifyRepair(
        contract,
        repairPlan,
        patch,
        testResult,
        activeProject?.sourceUrl || 'http://localhost'
      );
      setCertificate(cert);
      setGateResult(gate);
      setActiveTab('verification');
      loadData();
    } catch (err) {
      console.error("Error verifying repair:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Universal Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRunDemo={() => setActiveTab('demo')}
        certificatesCount={certificatesList.length}
        violationsCount={activeProject ? (activeProject as any).violations?.length || activeProject.violationsCount : 0}
      />

      {/* Main App Content View Switcher */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <DashboardView
            analytics={analytics}
            setActiveTab={setActiveTab}
            onRunDemo={() => setActiveTab('demo')}
          />
        )}

        {/* TAB 2: SCAN (URL / REPO / ZIP) */}
        {activeTab === 'scan' && (
          <ScanView
            onScanUrl={handleScanUrl}
            onAnalyzeRepo={handleAnalyzeRepo}
            onDemoScan={handleDemoScan}
            isLoading={isLoading}
            scanningUrl={scanningUrl}
            errorMessage={errorMessage}
            onRetry={() => handleScanUrl(scanningUrl)}
          />
        )}

        {/* TAB 3: PROJECTS REPOSITORY */}
        {activeTab === 'projects' && (
          <ProjectsView
            projects={projects}
            setActiveTab={setActiveTab}
            onSelectProject={(p: ProjectModel) => {
              setActiveProject(p);
              setActiveTab('violations');
            }}
          />
        )}

        {/* TAB 4: VIOLATIONS INSPECTOR */}
        {activeTab === 'violations' && (
          <ViolationsView
            project={activeProject}
            violations={(activeProject as any)?.violations || []}
            onSelectViolationForRepair={handleSelectViolationForRepair}
            onAnalyzeViolation={(v: AccessibilityViolation) => setDetailModalViolation(v)}
          />
        )}

        {/* TAB 5: REPAIR & DIFF WORKSPACE */}
        {activeTab === 'repairs' && (
          <RepairsView
            activeViolation={selectedViolation}
            plan={repairPlan}
            patch={patch}
            testResult={testResult}
            onApplyAndTest={handleApplyAndTestRepair}
            onProceedToVerification={handleProceedToVerification}
            isApplying={isApplyingRepair}
            setActiveTab={setActiveTab}
          />
        )}

        {/* TAB 6: FORMAL VERIFICATION & CONFORMANCE GATE */}
        {activeTab === 'verification' && (
          <VerificationView
            contract={contract}
            certificate={certificate}
            gateResult={gateResult}
            setActiveTab={setActiveTab}
          />
        )}

        {/* TAB 7: PROOF REGISTRY */}
        {activeTab === 'certificates' && (
          <CertificatesView
            certificates={certificatesList}
          />
        )}

        {/* TAB 8: INTERACTIVE ARCHITECTURE */}
        {activeTab === 'architecture' && (
          <ArchitectureView />
        )}

        {/* TAB 9: INTERACTIVE LIVE SELF-HEALING DEMO */}
        {activeTab === 'demo' && (
          <DemoView
            setActiveTab={setActiveTab}
            onRefreshCertificates={loadData}
          />
        )}

        {/* TAB 10: HACKATHON PRESENTATION MODE */}
        {activeTab === 'presentation' && (
          <PresentationView
            onRunDemo={() => setActiveTab('demo')}
            isDemoRunning={isDemoRunning}
            demoProgress={demoProgress}
            demoCertificates={certificatesList}
            demoGate={gateResult}
          />
        )}

        {/* TAB 11: SETTINGS & HEALTH */}
        {activeTab === 'settings' && (
          <SettingsView />
        )}

      </main>

      {/* Deep Inspection Modal (when requested) */}
      <ViolationDetailModal
        violation={detailModalViolation}
        onClose={() => setDetailModalViolation(null)}
      />

      {/* Global Clean Developer Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-white font-bold tracking-tight">PROOF A11Y</span>
            <span>•</span>
            <span className="text-slate-400">Proof-Carrying WCAG Auto-Repair Engine</span>
            <span>•</span>
            <span className="text-cyan-400">Detect → Understand → Repair → Test → Prove → Deploy</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">Playwright + axe-core + Formal Contracts</span>
            <span>•</span>
            <button 
              onClick={() => setActiveTab('presentation')}
              className="text-cyan-400 hover:underline hover:text-cyan-300"
            >
              Presentation Mode
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
