import React, { cloneElement, isValidElement } from 'react';

// 预定义需要剥离的属性集合，提高查找性能
const STRIP_PROPS = new Set(['id', 'ref', 'onFocus', 'onBlur', 'tabIndex']);

// 使用 WeakMap 缓存已处理的 props，避免重复计算
const propsCache = new WeakMap<Record<string, unknown>, Record<string, unknown>>();

const stripProps = (props: Record<string, unknown>) => {
  // 检查缓存
  const cached = propsCache.get(props);
  if (cached) {
    return cached;
  }

  let hasChanges = false;
  const result: Record<string, unknown> = {};

  for (const key in props) {
    // 使用 Set 进行 O(1) 查找，优化 data-* 属性检查
    if (STRIP_PROPS.has(key) || key.startsWith('data-')) {
      hasChanges = true;
      continue;
    }
    result[key] = props[key];
  }

  // 如果没有需要剥离的属性，直接返回原对象
  const finalResult = hasChanges ? result : props;

  // 缓存结果
  propsCache.set(props, finalResult);

  return finalResult;
};

// 使用 WeakMap 缓存已处理的节点，避免重复处理
const nodeCache = new WeakMap<React.ReactElement, React.ReactNode>();

/**
 * Recursively clone ReactNode and remove data-*, id, ref, onFocus, onBlur props
 * to avoid potential issues with nested elements in table cells.
 *
 * 优化特性：
 * 1. 缓存机制避免重复处理相同节点
 * 2. 提前退出条件减少不必要的递归
 * 3. 浅层优化：如果props没有变化，直接返回原节点
 */
const sanitizeCloneElement = (node: React.ReactNode): React.ReactNode => {
  if (!isValidElement(node)) {
    return node;
  }

  // 检查缓存
  const cached = nodeCache.get(node);
  if (cached) {
    return cached;
  }

  const cleanedProps = stripProps(node.props as Record<string, unknown>);

  // 如果props没有变化且没有children需要处理，直接返回原节点
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

  // 缓存结果
  nodeCache.set(node, result);

  return result;
};

export { sanitizeCloneElement };
