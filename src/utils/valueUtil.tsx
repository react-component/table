import { Key, DataIndex } from '../interface';

const INTERNAL_KEY_PREFIX = 'RC_TABLE_KEY';

function toArray<T>(arr: T | T[]): T[] {
  if (arr === undefined) {
    return [];
  }

  return Array.isArray(arr) ? arr : [arr];
}

export function getPathValue<RecordType>(record: RecordType, path: DataIndex) {
  const pathList = toArray(path);

  let current: any = record;

  for (let i = 0; i < pathList.length; i += 1) {
    if (!current) {
      return null;
    }

    const prop = pathList[i];
    current = current[prop];
  }

  return current;
}

interface GetColumnKeyColumn {
  key?: Key;
  dataIndex?: DataIndex;
}

export function getColumnKey({ key, dataIndex }: GetColumnKeyColumn, index: number) {
  if (key) {
    return key;
  }

  const prefix = dataIndex !== undefined ? toArray(dataIndex).join('-') : INTERNAL_KEY_PREFIX;

  return `${prefix}_${index}`;
}

export function mergeObject<ReturnObject extends object>(
  ...objects: Partial<ReturnObject>[]
): ReturnObject {
  const merged: Partial<ReturnObject> = {};

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

  objects.forEach(clone => {
    fillProps(merged, clone);
  });

  return merged as ReturnObject;
}
