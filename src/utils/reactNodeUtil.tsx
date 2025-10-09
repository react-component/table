import React, { cloneElement, isValidElement, memo } from 'react';

const stripProps = (props: Record<string, any>) => {
  const result: Record<string, any> = {};
  for (const key in props) {
    // strip data-*、id、ref, onFocus、onBlur
    if (
      key === 'id' ||
      key === 'ref' ||
      key === 'onFocus' ||
      key === 'onBlur' ||
      key === 'tabIndex' ||
      key.startsWith('data-')
    )
      continue;
    result[key] = props[key];
  }
  return result;
};

/**
 * Recursively clone ReactNode and remove data-*, id, ref, onFocus, onBlur props
 * to avoid potential issues with nested elements in table cells.
 */
const sanitizeCloneElement = memo((node: React.ReactNode): React.ReactNode => {
  if (!isValidElement(node)) {
    return node;
  }
  const cleanedProps = stripProps(node.props);
  if (cleanedProps.children) {
    cleanedProps.children = React.Children.map(cleanedProps.children, child =>
      sanitizeCloneElement(child),
    );
  }
  return cloneElement(node, cleanedProps);
});

export { sanitizeCloneElement };
