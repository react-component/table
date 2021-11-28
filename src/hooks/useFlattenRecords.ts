import type { GetRowKey, Key } from '@/interface';
import * as React from 'react';

// recursion (flat tree structure)
function flatRecord<T>(
  record: T,
  indent: number,
  childrenColumnName: string,
  expandedKeys: Set<Key>,
  getRowKey: GetRowKey<T>,
  index: number,
) {
  const arr = [];

  arr.push({
    record,
    indent,
    index,
  });

  const key = getRowKey(record);

  const expanded = expandedKeys?.has(key);

  if (record && Array.isArray(record[childrenColumnName]) && expanded) {
    // expanded state, flat record
    for (let i = 0; i < record[childrenColumnName].length; i += 1) {
      const tempArr = flatRecord(
        record[childrenColumnName][i],
        indent + 1,
        childrenColumnName,
        expandedKeys,
        getRowKey,
        i,
      );

      arr.push(...tempArr);
    }
  }

  return arr;
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
  data,
  childrenColumnName: string,
  expandedKeys: Set<Key>,
  getRowKey: GetRowKey<T>,
) {
  const arr: { record: T; indent: number; index: number }[] = React.useMemo(() => {
    if (expandedKeys?.size) {
      const temp: { record: T; indent: number; index: number }[] = [];

      // collect flattened record
      for (let i = 0; i < data?.length; i += 1) {
        const record = data[i];

        temp.push(...flatRecord<T>(record, 0, childrenColumnName, expandedKeys, getRowKey, i));
      }

      return temp;
    }

    return data?.map((item, index) => {
      return {
        record: item,
        indent: 0,
        index,
      };
    });
  }, [data, childrenColumnName, expandedKeys, getRowKey]);

  return arr;
}
