import { AccessibilityViolation, AccessibilityPass, SeverityBreakdown, ScanSummary } from '../types/index.js';

export interface ScoreCalculationResult {
  score: number;
  totalChecks: number;
  summary: ScanSummary;
  severityBreakdown: SeverityBreakdown;
  violations: number;
  passes: number;
  incomplete: number;
  totalViolations: number;
  totalPasses: number;
  totalIncomplete: number;
  disclaimer: string;
}

export const DISCLAIMER_TEXT =
  'Score based on automated accessibility checks performed during this scan. Score is an application-level indicator based on automated checks and is not an official WCAG conformance certification.';

/**
 * Computes an Accessibility Health Score based on axe-core automated rules.
 * Uses a deterministic pass vs violation ratio weighted by impact severity.
 */
export function calculateAccessibilityScore(
  violations: AccessibilityViolation[],
  passes: AccessibilityPass[],
  incompleteCount: number = 0
): ScoreCalculationResult {
  const breakdown: SeverityBreakdown = {
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
  };

  let weightedViolationDeductions = 0;

  for (const v of violations) {
    const nodeCount = v.nodes?.length || 1;
    const elementMultiplier = 1 + Math.min(nodeCount - 1, 8) * 0.15;

    switch (v.impact) {
      case 'critical':
        breakdown.critical++;
        weightedViolationDeductions += 10 * elementMultiplier;
        break;
      case 'serious':
        breakdown.serious++;
        weightedViolationDeductions += 6 * elementMultiplier;
        break;
      case 'moderate':
        breakdown.moderate++;
        weightedViolationDeductions += 3 * elementMultiplier;
        break;
      case 'minor':
      default:
        breakdown.minor++;
        weightedViolationDeductions += 1 * elementMultiplier;
        break;
    }
  }

  const passCount = passes.length;
  const violationCount = violations.length;
  const totalChecks = passCount + violationCount;

  let calculatedScore: number;

  if (totalChecks === 0) {
    calculatedScore = 100;
  } else if (violationCount === 0) {
    calculatedScore = 100;
  } else {
    const passRatio = (passCount / totalChecks) * 100;
    const deductionScore = Math.max(0, 100 - weightedViolationDeductions);
    // Harmonized score
    calculatedScore = Math.max(0, Math.min(100, Math.round(passRatio * 0.5 + deductionScore * 0.5)));
  }

  const summary: ScanSummary = {
    violations: violationCount,
    passes: passCount,
    incomplete: incompleteCount,
    critical: breakdown.critical,
    serious: breakdown.serious,
    moderate: breakdown.moderate,
    minor: breakdown.minor,
  };

  return {
    score: calculatedScore,
    totalChecks,
    summary,
    severityBreakdown: breakdown,
    violations: violationCount,
    passes: passCount,
    totalViolations: violationCount,
    totalPasses: passCount,
    incomplete: incompleteCount,
    totalIncomplete: incompleteCount,
    disclaimer: DISCLAIMER_TEXT,
  };
}
