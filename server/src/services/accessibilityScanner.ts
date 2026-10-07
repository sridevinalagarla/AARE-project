import { Page } from 'playwright';
import axeCore from 'axe-core';
import {
  AccessibilityViolation,
  AccessibilityPass,
  AccessibilityIncomplete,
  AccessibilityNode,
} from '../types/index.js';
import { mapAxeToWcag } from './wcagMapper.js';

export interface RawAxeOutput {
  violations: AccessibilityViolation[];
  passes: AccessibilityPass[];
  incomplete: AccessibilityIncomplete[];
}

export class AccessibilityScanner {
  /**
   * Injects axe-core script into the Playwright page and runs the analysis.
   */
  public static async scanPage(page: Page): Promise<RawAxeOutput> {
    // 1. Inject axe-core library into the target page context
    try {
      await page.evaluate(axeCore.source);
    } catch (injectErr: any) {
      throw new Error(`Failed to inject accessibility analysis engine: ${injectErr.message}`);
    }

    // 2. Execute axe.run in the browser context
    let axeResults: any;
    try {
      axeResults = await page.evaluate(async () => {
        // @ts-ignore axe is injected into window
        if (typeof window.axe === 'undefined') {
          throw new Error('axe-core is not defined in the page window context.');
        }

        // Run axe with WCAG 2.0, 2.1, 2.2 A and AA and best-practice rules
        // @ts-ignore
        return await window.axe.run(document, {
          runOnly: {
            type: 'tag',
            values: [
              'wcag2a',
              'wcag2aa',
              'wcag21a',
              'wcag21aa',
              'wcag22aa',
              'best-practice',
              'cat.color',
              'cat.keyboard',
              'cat.aria',
              'cat.forms',
              'cat.structure',
              'cat.name-role-value',
            ],
          },
          resultTypes: ['violations', 'passes', 'incomplete'],
        });
      });
    } catch (runErr: any) {
      throw new Error(`Accessibility analysis execution failed: ${runErr.message}`);
    }

    // 3. Process Violations
    const violations: AccessibilityViolation[] = (axeResults.violations || []).map((v: any) => {
      const nodes: AccessibilityNode[] = (v.nodes || []).map((n: any) => ({
        html: n.html || '',
        target: Array.isArray(n.target) ? n.target.map(String) : [String(n.target || '')],
        failureSummary: n.failureSummary || 'No specific failure summary provided.',
        any: (n.any || []).map((check: any) => ({ id: check.id, message: check.message })),
        all: (n.all || []).map((check: any) => ({ id: check.id, message: check.message })),
        none: (n.none || []).map((check: any) => ({ id: check.id, message: check.message })),
      }));

      const tags = v.tags || [];
      const wcagCriteria = mapAxeToWcag(v.id, tags);

      return {
        id: v.id,
        impact: v.impact || 'moderate',
        tags,
        description: v.description || '',
        help: v.help || '',
        helpUrl: v.helpUrl || '',
        wcagCriteria,
        nodes,
      };
    });

    // 4. Process Passes
    const passes: AccessibilityPass[] = (axeResults.passes || []).map((p: any) => {
      const tags = p.tags || [];
      const wcagCriteria = mapAxeToWcag(p.id, tags);
      return {
        id: p.id,
        description: p.description || '',
        help: p.help || '',
        helpUrl: p.helpUrl || '',
        tags,
        wcagCriteria,
        nodesCount: (p.nodes || []).length,
      };
    });

    // 5. Process Incomplete (checks requiring manual review)
    const incomplete: AccessibilityIncomplete[] = (axeResults.incomplete || []).map((inc: any) => {
      const nodes: AccessibilityNode[] = (inc.nodes || []).map((n: any) => ({
        html: n.html || '',
        target: Array.isArray(n.target) ? n.target.map(String) : [String(n.target || '')],
        failureSummary: n.failureSummary || 'Needs manual inspection.',
      }));

      const tags = inc.tags || [];
      const wcagCriteria = mapAxeToWcag(inc.id, tags);

      return {
        id: inc.id,
        impact: inc.impact || 'moderate',
        description: inc.description || '',
        help: inc.help || '',
        helpUrl: inc.helpUrl || '',
        wcagCriteria,
        nodes,
      };
    });

    return {
      violations,
      passes,
      incomplete,
    };
  }
}
