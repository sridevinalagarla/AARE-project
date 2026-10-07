import { describe, it, expect } from 'vitest';
import { mapAxeToWcag } from '../src/services/wcagMapper.js';

describe('WCAG Mapper Service', () => {
  it('maps image-alt rule to WCAG 1.1.1 Non-text Content', () => {
    const result = mapAxeToWcag('image-alt', ['wcag2a', 'wcag111']);
    expect(result.some(c => c.id === '1.1.1' && c.name === 'Non-text Content')).toBe(true);
  });

  it('maps color-contrast to WCAG 1.4.3 Contrast (Minimum)', () => {
    const result = mapAxeToWcag('color-contrast', ['wcag2aa', 'wcag143']);
    expect(result.some(c => c.id === '1.4.3' && c.name === 'Contrast (Minimum)')).toBe(true);
  });

  it('maps button-name to WCAG 4.1.2 Name, Role, Value', () => {
    const result = mapAxeToWcag('button-name', ['wcag2a', 'wcag412']);
    expect(result.some(c => c.id === '4.1.2')).toBe(true);
  });

  it('handles best-practice tags gracefully', () => {
    const result = mapAxeToWcag('custom-best-practice-rule', ['best-practice']);
    expect(result[0].id).toBe('Best Practice');
    expect(result[0].level).toBe('Best Practice');
  });
});
