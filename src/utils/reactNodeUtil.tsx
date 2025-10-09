import React, { cloneElement, isValidElement } from 'react';

// Predefined set of props to strip for better lookup performance
const STRIP_PROPS = new Set(['id', 'ref', 'onFocus', 'onBlur', 'tabIndex']);

// Use WeakMap to cache processed props and avoid duplicate calculations
const propsCache = new WeakMap<Record<string, unknown>, Record<string, unknown>>();

const stripProps = (props: Record<string, unknown>) => {
  // Check cache first
  const cached = propsCache.get(props);
  if (cached) {
    return cached;
  }

  let hasChanges = false;
  const result: Record<string, unknown> = {};

  for (const key in props) {
    // Use Set for O(1) lookup, optimize data-* attribute checking
    if (STRIP_PROPS.has(key) || key.startsWith('data-')) {
      hasChanges = true;
      continue;
    }
    result[key] = props[key];
  }

  // If no props need to be stripped, return original object directly
  const finalResult = hasChanges ? result : props;

  // Cache the result
  propsCache.set(props, finalResult);

  return finalResult;
};

// Use WeakMap to cache processed nodes and avoid duplicate processing
const nodeCache = new WeakMap<React.ReactElement, React.ReactNode>();

/**
 * Recursively clone ReactNode and remove data-*, id, ref, onFocus, onBlur props
 * to avoid potential issues with nested elements in table cells.
 *
 * Optimization features:
 * 1. Caching mechanism to avoid reprocessing the same nodes
 * 2. Early exit conditions to reduce unnecessary recursion
 * 3. Shallow optimization: return original node directly if props haven't changed
 */
const sanitizeCloneElement = (node: React.ReactNode): React.ReactNode => {
  if (!isValidElement(node)) {
    return node;
  }

  // Check cache first
  const cached = nodeCache.get(node);
  if (cached) {
    return cached;
  }

  const cleanedProps = stripProps(node.props as Record<string, unknown>);

  // If props haven't changed and no children need processing, return original node directly
  if (cleanedProps === node.props && !cleanedProps.children) {
    nodeCache.set(node, node);
    return node;
  }

  let processedChildren = cleanedProps.children;
  if (cleanedProps.children) {
    processedChildren = React.Children.map(cleanedProps.children as React.ReactNode, child =>
      sanitizeCloneElement(child),
    );
  }

  const result = cloneElement(node, {
    ...cleanedProps,
    children: processedChildren,
  } as React.Attributes);

  // Cache the result
  nodeCache.set(node, result);

  return result;
};

export { sanitizeCloneElement };
