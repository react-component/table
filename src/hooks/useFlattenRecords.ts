import * as React from 'react';
import type { GetRowKey, Key } from '../interface';

// recursion (flat tree structure)
function fillRecords<T>(
  list: FlattenData<T>[],
  record: T,
  indent: number,
  childrenColumnName: string,
  expandedKeys: Set<Key>,
  getRowKey: GetRowKey<T>,
  index: number,
  rowExpandable?: (record: T) => boolean,
) {
  const key = getRowKey(record, index);

  list.push({
    record,
    indent,
    index,
    rowKey: key,
  });

  const expanded = expandedKeys?.has(key);

  if (
    record &&
    (!rowExpandable || rowExpandable(record)) &&
    Array.isArray(record[childrenColumnName]) &&
    expanded
  ) {
    // expanded state, flat record
    for (let i = 0; i < record[childrenColumnName].length; i += 1) {
      fillRecords(
        list,
        record[childrenColumnName][i],
        indent + 1,
        childrenColumnName,
        expandedKeys,
        getRowKey,
        i,
        rowExpandable,
      );
    }
  }
}

export interface FlattenData<RecordType> {
  record: RecordType;
  indent: number;
  index: number;
  rowKey: Key;
}

/**
 * flat tree data on expanded state
 *
 * @export
 * @template T
 * @param {*} data : table data
 * @param {string} childrenColumnName : 指定树形结构的列名
 * @param {Set<Key>} expandedKeys : 展开的行对应的keys
 * @param {GetRowKey<T>} getRowKey  : 获取当前rowKey的方法
 * @returns flattened data
 */
export default function useFlattenRecords<T>(
  data: T[] | readonly T[],
  childrenColumnName: string,
  expandedKeys: Set<Key>,
  getRowKey: GetRowKey<T>,
  rowExpandable?: (record: T) => boolean,
): FlattenData<T>[] {
  const arr = React.useMemo<FlattenData<T>[]>(() => {
    if (expandedKeys?.size) {
      const list: FlattenData<T>[] = [];

      // collect flattened record
      for (let i = 0; i < data?.length; i += 1) {
        const record = data[i];

        // using array.push or spread operator may cause "Maximum call stack size exceeded" exception if array size is big enough.
        fillRecords(list, record, 0, childrenColumnName, expandedKeys, getRowKey, i, rowExpandable);
      }

      return list;
    }

    return data?.map((item, index) => {
      return {
        record: item,
        indent: 0,
        index,
        rowKey: getRowKey(item, index),
      };
    });
  }, [data, childrenColumnName, expandedKeys, getRowKey, rowExpandable]);

  return arr;
}
