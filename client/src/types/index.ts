export type ImpactLevel = 'critical' | 'serious' | 'moderate' | 'minor' | null;

export type FrameworkType = 'HTML' | 'React' | 'Next.js' | 'Vue' | 'Angular' | 'Svelte' | 'Unknown';

export interface WcagCriterion {
  id: string; // e.g. "1.1.1"
  name: string; // e.g. "Non-text Content"
  level: 'A' | 'AA' | 'AAA' | 'Best Practice';
  url?: string;
}

export interface AccessibilityNode {
  html: string;
  target: string[];
  failureSummary?: string;
  any?: Array<{ id: string; message: string }>;
  all?: Array<{ id: string; message: string }>;
  none?: Array<{ id: string; message: string }>;
}

export interface AccessibilityViolation {
  id: string;
  impact: ImpactLevel;
  tags: string[];
  description: string;
  help: string;
  helpUrl: string;
  wcagCriteria: WcagCriterion[];
  nodes: AccessibilityNode[];
}

export interface AccessibilityPass {
  id: string;
  description: string;
  help: string;
  helpUrl: string;
  tags: string[];
  wcagCriteria: WcagCriterion[];
  nodesCount: number;
}

export interface AccessibilityIncomplete {
  id: string;
  impact: ImpactLevel;
  description: string;
  help: string;
  helpUrl: string;
  wcagCriteria: WcagCriterion[];
  nodes: AccessibilityNode[];
}

export interface SeverityBreakdown {
  critical: number;
  serious: number;
  moderate: number;
  minor: number;
}

export interface ScanSummary {
  violations: number;
  passes: number;
  incomplete: number;
  critical: number;
  serious: number;
  moderate: number;
  minor: number;
}

export interface IssueAnalysis {
  violationId: string;
  ruleId: string;
  wcagCriterion: string;
  rootCause: string;
  explanation: string;
  affectedCodeSnippet: string;
  targetSelector: string;
  semanticContext: string;
  suggestedAction: string;
}

export interface RepairPlan {
  planId: string;
  violationId: string;
  ruleId: string;
  wcagCriterion: string;
  strategyName: string;
  description: string;
  targetFile: string;
  targetElement: string;
  precondition: string;
  transformation: string;
  postcondition: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  confidenceScore: number; // 0-100
  aiAssisted: boolean;
}

export interface PatchDiff {
  patchId: string;
  planId: string;
  file: string;
  lineStart: number;
  lineEnd: number;
  originalCode: string;
  replacementCode: string;
  diffFormatted: string;
  patchHash: string;
  timestamp: string;
}

export interface SandboxTestResult {
  testRunId: string;
  patchId: string;
  appliedSuccessfully: boolean;
  accessibilityTestsPassed: boolean;
  regressionTestsPassed: boolean;
  visualDiffPassed: boolean;
  buildPassed: boolean;
  violationsBefore: number;
  violationsAfter: number;
  newViolationsIntroduced: number;
  repairedRulePassed: boolean;
  axeSummary: string;
  logs: string[];
  durationMs: number;
}

export interface RepairContract {
  contractId: string;
  ruleId: string;
  wcagCriterion: string;
  precondition: string;
  transformation: string;
  postcondition: string;
  machineCheckableLogic: string;
  proofStrategy: string;
}

export interface ProofCertificate {
  certificateId: string;
  contractId: string;
  projectId?: string;
  projectUrl: string;
  ruleId: string;
  wcagCriterion: string;
  precondition: string;
  transformation: string;
  postcondition: string;
  accessibilityTest: 'PASS' | 'FAIL';
  regressionTest: 'PASS' | 'FAIL';
  formalVerificationStatus: 'VALID' | 'INVALID' | 'PENDING';
  sourceHash: string;
  patchHash: string;
  certificateHash: string;
  provenance: {
    issuedBy: string;
    engineVersion: string;
    timestamp: string;
    auditLogId: string;
  };
}

export interface ConformanceGateResult {
  gateId: string;
  projectId: string;
  allPassed: boolean;
  wcagPassed: boolean;
  regressionPassed: boolean;
  formalVerificationValid: boolean;
  noNewViolations: boolean;
  patchBuildsSuccessfully: boolean;
  readyToDeploy: boolean;
  statusMessage: string;
  timestamp: string;
}

export interface ProjectModel {
  projectId: string;
  name: string;
  sourceType: 'URL' | 'GITHUB' | 'ZIP_UPLOAD';
  sourceUrl?: string;
  framework: FrameworkType;
  packageManager: string;
  totalFiles: number;
  componentsCount: number;
  routesCount: number;
  createdAt: string;
  updatedAt: string;
  score: number;
  violationsCount: number;
  repairsCount: number;
  verifiedCount: number;
  pipelineState: 'DETECT' | 'UNDERSTAND' | 'REPAIR' | 'TEST' | 'PROVE' | 'DEPLOY';
}

export interface ScanResult {
  success: boolean;
  url: string;
  projectId?: string;
  score: number;
  summary: ScanSummary;
  severityBreakdown: SeverityBreakdown;
  violations: AccessibilityViolation[];
  passes: AccessibilityPass[];
  incomplete: AccessibilityIncomplete[];
  timestamp: string;
  duration?: number;
  durationMs: number;
  pageTitle?: string;
  disclaimer: string;
}

export interface ScanHistoryItem {
  id: string;
  url: string;
  pageTitle?: string;
  score: number;
  totalViolations: number;
  criticalCount: number;
  timestamp: string;
  resultData: ScanResult;
}

export interface PlatformAnalytics {
  projectsScanned: number;
  violationsDetected: number;
  violationsRepaired: number;
  verifiedRepairs: number;
  regressionFailures: number;
  proofCertificatesIssued: number;
  averageScanDurationMs: number;
  averageRepairDurationMs: number;
}

export type TabType = 
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

