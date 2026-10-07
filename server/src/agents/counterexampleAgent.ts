import { SandboxTestResult, RepairPlan } from '../types/index.js';

export interface CounterexampleResult {
  hasCounterexample: boolean;
  failedAssertion?: string;
  counterexampleState?: string;
  refinementAction?: string;
}

export class CounterexampleAgent {
  /**
   * Analyzes sandbox test output and produces formal counterexamples if regressions occur.
   */
  public static evaluateTestRun(testResult: SandboxTestResult, plan: RepairPlan): CounterexampleResult {
    if (testResult.appliedSuccessfully && testResult.accessibilityTestsPassed && testResult.regressionTestsPassed && testResult.newViolationsIntroduced === 0) {
      return {
        hasCounterexample: false,
      };
    }

    let failedAssertion = 'Accessibility invariant postcondition check failed.';
    let counterexampleState = 'Target node still evaluates to violation status.';
    let refinementAction = 'Strengthen semantic label or adjust attribute placement.';

    if (testResult.newViolationsIntroduced > 0) {
      failedAssertion = `Patch introduced ${testResult.newViolationsIntroduced} regression violation(s).`;
      counterexampleState = 'Regression invariant violated: violationsAfter > violationsBefore.';
      refinementAction = 'Revert secondary attribute modification and isolate remediation solely to primary node.';
    } else if (!testResult.buildPassed) {
      failedAssertion = 'Syntax compilation failed after applying patch.';
      counterexampleState = 'Malformed HTML/JSX tag sequence generated.';
      refinementAction = 'Ensure strict JSX self-closing tag compliance and proper attribute escaping.';
    }

    return {
      hasCounterexample: true,
      failedAssertion,
      counterexampleState,
      refinementAction,
    };
  }
}
