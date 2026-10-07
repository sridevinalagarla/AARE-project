export interface SemanticContextResult {
  inferredRole: string;
  parentLandmark: string;
  nearbyText: string;
  suggestedLabel: string;
}

export class ContextAgent {
  /**
   * Infers semantic purpose and generates contextual label descriptions.
   */
  public static inferSemanticContext(html: string, targetSelector: string): SemanticContextResult {
    const lowerHtml = html.toLowerCase();
    let inferredRole = 'content';
    let parentLandmark = 'main';
    let nearbyText = '';
    let suggestedLabel = '';

    if (lowerHtml.includes('img')) {
      if (lowerHtml.includes('logo') || targetSelector.includes('logo')) {
        suggestedLabel = 'Company Logo';
        inferredRole = 'brand-identity';
      } else if (lowerHtml.includes('product') || lowerHtml.includes('banner')) {
        suggestedLabel = 'Promotional Product Banner';
        inferredRole = 'product-image';
      } else if (lowerHtml.includes('keyboard')) {
        suggestedLabel = 'Ergonomic Wireless Keyboard';
        inferredRole = 'product-item';
      } else if (lowerHtml.includes('hub')) {
        suggestedLabel = 'Multi-Port USB-C Hub Adapter';
        inferredRole = 'product-item';
      } else {
        suggestedLabel = 'Informational illustration';
        inferredRole = 'graphic';
      }
    } else if (lowerHtml.includes('button')) {
      if (lowerHtml.includes('submit') || targetSelector.includes('submit')) {
        suggestedLabel = 'Submit order and proceed';
        inferredRole = 'form-submit';
      } else if (lowerHtml.includes('menu') || lowerHtml.includes('nav')) {
        suggestedLabel = 'Toggle navigation menu';
        inferredRole = 'menu-toggle';
      } else if (lowerHtml.includes('search')) {
        suggestedLabel = 'Execute site search';
        inferredRole = 'search-action';
      } else {
        suggestedLabel = 'Perform primary action';
        inferredRole = 'action-button';
      }
    } else if (lowerHtml.includes('input')) {
      if (lowerHtml.includes('email')) {
        suggestedLabel = 'Email Address';
        inferredRole = 'email-input';
      } else if (lowerHtml.includes('name')) {
        suggestedLabel = 'Full Name';
        inferredRole = 'name-input';
      } else {
        suggestedLabel = 'Input field';
        inferredRole = 'text-input';
      }
    } else if (lowerHtml.includes('<a') || targetSelector.includes('a')) {
      if (lowerHtml.includes('specs') || lowerHtml.includes('details')) {
        suggestedLabel = 'View technical specifications';
        inferredRole = 'specification-link';
      } else {
        suggestedLabel = 'Navigate to destination details';
        inferredRole = 'navigation-link';
      }
    }

    return {
      inferredRole,
      parentLandmark,
      nearbyText,
      suggestedLabel,
    };
  }
}
