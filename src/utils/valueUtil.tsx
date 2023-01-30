import type { DataIndex, Key } from '../interface';

const INTERNAL_KEY_PREFIX = 'RC_TABLE_KEY';

function toArray<T>(arr: T | readonly T[]): T[] {
  if (arr === undefined || arr === null) {
    return [];
  }
  return (Array.isArray(arr) ? arr : [arr]) as T[];
}

interface GetColumnKeyColumn {
  key?: Key;
  dataIndex?: DataIndex;
}

export function getColumnsKey(columns: readonly GetColumnKeyColumn[]) {
  const columnKeys: React.Key[] = [];
  const keys: Record<React.Key, boolean> = {};

  columns.forEach(column => {
    const { key, dataIndex } = column || {};

    let mergedKey = key || toArray(dataIndex).join('-') || INTERNAL_KEY_PREFIX;
    while (keys[mergedKey]) {
      mergedKey = `${mergedKey}_next`;
    }
    keys[mergedKey] = true;

    columnKeys.push(mergedKey);
  });

  return columnKeys;
}

export function validateValue<T>(val: T) {
  return val !== null && val !== undefined;
}

export function getHeaderCellNodeWidth(node: HTMLElement) {
  const container = document.createElement('div');
  const { padding, borderWidth, fontSize, fontWeight, boxSizing } = getComputedStyle(node);
  let nodeWidth = 0;
  container.style.whiteSpace = 'nowrap';
  container.style.opacity = '0';
  container.innerHTML = node.innerHTML;
  container.style.display = 'inline-block';
  container.style.padding = padding;
  container.style.borderWidth = borderWidth;
  container.style.fontSize = fontSize;
  container.style.fontWeight = fontWeight;
  container.style.boxSizing = boxSizing;
  document.body.appendChild(container);
  nodeWidth = Math.ceil(parseFloat(getComputedStyle(container).width || '100')) + 1;
  setTimeout(() => {
    document.body.removeChild(container);
  }, 0);
  return nodeWidth;
}
