import { WcagCriterion } from '../../types/index.js';

export interface WcagRuleDefinition {
  ruleId: string;
  wcagCriterion: string;
  criterionName: string;
  level: 'A' | 'AA' | 'AAA' | 'Best Practice';
  description: string;
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  precondition: string;
  transformation: string;
  postcondition: string;
  defaultRepairStrategy: string;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  machineCheckableLogic: string;
  repairTemplate: {
    beforeExample: string;
    afterExample: string;
    diffSnippet: string;
  };
}

export const WCAG_RULE_GRAPH: Record<string, WcagRuleDefinition> = {
  'image-alt': {
    ruleId: 'image-alt',
    wcagCriterion: '1.1.1',
    criterionName: 'Non-text Content',
    level: 'A',
    description: 'Ensures <img> elements have alternate text or a role of none or presentation',
    severity: 'critical',
    precondition: 'Image element (<img> or <svg role="img">) lacks an accessible name or alt attribute.',
    transformation: 'Inject descriptive alt attribute or aria-label derived from context.',
    postcondition: 'Element has a non-empty accessible name property (alt != null || aria-label != null).',
    defaultRepairStrategy: 'Semantic Context Alt Generator',
    risk: 'LOW',
    machineCheckableLogic: 'ASSERT element.tagName === "IMG" && (element.hasAttribute("alt") || element.getAttribute("role") === "presentation");',
    repairTemplate: {
      beforeExample: '<img src="logo.png">',
      afterExample: '<img src="logo.png" alt="Company brand logo">',
      diffSnippet: '- <img src="logo.png">\n+ <img src="logo.png" alt="Company brand logo">',
    },
  },

  'button-name': {
    ruleId: 'button-name',
    wcagCriterion: '4.1.2',
    criterionName: 'Name, Role, Value',
    level: 'A',
    description: 'Ensures buttons have discernible text to assistive technology',
    severity: 'serious',
    precondition: 'Interactive button element has no textual content, aria-label, or title.',
    transformation: 'Inject aria-label or accessible text node matching the action context.',
    postcondition: 'Button computing tree yields an accessible name with length > 0.',
    defaultRepairStrategy: 'Action Purpose Labeling',
    risk: 'LOW',
    machineCheckableLogic: 'ASSERT button.innerText.trim().length > 0 || button.getAttribute("aria-label")?.trim().length > 0;',
    repairTemplate: {
      beforeExample: '<button class="icon-btn"><svg></svg></button>',
      afterExample: '<button class="icon-btn" aria-label="Submit Order"><svg></svg></button>',
      diffSnippet: '- <button class="icon-btn"><svg></svg></button>\n+ <button class="icon-btn" aria-label="Submit Order"><svg></svg></button>',
    },
  },

  'link-name': {
    ruleId: 'link-name',
    wcagCriterion: '2.4.4',
    criterionName: 'Link Purpose (In Context)',
    level: 'A',
    description: 'Ensures links have discernible text and meaningful destination purpose',
    severity: 'serious',
    precondition: 'Anchor <a> element has empty text or vague non-descriptive phrase ("click here").',
    transformation: 'Enhance anchor text or add aria-label providing explicit destination context.',
    postcondition: 'Anchor accessible name is non-empty and provides destination clarity.',
    defaultRepairStrategy: 'Contextual Hyperlink Labeling',
    risk: 'LOW',
    machineCheckableLogic: 'ASSERT link.innerText.trim() !== "Click here" && (link.innerText.trim().length > 0 || link.hasAttribute("aria-label"));',
    repairTemplate: {
      beforeExample: '<a href="/specs">Click here</a>',
      afterExample: '<a href="/specs" aria-label="View technical specifications">View specifications</a>',
      diffSnippet: '- <a href="/specs">Click here</a>\n+ <a href="/specs" aria-label="View technical specifications">View specifications</a>',
    },
  },

  'label': {
    ruleId: 'label',
    wcagCriterion: '1.3.1',
    criterionName: 'Info and Relationships / Labels or Instructions',
    level: 'A',
    description: 'Ensures every form element has a visible label or accessible label connection',
    severity: 'serious',
    precondition: 'Input/select/textarea element lacks an associated <label for="..."> or aria-label.',
    transformation: 'Inject associated <label> element with matching "for" attribute and explicit ID.',
    postcondition: 'Input element references a valid label or defines an explicit aria-label.',
    defaultRepairStrategy: 'Explicit Label-Input Binding',
    risk: 'LOW',
    machineCheckableLogic: 'ASSERT document.querySelector(`label[for="${input.id}"]`) !== null || input.hasAttribute("aria-label");',
    repairTemplate: {
      beforeExample: '<input type="email" id="email" placeholder="Enter email">',
      afterExample: '<label for="email" className="block text-sm font-medium">Email Address</label>\n<input type="email" id="email" placeholder="Enter email">',
      diffSnippet: '- <input type="email" id="email" placeholder="Enter email">\n+ <label for="email">Email Address</label>\n+ <input type="email" id="email" placeholder="Enter email">',
    },
  },

  'color-contrast': {
    ruleId: 'color-contrast',
    wcagCriterion: '1.4.3',
    criterionName: 'Contrast (Minimum)',
    level: 'AA',
    description: 'Ensures the contrast between foreground and background colors meets WCAG 2 AA thresholds (4.5:1)',
    severity: 'serious',
    precondition: 'Calculated luminance ratio between text color and background is below 4.5:1 for standard text.',
    transformation: 'Adjust text hex color to mathematically conform to >= 4.5:1 contrast against background.',
    postcondition: 'Computed color contrast ratio >= 4.50:1 (or 3.0:1 for large text).',
    defaultRepairStrategy: 'Luminance Compliance Shift',
    risk: 'LOW',
    machineCheckableLogic: 'ASSERT calculateLuminanceRatio(fgColor, bgColor) >= 4.50;',
    repairTemplate: {
      beforeExample: '<p style="color: #a8a29e; background: #ffffff;">Subtle text</p>',
      afterExample: '<p style="color: #4b5563; background: #ffffff;">Subtle text</p>',
      diffSnippet: '- color: #a8a29e;\n+ color: #4b5563; /* Conforms to 4.8:1 contrast */',
    },
  },

  'html-has-lang': {
    ruleId: 'html-has-lang',
    wcagCriterion: '3.1.1',
    criterionName: 'Language of Page',
    level: 'A',
    description: 'Ensures every HTML document has a lang attribute defining base language',
    severity: 'serious',
    precondition: 'Root <html> element is missing the lang attribute or has an empty string.',
    transformation: 'Inject lang="en" (or primary language identifier) onto the <html> root tag.',
    postcondition: 'Document root has a valid BCP 47 language code (document.documentElement.lang.length >= 2).',
    defaultRepairStrategy: 'Root Language Specification',
    risk: 'LOW',
    machineCheckableLogic: 'ASSERT document.documentElement.hasAttribute("lang") && document.documentElement.getAttribute("lang").length >= 2;',
    repairTemplate: {
      beforeExample: '<html>\n  <head>',
      afterExample: '<html lang="en">\n  <head>',
      diffSnippet: '- <html>\n+ <html lang="en">',
    },
  },

  'document-title': {
    ruleId: 'document-title',
    wcagCriterion: '2.4.2',
    criterionName: 'Page Titled',
    level: 'A',
    description: 'Ensures each HTML document contains a non-empty <title> element',
    severity: 'moderate',
    precondition: 'Document <head> lacks a <title> element or title is whitespace.',
    transformation: 'Inject descriptive <title> in <head> representing the page context.',
    postcondition: 'document.title.trim().length > 0',
    defaultRepairStrategy: 'Contextual Document Title Injection',
    risk: 'LOW',
    machineCheckableLogic: 'ASSERT document.querySelector("head > title") !== null && document.title.length > 0;',
    repairTemplate: {
      beforeExample: '<head>\n  <meta charset="UTF-8">',
      afterExample: '<head>\n  <meta charset="UTF-8">\n  <title>ProofA11y - Accessibility Dashboard</title>',
      diffSnippet: '+ <title>ProofA11y - Accessibility Dashboard</title>',
    },
  },

  'heading-order': {
    ruleId: 'heading-order',
    wcagCriterion: '1.3.1',
    criterionName: 'Info and Relationships (Heading Hierarchy)',
    level: 'A',
    description: 'Ensures the order of headings is semantically correct without skipping levels',
    severity: 'moderate',
    precondition: 'Heading levels skip hierarchy (e.g. <h3> follows <h1> without an <h2>, or <h5> follows <h3>).',
    transformation: 'Normalize heading tag hierarchy to maintain contiguous nesting (e.g. <h5> -> <h4> or <h3> -> <h2>).',
    postcondition: 'Heading levels increase monotonically by at most 1 level per depth increment.',
    defaultRepairStrategy: 'Sequential Heading Normalizer',
    risk: 'MEDIUM',
    machineCheckableLogic: 'ASSERT currentHeadingLevel - previousHeadingLevel <= 1;',
    repairTemplate: {
      beforeExample: '<h1>Main Header</h1>\n<h3>Customer Section</h3>',
      afterExample: '<h1>Main Header</h1>\n<h2>Customer Section</h2>',
      diffSnippet: '- <h3>Customer Section</h3>\n+ <h2>Customer Section</h2>',
    },
  },

  'duplicate-id': {
    ruleId: 'duplicate-id',
    wcagCriterion: '4.1.2',
    criterionName: 'Name, Role, Value / Parsing',
    level: 'A',
    description: 'Ensures every id attribute value is unique across the document',
    severity: 'minor',
    precondition: 'Multiple DOM elements share the identical "id" attribute.',
    transformation: 'Append unique index suffix or replace duplicate ID with scoped identifier.',
    postcondition: 'document.querySelectorAll(`#${id}`).length === 1',
    defaultRepairStrategy: 'Unique DOM Identifier Deduplication',
    risk: 'LOW',
    machineCheckableLogic: 'ASSERT document.querySelectorAll(`[id="${id}"]`).length === 1;',
    repairTemplate: {
      beforeExample: '<div id="card-1">Card A</div>\n<div id="card-1">Card B</div>',
      afterExample: '<div id="card-1">Card A</div>\n<div id="card-2">Card B</div>',
      diffSnippet: '- <div id="card-1">Card B</div>\n+ <div id="card-2">Card B</div>',
    },
  },

  'aria-allowed-attr': {
    ruleId: 'aria-allowed-attr',
    wcagCriterion: '4.1.2',
    criterionName: 'Name, Role, Value',
    level: 'A',
    description: 'Ensures ARIA attributes are allowed for an element\'s role',
    severity: 'serious',
    precondition: 'Element contains an ARIA attribute prohibited on its native role.',
    transformation: 'Remove prohibited ARIA attribute or reassign valid role.',
    postcondition: 'All applied ARIA attributes are valid for the element\'s computed role.',
    defaultRepairStrategy: 'ARIA Specification Validator',
    risk: 'LOW',
    machineCheckableLogic: 'ASSERT isAriaAttributeAllowedForRole(element.getAttribute("role"), attributeName);',
    repairTemplate: {
      beforeExample: '<div role="presentation" aria-checked="true">Item</div>',
      afterExample: '<div role="checkbox" aria-checked="true" tabIndex="0">Item</div>',
      diffSnippet: '- <div role="presentation" aria-checked="true">\n+ <div role="checkbox" aria-checked="true" tabIndex="0">',
    },
  },
};

/**
 * Returns the formal WCAG definition and repair contract template for a given rule ID.
 */
export function getWcagRuleDefinition(ruleId: string): WcagRuleDefinition {
  if (WCAG_RULE_GRAPH[ruleId]) {
    return WCAG_RULE_GRAPH[ruleId];
  }

  // Fallback dynamic definition
  return {
    ruleId,
    wcagCriterion: '4.1.2',
    criterionName: 'Name, Role, Value',
    level: 'AA',
    description: `Automated accessibility rule ${ruleId}`,
    severity: 'moderate',
    precondition: `Element violates axe-core rule ${ruleId}`,
    transformation: `Apply semantic accessibility patch conforming to ${ruleId}`,
    postcondition: `Axe-core rule ${ruleId} evaluates to PASS`,
    defaultRepairStrategy: 'Standard WCAG Remediation',
    risk: 'MEDIUM',
    machineCheckableLogic: `ASSERT axe.run({ runOnly: ["${ruleId}"] }).violations.length === 0;`,
    repairTemplate: {
      beforeExample: `<!-- Element failing ${ruleId} -->`,
      afterExample: `<!-- Element repaired for ${ruleId} -->`,
      diffSnippet: `// Patched for ${ruleId}`,
    },
  };
}
