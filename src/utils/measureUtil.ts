import * as React from 'react';

/**
 * Props that should be filtered out from measure row elements to avoid DOM conflicts
 */
const FILTERED_PROPS = [
  // Unique identifiers that shouldn't be duplicated in DOM
  'id',
  'data-testid',
  'data-test-id',
  'data-cy', // Cypress
  'data-qa',
  'data-automation-id',
  'data-id',
  'data-key',

  // Event handlers that are unnecessary in hidden measure elements
  'onClick',
  'onMouseEnter',
  'onMouseLeave',
  'onFocus',
  'onBlur',
  'onKeyDown',
  'onKeyPress',
  'onKeyUp',
  'onDoubleClick',
  'onContextMenu',

  // Accessibility props that might reference other elements and cause conflicts
  'aria-describedby',
  'aria-labelledby',
  'aria-controls',
  'aria-owns',

  // Form-related props that might conflict
  'name',
  'htmlFor',
  'for',
] as const;

/**
 * Filter props from a React element that might cause DOM conflicts in measure row
 * @param element - The React element to filter
 * @param deep - Whether to recursively filter nested elements
 * @returns A new React element with filtered props
 */
export function filterMeasureProps<T = any>(
  element: React.ReactElement<T>,
  deep: boolean = true,
): React.ReactElement<T> {
  if (!React.isValidElement(element)) {
    return element;
  }

  const filteredProps = { ...element.props } as any;

  FILTERED_PROPS.forEach(prop => {
    filteredProps[prop] = undefined;
  });

  // Nullify ref to avoid warnings and conflicts
  filteredProps.ref = null;

  // Recursively filter children if deep filtering is enabled
  if (deep && filteredProps.children) {
    filteredProps.children = filterMeasureChildren(filteredProps.children);
  }

  return React.cloneElement(element, filteredProps);
}

/**
 * Recursively filter children elements
 * @param children - React children to filter
 * @returns Filtered children
 */
function filterMeasureChildren(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return filterMeasureProps(child, true);
    }
    return child;
  });
}

/**
 * Prepare title content for use in measure row
 * @param title - The original title content
 * @returns Filtered title safe for measure row usage
 */
export function prepareMeasureTitle(title: React.ReactNode): React.ReactNode {
  if (React.isValidElement(title)) {
    return filterMeasureProps(title, true); // Enable deep filtering
  }
  return title;
}
