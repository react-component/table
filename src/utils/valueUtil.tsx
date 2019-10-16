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

  let current = record;

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
