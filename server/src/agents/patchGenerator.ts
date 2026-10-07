import crypto from 'node:crypto';
import { RepairPlan, PatchDiff, AccessibilityViolation } from '../types/index.js';
import { ContextAgent } from './contextAgent.js';

export class PatchGenerator {
  /**
   * Generates a concrete patch diff and cryptographic hash for a violation and repair plan.
   */
  public static generatePatch(plan: RepairPlan, violation: AccessibilityViolation, nodeIndex: number = 0): PatchDiff {
    const node = violation.nodes[nodeIndex] || { html: '<element>', target: [] };
    const originalHtml = node.html || '<element>';
    const context = ContextAgent.inferSemanticContext(originalHtml, plan.targetElement);

    let originalCode = originalHtml;
    let replacementCode = originalHtml;

    switch (plan.ruleId) {
      case 'image-alt':
        if (!originalHtml.includes('alt=')) {
          replacementCode = originalHtml.replace(/<img\s+/i, `<img alt="${context.suggestedLabel}" `);
        } else {
          replacementCode = originalHtml.replace(/alt=["'][^"']*["']/i, `alt="${context.suggestedLabel}"`);
        }
        break;

      case 'button-name':
        if (!originalHtml.includes('aria-label=')) {
          replacementCode = originalHtml.replace(/<button\s+/i, `<button aria-label="${context.suggestedLabel}" `);
          if (!replacementCode.includes('aria-label=')) {
            replacementCode = `<button aria-label="${context.suggestedLabel}">${originalHtml.replace(/<button[^>]*>/, '').replace(/<\/button>/, '')}</button>`;
          }
        }
        break;

      case 'link-name':
        if (!originalHtml.includes('aria-label=')) {
          replacementCode = originalHtml.replace(/<a\s+/i, `<a aria-label="${context.suggestedLabel}" `);
        }
        break;

      case 'label':
        const idMatch = originalHtml.match(/id=["']([^"']*)["']/);
        const inputId = idMatch ? idMatch[1] : `input-${Date.now().toString(36).substring(4)}`;
        let withIdHtml = originalHtml;
        if (!idMatch) {
          withIdHtml = originalHtml.replace(/<input\s+/i, `<input id="${inputId}" `);
        }
        replacementCode = `<label for="${inputId}" className="block text-sm font-medium text-slate-300 mb-1">${context.suggestedLabel}</label>\n${withIdHtml}`;
        break;

      case 'color-contrast':
        if (originalHtml.includes('color:')) {
          replacementCode = originalHtml.replace(/color:\s*#[a-f0-9]{3,6}/i, 'color: #374151');
        } else {
          replacementCode = originalHtml.replace(/>/, ' style="color: #374151;">');
        }
        break;

      case 'html-has-lang':
        replacementCode = originalHtml.replace(/<html(?:\s+[^>]*)?>/i, '<html lang="en">');
        break;

      case 'heading-order':
        replacementCode = originalHtml.replace(/<h5/gi, '<h4').replace(/<\/h5>/gi, '</h4>')
          .replace(/<h4/gi, '<h3').replace(/<\/h4>/gi, '</h3>')
          .replace(/<h3/gi, '<h2').replace(/<\/h3>/gi, '</h2>');
        break;

      case 'duplicate-id':
        replacementCode = originalHtml.replace(/id=["']([^"']+)["']/i, `id="$1-unique-${nodeIndex + 1}"`);
        break;

      default:
        replacementCode = `${originalHtml} <!-- Repaired for ${plan.ruleId} -->`;
        break;
    }

    const diffFormatted = `- ${originalCode}\n+ ${replacementCode}`;
    const patchId = `patch-${plan.ruleId}-${Date.now().toString(36)}`;
    const patchHash = crypto.createHash('sha256').update(`${originalCode}:${replacementCode}:${plan.ruleId}`).digest('hex');

    return {
      patchId,
      planId: plan.planId,
      file: plan.targetFile || 'src/App.tsx',
      lineStart: 12 + nodeIndex * 4,
      lineEnd: 13 + nodeIndex * 4,
      originalCode,
      replacementCode,
      diffFormatted,
      patchHash,
      timestamp: new Date().toISOString(),
    };
  }
}
