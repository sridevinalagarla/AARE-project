import {
  ScanResult,
  ProjectModel,
  AccessibilityViolation,
  IssueAnalysis,
  RepairPlan,
  PatchDiff,
  SandboxTestResult,
  ProofCertificate,
  ConformanceGateResult,
} from '../types';

const API_BASE = '';

export async function scanWebsite(url: string): Promise<ScanResult> {
  const res = await fetch(`${API_BASE}/api/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Unable to scan this website.');
  }
  return data as ScanResult;
}

export async function scanDemoWebsite(): Promise<ScanResult> {
  const res = await fetch(`${API_BASE}/api/scan-demo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to scan demo website.');
  }
  return data as ScanResult;
}

export async function analyzeProjectRepo(repoUrl: string, name?: string): Promise<{ project: ProjectModel; normalized: any }> {
  const res = await fetch(`${API_BASE}/api/projects/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repoUrl, name }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to analyze repository.');
  }
  return data;
}

export async function analyzeViolation(violation: AccessibilityViolation, nodeIndex: number = 0): Promise<{ analysis: IssueAnalysis }> {
  const res = await fetch(`${API_BASE}/api/violations/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ violation, nodeIndex }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to analyze violation.');
  }
  return data;
}

export async function generateRepair(violation: AccessibilityViolation, nodeIndex: number = 0, targetFile?: string): Promise<{ plan: RepairPlan; patch: PatchDiff; contract: any }> {
  const res = await fetch(`${API_BASE}/api/repairs/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ violation, nodeIndex, targetFile }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to generate repair.');
  }
  return data;
}

export async function applyRepairAndTest(patch: PatchDiff, plan: RepairPlan): Promise<{ testResult: SandboxTestResult; counterexample: any }> {
  const res = await fetch(`${API_BASE}/api/repairs/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patch, plan }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to apply repair in sandbox.');
  }
  return data;
}

export async function verifyRepair(contract: any, plan: RepairPlan, patch: PatchDiff, testResult: SandboxTestResult, projectUrl?: string): Promise<{ certificate: ProofCertificate; isValid: boolean; reason: string; gateResult: ConformanceGateResult }> {
  const res = await fetch(`${API_BASE}/api/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contract, plan, patch, testResult, projectUrl }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Formal verification failed.');
  }
  return data;
}

export async function fetchCertificates(): Promise<ProofCertificate[]> {
  const res = await fetch(`${API_BASE}/api/certificates`);
  const data = await res.json();
  return data.certificates || [];
}

export async function fetchProjects(): Promise<ProjectModel[]> {
  const res = await fetch(`${API_BASE}/api/projects`);
  const data = await res.json();
  return data.projects || [];
}

export async function fetchAnalytics(): Promise<any> {
  const res = await fetch(`${API_BASE}/api/analytics`);
  const data = await res.json();
  return data.analytics;
}

export async function runFullDemoCycle(): Promise<any> {
  const res = await fetch(`${API_BASE}/api/demo/full-cycle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to run full demo cycle.');
  }
  return data;
}

export const api = {
  scanWebsite,
  scanDemoWebsite,
  analyzeProjectRepo,
  analyzeViolation,
  generateRepair,
  applyRepairAndTest,
  verifyRepair,
  getCertificates: fetchCertificates,
  getProjects: fetchProjects,
  getAnalytics: fetchAnalytics,
  runFullDemoCycle,
};


