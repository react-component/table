import type { GetRowKey, Key } from '@/interface';

// recursion (flat tree structure)
function flatRecord<T>(
  record: T,
  indent: number,
  options: { childrenColumnName: string; expandedKeys: Set<Key>; getRowKey: GetRowKey<T> },
) {
  const { childrenColumnName, expandedKeys, getRowKey } = options;

  const arr = [];

  arr.push({
    record,
    indent,
  });

  const key = getRowKey(record);

  const expanded = expandedKeys && expandedKeys.has(key);

  if (
    record &&
    Array.isArray(record[childrenColumnName]) &&
    record[childrenColumnName].length &&
    expanded
  ) {
    // expanded state, flat record
    for (let i = 0; i < record[childrenColumnName].length; i += 1) {
      const tempArr = flatRecord(record[childrenColumnName][i], indent + 1, options);

      arr.push(...tempArr);
    }
  }

  return arr;
}

/**
 * flat tree data on expanded state
 *
 * @template T
 * @param {*} data : table data
 * @param {{ childrenColumnName: string, expandedKeys: Set<Key>, getRowKey: GetRowKey<T> }} options : { childrenColumnName : 指定树形结构的列名, expandedKeys : 展开的行对应的keys, getRowKeys: 获取当前rowKey的方法 }
 * @returns flattened data
 */
export default function useFlattenRecords<T>(
  data,
  options: { childrenColumnName: string; expandedKeys: Set<Key>; getRowKey: GetRowKey<T> },
) {
  const arr: { record: T; indent: number }[] = [];

  // collect flattened record
  for (let i = 0; i < data?.length; i += 1) {
    const record = data[i];

    arr.push(...flatRecord<T>(record, 0, options));
  }

  return arr;
}
