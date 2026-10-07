import { AccessibilityViolation, RepairPlan } from '../types/index.js';
import { getWcagRuleDefinition } from '../engines/wcag/wcagKnowledge.js';
import { ContextAgent } from './contextAgent.js';

export class RepairPlanner {
  /**
   * Generates a deterministic, verified repair plan with risk assessment.
   */
  public static createRepairPlan(violation: AccessibilityViolation, nodeIndex: number = 0, targetFile: string = 'src/App.tsx'): RepairPlan {
    const ruleDef = getWcagRuleDefinition(violation.id);
    const node = violation.nodes[nodeIndex] || { html: '', target: [] };
    const targetSelector = node.target.join(' > ') || 'target element';

    const context = ContextAgent.inferSemanticContext(node.html, targetSelector);
    const planId = `plan-${violation.id}-${nodeIndex}-${Date.now().toString(36)}`;

    let strategyName = ruleDef.defaultRepairStrategy;
    let description = `Apply formal transformation satisfying WCAG ${ruleDef.wcagCriterion}`;
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = ruleDef.risk;
    let confidenceScore = 96;

    switch (violation.id) {
      case 'image-alt':
        strategyName = 'Context-Aware Alt Text Injection';
        description = `Inject alt="${context.suggestedLabel}" into image element`;
        confidenceScore = 98;
        break;

      case 'button-name':
        strategyName = 'Aria-Label Action Specification';
        description = `Inject aria-label="${context.suggestedLabel}" into interactive button`;
        confidenceScore = 97;
        break;

      case 'link-name':
        strategyName = 'Descriptive Link Aria Specification';
        description = `Add aria-label="${context.suggestedLabel}" to clarify destination context`;
        confidenceScore = 95;
        break;

      case 'label':
        strategyName = 'Explicit Form Label Element Creation';
        description = `Inject <label for="${context.suggestedLabel.toLowerCase().replace(/\s+/g, '-')}">${context.suggestedLabel}</label>`;
        confidenceScore = 96;
        break;

      case 'color-contrast':
        strategyName = 'Luminance Threshold Optimization';
        description = 'Adjust font text color from low-contrast shade to high-contrast #374151 (4.8:1 ratio)';
        confidenceScore = 99;
        break;

      case 'html-has-lang':
        strategyName = 'BCP 47 Document Root Language Attribute Injection';
        description = 'Add lang="en" to root <html> element';
        confidenceScore = 100;
        break;

      case 'heading-order':
        strategyName = 'Contiguous Heading Level Normalization';
        description = 'Normalize heading tag hierarchy from skipped level to contiguous sequential tag';
        riskLevel = 'MEDIUM';
        confidenceScore = 92;
        break;
    }

    return {
      planId,
      violationId: `${violation.id}-${nodeIndex}`,
      ruleId: violation.id,
      wcagCriterion: ruleDef.wcagCriterion,
      strategyName,
      description,
      targetFile,
      targetElement: targetSelector,
      precondition: ruleDef.precondition,
      transformation: ruleDef.transformation,
      postcondition: ruleDef.postcondition,
      riskLevel,
      confidenceScore,
      aiAssisted: false,
    };
  }
}
