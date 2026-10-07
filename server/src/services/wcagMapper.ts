import { WcagCriterion } from '../types/index.js';

// Comprehensive WCAG mapping catalogue
export const WCAG_CRITERIA_MAP: Record<string, { name: string; level: 'A' | 'AA' | 'AAA'; url?: string }> = {
  '1.1.1': { name: 'Non-text Content', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html' },
  '1.2.1': { name: 'Audio-only and Video-only (Prerecorded)', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/audio-only-and-video-only-prerecorded.html' },
  '1.2.2': { name: 'Captions (Prerecorded)', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/captions-prerecorded.html' },
  '1.2.3': { name: 'Audio Description or Media Alternative (Prerecorded)', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/audio-description-or-media-alternative-prerecorded.html' },
  '1.3.1': { name: 'Info and Relationships', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html' },
  '1.3.2': { name: 'Meaningful Sequence', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence.html' },
  '1.3.3': { name: 'Sensory Characteristics', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/sensory-characteristics.html' },
  '1.3.4': { name: 'Orientation', level: 'AA', url: 'https://www.w3.org/WAI/WCAG21/Understanding/orientation.html' },
  '1.3.5': { name: 'Identify Input Purpose', level: 'AA', url: 'https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html' },
  '1.4.1': { name: 'Use of Color', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html' },
  '1.4.2': { name: 'Audio Control', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/audio-control.html' },
  '1.4.3': { name: 'Contrast (Minimum)', level: 'AA', url: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html' },
  '1.4.4': { name: 'Resize text', level: 'AA', url: 'https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html' },
  '1.4.5': { name: 'Images of Text', level: 'AA', url: 'https://www.w3.org/WAI/WCAG21/Understanding/images-of-text.html' },
  '1.4.10': { name: 'Reflow', level: 'AA', url: 'https://www.w3.org/WAI/WCAG21/Understanding/reflow.html' },
  '1.4.11': { name: 'Non-text Contrast', level: 'AA', url: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html' },
  '1.4.12': { name: 'Text Spacing', level: 'AA', url: 'https://www.w3.org/WAI/WCAG21/Understanding/text-spacing.html' },
  '1.4.13': { name: 'Content on Hover or Focus', level: 'AA', url: 'https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html' },
  '2.1.1': { name: 'Keyboard', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html' },
  '2.1.2': { name: 'No Keyboard Trap', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap.html' },
  '2.1.4': { name: 'Character Key Shortcuts', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/character-key-shortcuts.html' },
  '2.2.1': { name: 'Timing Adjustable', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/timing-adjustable.html' },
  '2.2.2': { name: 'Pause, Stop, Hide', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html' },
  '2.4.1': { name: 'Bypass Blocks', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html' },
  '2.4.2': { name: 'Page Titled', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/page-titled.html' },
  '2.4.3': { name: 'Focus Order', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html' },
  '2.4.4': { name: 'Link Purpose (In Context)', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html' },
  '2.4.6': { name: 'Headings and Labels', level: 'AA', url: 'https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels.html' },
  '2.4.7': { name: 'Focus Visible', level: 'AA', url: 'https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html' },
  '2.5.1': { name: 'Pointer Gestures', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/pointer-gestures.html' },
  '2.5.2': { name: 'Pointer Cancellation', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/pointer-cancellation.html' },
  '2.5.3': { name: 'Label in Name', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/label-in-name.html' },
  '3.1.1': { name: 'Language of Page', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html' },
  '3.1.2': { name: 'Language of Parts', level: 'AA', url: 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-parts.html' },
  '3.2.1': { name: 'On Focus', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/on-focus.html' },
  '3.2.2': { name: 'On Input', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/on-input.html' },
  '3.3.1': { name: 'Error Identification', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html' },
  '3.3.2': { name: 'Labels or Instructions', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html' },
  '3.3.3': { name: 'Error Suggestion', level: 'AA', url: 'https://www.w3.org/WAI/WCAG21/Understanding/error-suggestion.html' },
  '3.3.4': { name: 'Error Prevention (Legal, Financial, Data)', level: 'AA', url: 'https://www.w3.org/WAI/WCAG21/Understanding/error-prevention-legal-financial-data.html' },
  '4.1.1': { name: 'Parsing (Obsolete in WCAG 2.2)', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/parsing.html' },
  '4.1.2': { name: 'Name, Role, Value', level: 'A', url: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html' },
  '4.1.3': { name: 'Status Messages', level: 'AA', url: 'https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html' },
};

// Direct Axe rule ID to Primary WCAG mapping
export const RULE_WCAG_MAPPINGS: Record<string, string[]> = {
  'image-alt': ['1.1.1'],
  'input-image-alt': ['1.1.1'],
  'area-alt': ['1.1.1', '2.4.4', '4.1.2'],
  'object-alt': ['1.1.1'],
  'svg-img-alt': ['1.1.1'],
  'role-img-alt': ['1.1.1'],
  'color-contrast': ['1.4.3'],
  'color-contrast-enhanced': ['1.4.6'],
  'link-name': ['2.4.4', '4.1.2'],
  'button-name': ['4.1.2'],
  'label': ['1.3.1', '3.3.2', '4.1.2'],
  'label-title-only': ['1.3.1', '3.3.2'],
  'html-has-lang': ['3.1.1'],
  'html-lang-valid': ['3.1.1'],
  'valid-lang': ['3.1.2'],
  'document-title': ['2.4.2'],
  'heading-order': ['1.3.1'],
  'page-has-heading-one': ['1.3.1'],
  'empty-heading': ['1.3.1', '2.4.6'],
  'landmark-one-main': ['1.3.1'],
  'landmark-complementary-is-top-level': ['1.3.1'],
  'landmark-no-duplicate-banner': ['1.3.1'],
  'landmark-no-duplicate-contentinfo': ['1.3.1'],
  'landmark-main-is-top-level': ['1.3.1'],
  'region': ['1.3.1'],
  'bypass': ['2.4.1'],
  'skip-link': ['2.4.1'],
  'tabindex': ['2.4.3'],
  'focus-order-semantics': ['2.4.3'],
  'duplicate-id': ['4.1.1', '4.1.2'],
  'duplicate-id-active': ['4.1.1'],
  'duplicate-id-aria': ['4.1.2'],
  'aria-allowed-attr': ['4.1.2'],
  'aria-required-attr': ['4.1.2'],
  'aria-valid-attr-value': ['4.1.2'],
  'aria-valid-attr': ['4.1.2'],
  'aria-roles': ['4.1.2'],
  'aria-hidden-body': ['4.1.2'],
  'aria-hidden-focus': ['4.1.2', '1.3.1'],
  'aria-input-field-name': ['4.1.2'],
  'aria-command-name': ['4.1.2'],
  'aria-progressbar-name': ['4.1.2'],
  'aria-dialog-name': ['4.1.2'],
  'aria-treeitem-name': ['4.1.2'],
  'meta-viewport': ['1.4.4', '1.4.10'],
  'meta-viewport-large': ['1.4.4'],
  'meta-refresh': ['2.2.1'],
  'nested-interactive': ['4.1.2'],
  'select-name': ['4.1.2', '1.3.1'],
  'form-field-multiple-labels': ['3.3.2'],
  'frame-title': ['2.4.1', '4.1.2'],
  'audio-caption': ['1.2.2'],
  'video-caption': ['1.2.2'],
  'accesskeys': ['2.1.1'],
};

/**
 * Maps axe-core rule tags and IDs to human-readable WCAG criteria
 */
export function mapAxeToWcag(ruleId: string, tags: string[] = []): WcagCriterion[] {
  const matchedCriteriaIds = new Set<string>();

  // 1. Check explicit rule mapping table
  if (RULE_WCAG_MAPPINGS[ruleId]) {
    RULE_WCAG_MAPPINGS[ruleId].forEach(id => matchedCriteriaIds.add(id));
  }

  // 2. Parse tags like "wcag111" -> "1.1.1", "wcag143" -> "1.4.3", "wcag412" -> "4.1.2"
  tags.forEach(tag => {
    const match3 = tag.match(/^wcag(\d)(\d)(\d)$/);
    if (match3) {
      const criterionId = `${match3[1]}.${match3[2]}.${match3[3]}`;
      matchedCriteriaIds.add(criterionId);
      return;
    }
    const match4 = tag.match(/^wcag(\d)(\d)(\d{2})$/);
    if (match4) {
      const criterionId = `${match4[1]}.${match4[2]}.${match4[3]}`;
      matchedCriteriaIds.add(criterionId);
      return;
    }
  });

  const results: WcagCriterion[] = [];

  matchedCriteriaIds.forEach(id => {
    if (WCAG_CRITERIA_MAP[id]) {
      const info = WCAG_CRITERIA_MAP[id];
      results.push({
        id,
        name: info.name,
        level: info.level,
        url: info.url,
      });
    } else {
      results.push({
        id,
        name: `WCAG Criterion ${id}`,
        level: 'AA',
        url: `https://www.w3.org/WAI/WCAG21/quickref/#${id.replace(/\./g, '')}`,
      });
    }
  });

  // If no specific WCAG tag was found but has best-practice
  if (results.length === 0) {
    if (tags.includes('best-practice')) {
      results.push({
        id: 'Best Practice',
        name: 'Accessibility Best Practice',
        level: 'Best Practice',
      });
    } else {
      results.push({
        id: 'WCAG General',
        name: 'General WCAG Guideline',
        level: 'A',
      });
    }
  }

  return results;
}
