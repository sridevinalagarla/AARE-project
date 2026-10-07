import { ConformanceGateResult, ProofCertificate, SandboxTestResult } from '../../types/index.js';

export class ConformanceGate {
  /**
   * Evaluates all gate conditions before granting deployment authorization.
   */
  public static evaluateGate(
    projectId: string,
    testResult: SandboxTestResult,
    certificate: ProofCertificate
  ): ConformanceGateResult {
    const gateId = `gate-${Date.now().toString(36)}`;
    const wcagPassed = testResult.accessibilityTestsPassed && testResult.repairedRulePassed;
    const regressionPassed = testResult.regressionTestsPassed;
    const formalVerificationValid = certificate.formalVerificationStatus === 'VALID';
    const noNewViolations = testResult.newViolationsIntroduced === 0;
    const patchBuildsSuccessfully = testResult.buildPassed;

    const allPassed =
      wcagPassed &&
      regressionPassed &&
      formalVerificationValid &&
      noNewViolations &&
      patchBuildsSuccessfully;

    let statusMessage = 'All Conformance Gate checks passed. Patch is verified safe for deployment.';
    if (!allPassed) {
      statusMessage = 'Conformance Gate blocked deployment: One or more safety verification conditions failed.';
    }

    return {
      gateId,
      projectId,
      allPassed,
      wcagPassed,
      regressionPassed,
      formalVerificationValid,
      noNewViolations,
      patchBuildsSuccessfully,
      readyToDeploy: allPassed,
      statusMessage,
      timestamp: new Date().toISOString(),
    };
  }
}
