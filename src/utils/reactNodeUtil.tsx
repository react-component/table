import React, { cloneElement, isValidElement } from 'react';

// Props 类型定义
type Props = Record<string, unknown>;

// 缓存已处理的 props，避免重复计算
const propsCache = new WeakMap<Props, Props>();

// 需要过滤的属性集合，使用 Set 提高查找性能
const FILTERED_PROPS = new Set(['id', 'ref', 'onFocus', 'onBlur', 'tabIndex']);

const stripProps = (props: Props) => {
  // 检查缓存
  if (propsCache.has(props)) {
    const cachedProps = propsCache.get(props);
    return cachedProps || props;
  }

  const result: Props = {};
  let hasFilteredProps = false;

  for (const key in props) {
    // 使用 Set 快速查找，避免多个 || 判断
    if (FILTERED_PROPS.has(key) || key.startsWith('data-')) {
      hasFilteredProps = true;
      continue;
    }
    result[key] = props[key];
  }

  // 如果没有需要过滤的属性，直接返回原 props
  if (!hasFilteredProps) {
    propsCache.set(props, props);
    return props;
  }

  // 缓存结果
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
  // 限制递归深度，防止性能问题和堆栈溢出
  if (depth >= maxDepth || !isValidElement(node)) {
    return node;
  }

  const cleanedProps = stripProps(node.props);

  // 如果 props 没有变化且没有 children，直接返回原节点
  if (cleanedProps === node.props && !cleanedProps.children) {
    return node;
  }

  // 处理 children
  if (cleanedProps.children) {
    cleanedProps.children = React.Children.map(cleanedProps.children, (child: React.ReactNode) =>
      sanitizeCloneElement(child, depth + 1, maxDepth),
    );
  }

  return cloneElement(node, cleanedProps);
};

export { sanitizeCloneElement };
