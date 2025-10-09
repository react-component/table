import React, { cloneElement, isValidElement } from 'react';

// Props type definition
type Props = Record<string, unknown>;

// Cache processed props to avoid redundant calculations
const propsCache = new WeakMap<Props, Props>();

// Set of properties to filter, using Set for better lookup performance
const FILTERED_PROPS = new Set(['id', 'ref', 'onFocus', 'onBlur', 'tabIndex']);

const stripProps = (props: Props) => {
  // Check cache first
  if (propsCache.has(props)) {
    const cachedProps = propsCache.get(props);
    return cachedProps || props;
  }

  const result: Props = {};
  let hasFilteredProps = false;

  for (const key in props) {
    // Use Set for fast lookup, avoiding multiple || conditions
    if (FILTERED_PROPS.has(key) || key.startsWith('data-')) {
      hasFilteredProps = true;
      continue;
    }
    result[key] = props[key];
  }

  // If no props need filtering, return original props directly
  if (!hasFilteredProps) {
    propsCache.set(props, props);
    return props;
  }

  // Cache the result
  propsCache.set(props, result);
  return result;
};

/**
 * Recursively clone ReactNode and remove data-*, id, ref, onFocus, onBlur props
 * to avoid potential issues with nested elements in table cells.
 * @param node - React node to sanitize
 * @param depth - Current recursion depth (for performance control)
 * @param maxDepth - Maximum recursion depth to prevent stack overflow
 */
const sanitizeCloneElement = (
  node: React.ReactNode,
  depth: number = 0,
  maxDepth: number = 10,
): React.ReactNode => {
  // Limit recursion depth to prevent performance issues and stack overflow
  if (depth >= maxDepth || !isValidElement(node)) {
    return node;
  }

  const cleanedProps = stripProps(node.props);

  // If props haven't changed and no children, return original node directly
  if (cleanedProps === node.props && !cleanedProps.children) {
    return node;
  }

  // Process children
  if (cleanedProps.children) {
    cleanedProps.children = React.Children.map(cleanedProps.children, (child: React.ReactNode) =>
      sanitizeCloneElement(child, depth + 1, maxDepth),
    );
  }

  return cloneElement(node, cleanedProps);
};

export { sanitizeCloneElement };
