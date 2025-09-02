import type { DataIndex, Key } from '../interface';

const INTERNAL_KEY_PREFIX = 'RC_TABLE_KEY';

function toArray<T>(arr: T | readonly T[]): T[] {
  if (arr === undefined || arr === null) {
    return [];
  }
  return (Array.isArray(arr) ? arr : [arr]) as T[];
}

export interface GetColumnKeyColumn<T = any> {
  key?: Key;
  dataIndex?: DataIndex<T>;
}

export function getColumnsKey<T = any>(columns: readonly GetColumnKeyColumn<T>[]) {
  const columnKeys: React.Key[] = [];
  const keys: Record<PropertyKey, boolean> = {};

  columns.forEach(column => {
    const { key, dataIndex } = column || {};

    let mergedKey = key || toArray(dataIndex).join('-') || INTERNAL_KEY_PREFIX;
    while (keys[mergedKey as string]) {
      mergedKey = `${mergedKey}_next`;
    }
    keys[mergedKey as string] = true;

    columnKeys.push(mergedKey);
  });

  return columnKeys;
}

export function validateValue<T>(val: T) {
  return val !== null && val !== undefined;
}

export function validNumberValue(value: any) {
  return typeof value === 'number' && !Number.isNaN(value);
}
