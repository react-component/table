import { Key, DataIndex } from '../interface';

const INTERNAL_KEY_PREFIX = 'RC_TABLE_KEY';

function toArray<T>(arr: T | T[]): T[] {
  if (arr === undefined || arr === null) {
    return [];
  }

  return Array.isArray(arr) ? arr : [arr];
}

export function getPathValue<ValueType, ObjectType extends object>(
  record: ObjectType,
  path: DataIndex,
): ValueType {
  // Skip if path is empty
  if (!path && typeof path !== 'number') {
    return (record as unknown) as ValueType;
  }

  const pathList = toArray(path);

  let current: ValueType | ObjectType = record;

  for (let i = 0; i < pathList.length; i += 1) {
    if (!current) {
      return null;
    }

    const prop = pathList[i];
    current = current[prop];
  }

  return current as ValueType;
}

interface GetColumnKeyColumn {
  key?: Key;
  dataIndex?: DataIndex;
}

export function getColumnsKey(columns: GetColumnKeyColumn[]) {
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

export function mergeObject<ReturnObject extends object>(
  ...objects: Partial<ReturnObject>[]
): ReturnObject {
  const merged: Partial<ReturnObject> = {};

  /* eslint-disable no-param-reassign */
  function fillProps(obj: object, clone: object) {
    if (clone) {
      Object.keys(clone).forEach(key => {
        const value = clone[key];
        if (value && typeof value === 'object') {
          obj[key] = obj[key] || {};
          fillProps(obj[key], value);
        } else {
          obj[key] = value;
        }
      });
    }
  }
  /* eslint-enable */

  objects.forEach(clone => {
    fillProps(merged, clone);
  });

  return merged as ReturnObject;
}

export function validateValue<T>(val: T) {
  return val !== null && val !== undefined;
}

/**
 * Create a packaged array to fast the v8 process speed
 */
export function newArr(len: number): number[] {
  const list: number[] = [];
  for (let i = 0; i < len; i += 1) {
    list[i] = null;
  }
  return list;
}
