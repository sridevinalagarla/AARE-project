import { AccessibilityViolation, IssueAnalysis } from '../types/index.js';
import { getWcagRuleDefinition } from '../engines/wcag/wcagKnowledge.js';

export class IssueAnalyzer {
  /**
   * Analyzes an accessibility violation and extracts actionable root cause & context.
   */
  public static analyzeViolation(violation: AccessibilityViolation, nodeIndex: number = 0): IssueAnalysis {
    const ruleDef = getWcagRuleDefinition(violation.id);
    const node = violation.nodes[nodeIndex] || { html: '', target: [] };
    const targetSelector = node.target.join(' > ') || 'target element';

    let rootCause = '';
    let explanation = '';
    let suggestedAction = '';

    switch (violation.id) {
      case 'image-alt':
        rootCause = 'Image tag is missing the required "alt" attribute, rendering it invisible to screen readers.';
        explanation = `The element "${node.html || '<img>'}" does not provide alternative text. Assistive technology users cannot perceive the content or function of this non-text visual asset.`;
        suggestedAction = 'Inject meaningful alt text describing the image content or set alt="" if purely decorative.';
        break;

      case 'button-name':
        rootCause = 'Interactive <button> element contains no text nodes, aria-label, or title.';
        explanation = `The button "${node.html || '<button>'}" lacks accessible text. Screen reader users will hear "button" without knowing what action it triggers.`;
        suggestedAction = 'Add an aria-label attribute specifying the button action (e.g. aria-label="Submit form").';
        break;

      case 'link-name':
        rootCause = 'Link lacks discernible text or contains generic non-descriptive wording.';
        explanation = `The anchor "${node.html || '<a>'}" does not communicate its target destination. Screen readers navigation lists cannot interpret the purpose.`;
        suggestedAction = 'Replace ambiguous text with descriptive destination text or provide an explicit aria-label.';
        break;

      case 'label':
        rootCause = 'Form input is not programmatically associated with a visible label or aria-label.';
        explanation = `The input "${node.html || '<input>'}" does not reference an associated <label for="..."> element, violating WCAG form input criteria.`;
        suggestedAction = 'Attach a dedicated <label> element with matching "for" and "id" attributes or provide aria-label.';
        break;

      case 'color-contrast':
        rootCause = 'Foreground text color does not meet the minimum 4.5:1 contrast ratio against the background.';
        explanation = `The element text fails WCAG 1.4.3 minimum color contrast, creating significant visual barriers for low-vision and color-blind users.`;
        suggestedAction = 'Darken the text color or adjust background luminance to reach >= 4.5:1 contrast ratio.';
        break;

      case 'html-has-lang':
        rootCause = 'Root <html> element is missing a valid lang attribute.';
        explanation = `Screen readers cannot determine the default pronunciation rules, phonetic dictionary, or voice synthesis language.`;
        suggestedAction = 'Add lang="en" (or appropriate language code) to the <html> opening tag.';
        break;

      case 'document-title':
        rootCause = 'HTML document lacks a descriptive <title> in <head>.';
        explanation = `The browser tab and assistive technology cannot announce the primary purpose of the document upon loading.`;
        suggestedAction = 'Add a non-empty <title> tag inside the document <head>.';
        break;

      default:
        rootCause = violation.description || ruleDef.description;
        explanation = `${ruleDef.description}. Precondition: ${ruleDef.precondition}`;
        suggestedAction = ruleDef.transformation;
        break;
    }

    return {
      violationId: `${violation.id}-${nodeIndex}`,
      ruleId: violation.id,
      wcagCriterion: ruleDef.wcagCriterion,
      rootCause,
      explanation,
      affectedCodeSnippet: node.html || '<element>',
      targetSelector,
      semanticContext: `${ruleDef.criterionName} (Level ${ruleDef.level})`,
      suggestedAction,
    };
  }
}
