import { describe, it, expect } from 'vitest';
import { calculateAccessibilityScore, DISCLAIMER_TEXT } from '../src/services/scoreService.js';
import { AccessibilityViolation, AccessibilityPass } from '../src/types/index.js';

describe('Accessibility Score Service', () => {
  it('should return 100 for zero violations', () => {
    const passes: AccessibilityPass[] = [
      { id: 'document-title', description: 'Page has title', help: '', helpUrl: '', tags: [], wcagCriteria: [], nodesCount: 1 },
      { id: 'html-has-lang', description: 'HTML has lang', help: '', helpUrl: '', tags: [], wcagCriteria: [], nodesCount: 1 },
    ];
    const result = calculateAccessibilityScore([], passes);
    expect(result.score).toBe(100);
    expect(result.totalViolations).toBe(0);
    expect(result.totalPasses).toBe(2);
    expect(result.disclaimer).toBe(DISCLAIMER_TEXT);
  });

  it('should properly deduct score for critical and serious violations', () => {
    const violations: AccessibilityViolation[] = [
      {
        id: 'image-alt',
        impact: 'critical',
        tags: ['wcag2a', 'wcag111'],
        description: 'Image missing alt',
        help: 'Images must have alternate text',
        helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/image-alt',
        wcagCriteria: [{ id: '1.1.1', name: 'Non-text Content', level: 'A' }],
        nodes: [{ html: '<img src="test.jpg">', target: ['img'] }],
      },
      {
        id: 'button-name',
        impact: 'serious',
        tags: ['wcag2a', 'wcag412'],
        description: 'Button without name',
        help: 'Buttons must have discernible text',
        helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/button-name',
        wcagCriteria: [{ id: '4.1.2', name: 'Name, Role, Value', level: 'A' }],
        nodes: [{ html: '<button></button>', target: ['button'] }],
      },
    ];

    const passes: AccessibilityPass[] = [
      { id: 'document-title', description: 'Page has title', help: '', helpUrl: '', tags: [], wcagCriteria: [], nodesCount: 1 },
    ];

    const result = calculateAccessibilityScore(violations, passes);
    expect(result.score).toBeLessThan(85);
    expect(result.severityBreakdown.critical).toBe(1);
    expect(result.severityBreakdown.serious).toBe(1);
    expect(result.severityBreakdown.moderate).toBe(0);
    expect(result.severityBreakdown.minor).toBe(0);
  });

  it('should clamp score between 0 and 100 even with many violations', () => {
    const violations: AccessibilityViolation[] = Array.from({ length: 30 }, (_, i) => ({
      id: `violation-${i}`,
      impact: 'critical',
      tags: [],
      description: 'Critical issue',
      help: 'Fix it',
      helpUrl: '',
      wcagCriteria: [],
      nodes: [{ html: '<div>', target: ['div'] }],
    }));

    const result = calculateAccessibilityScore(violations, []);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });
});
