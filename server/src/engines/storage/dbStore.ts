import {
  ProjectModel,
  ScanResult,
  AccessibilityViolation,
  RepairPlan,
  PatchDiff,
  SandboxTestResult,
  ProofCertificate,
  ConformanceGateResult,
} from '../../types/index.js';

export interface AuditLog {
  id: string;
  action: string;
  targetId: string;
  details: string;
  timestamp: string;
}

export class DbStore {
  private static projects: Map<string, ProjectModel> = new Map();
  private static scans: Map<string, ScanResult> = new Map();
  private static violations: Map<string, AccessibilityViolation> = new Map();
  private static repairPlans: Map<string, RepairPlan> = new Map();
  private static patches: Map<string, PatchDiff> = new Map();
  private static testResults: Map<string, SandboxTestResult> = new Map();
  private static certificates: Map<string, ProofCertificate> = new Map();
  private static gateResults: Map<string, ConformanceGateResult> = new Map();
  private static auditLogs: AuditLog[] = [];

  static {
    // Seed standard projects
    const defaultProject: ProjectModel = {
      projectId: 'proj-demo-nexus',
      name: 'Nexus Retail Web App',
      sourceType: 'URL',
      sourceUrl: 'https://demo-nexus-retail.proofa11y.engine',
      framework: 'React',
      packageManager: 'npm',
      totalFiles: 34,
      componentsCount: 18,
      routesCount: 6,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date().toISOString(),
      score: 61,
      violationsCount: 8,
      repairsCount: 8,
      verifiedCount: 8,
      pipelineState: 'PROVE',
    };
    this.projects.set(defaultProject.projectId, defaultProject);

    // Seed proof certificates for proof registry
    const seedCert: ProofCertificate = {
      certificateId: 'PA11Y-2026-NEXUS-01',
      contractId: 'contract-image-alt-001',
      projectUrl: 'https://demo-nexus-retail.proofa11y.engine',
      ruleId: 'image-alt',
      wcagCriterion: '1.1.1',
      precondition: '<img> missing accessible name property.',
      transformation: 'Injected alt="Promotional Electronics Banner" into <img>.',
      postcondition: 'Element computes non-empty accessible name.',
      accessibilityTest: 'PASS',
      regressionTest: 'PASS',
      formalVerificationStatus: 'VALID',
      sourceHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      patchHash: 'a7b3c298fe1c149afbf4c8996fb92427ae41e4649b934ca495991b7852c981',
      certificateHash: '98f7e2a4b11c149afbf4c8996fb92427ae41e4649b934ca495991b7852f332',
      provenance: {
        issuedBy: 'ProofA11y Formal Verification Kernel v1.0',
        engineVersion: '1.0.4-verified',
        timestamp: new Date().toISOString(),
        auditLogId: 'audit-seed-01',
      },
    };
    this.certificates.set(seedCert.certificateId, seedCert);
  }

  // Projects
  public static saveProject(project: ProjectModel): void {
    this.projects.set(project.projectId, project);
    this.log('PROJECT_SAVED', project.projectId, `Project "${project.name}" saved.`);
  }

  public static getProject(id: string): ProjectModel | undefined {
    return this.projects.get(id);
  }

  public static findProject(url: string): ProjectModel | undefined {
    return Array.from(this.projects.values()).find(p => p.sourceUrl === url);
  }

  public static getAllProjects(): ProjectModel[] {
    return Array.from(this.projects.values());
  }

  // Scans
  public static saveScan(urlOrScan: string | ScanResult, scanObj?: ScanResult): void {
    if (typeof urlOrScan === 'string' && scanObj) {
      this.scans.set(urlOrScan, scanObj);
      this.log('SCAN_RECORDED', urlOrScan, `Scan completed with score ${scanObj.score}%.`);
    } else if (typeof urlOrScan === 'object') {
      this.scans.set(urlOrScan.url, urlOrScan);
      this.log('SCAN_RECORDED', urlOrScan.url, `Scan completed with score ${urlOrScan.score}%.`);
    }
  }

  public static getScan(url: string): ScanResult | undefined {
    return this.scans.get(url);
  }

  public static getAllScans(): ScanResult[] {
    return Array.from(this.scans.values());
  }

  // Repair Plans & Patches
  public static savePlan(plan: RepairPlan): void {
    this.repairPlans.set(plan.planId, plan);
  }

  public static getPlan(id: string): RepairPlan | undefined {
    return this.repairPlans.get(id);
  }

  public static savePatch(patch: PatchDiff): void {
    this.patches.set(patch.patchId, patch);
  }

  public static getPatch(id: string): PatchDiff | undefined {
    return this.patches.get(id);
  }

  // Tests & Verification Certificates
  public static saveTestResult(testResult: SandboxTestResult): void {
    this.testResults.set(testResult.testRunId, testResult);
  }

  public static saveCertificate(cert: ProofCertificate): void {
    this.certificates.set(cert.certificateId, cert);
    this.log('CERTIFICATE_ISSUED', cert.certificateId, `Proof Certificate issued for ${cert.ruleId} (WCAG ${cert.wcagCriterion})`);
  }

  public static getCertificate(id: string): ProofCertificate | undefined {
    return this.certificates.get(id);
  }

  public static getAllCertificates(): ProofCertificate[] {
    return Array.from(this.certificates.values()).sort((a, b) => new Date(b.provenance.timestamp).getTime() - new Date(a.provenance.timestamp).getTime());
  }

  // Gate Results
  public static saveGateResult(gate: ConformanceGateResult): void {
    this.gateResults.set(gate.gateId, gate);
  }

  // Audit Logs
  public static logAudit(action: string, targetId: string, metadata?: any): void {
    const details = typeof metadata === 'object' ? JSON.stringify(metadata) : String(metadata || '');
    this.log(action, targetId, details);
  }

  public static log(action: string, targetId: string, details: string): void {
    this.auditLogs.unshift({
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action,
      targetId,
      details,
      timestamp: new Date().toISOString(),
    });
    if (this.auditLogs.length > 200) {
      this.auditLogs.pop();
    }
  }

  public static getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }
}

