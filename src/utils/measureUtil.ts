/**
 * Attributes that should be removed from measure row DOM to avoid conflicts
 */
const FILTERED_ATTRIBUTES = [
  // Unique identifiers that shouldn't be duplicated in DOM
  'id',
  'data-testid',
  'data-test-id',
  'data-cy', // Cypress
  'data-qa',
  'data-automation-id',
  'data-id',
  'data-key',
] as const;

/**
 * Remove all ID and test attributes from DOM element and its descendants
 * This ensures the measure row complies with HTML spec (no duplicate IDs)
 * and works with custom components whose internal DOM we cannot control at React level
 * @param element - The DOM element to clean
 */
export function cleanMeasureRowAttributes(element: HTMLElement): void {
  if (!element) return;

  const allElements = element.querySelectorAll('*');
  allElements.forEach(el => {
    FILTERED_ATTRIBUTES.forEach(attr => {
      el.removeAttribute(attr);
    });
  });
}
