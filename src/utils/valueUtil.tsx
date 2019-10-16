import { ColumnType } from '../interface';

const INTERNAL_KEY_PREFIX = 'RC_TABLE_KEY';

function toArray<T>(arr: T | T[]): T[] {
  if (arr === undefined) {
    return [];
  }

  return Array.isArray(arr) ? arr : [arr];
}

export function getPathValue<RecordType>(
  record: RecordType,
  path: string | number | (string | number)[],
) {
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

export function getColumnKey(column: ColumnType<any>, index: number) {
  if ('key' in column) {
    return column.key;
  }

  if ('dataIndex' in column) {
    return toArray(column.dataIndex).join('-');
  }

  return `${INTERNAL_KEY_PREFIX}_${index}`;
}
