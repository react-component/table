import React, { useState } from 'react';
import Table, { INTERNAL_HOOKS } from 'rc-table';
import type { ColumnType } from 'rc-table';
import '../../assets/index.less';

const data = [
  { a: '123', b: 'xxxxxxxx xxxxxxxx', d: 3, key: '1' },
  { a: 'cdd', b: 'edd12221 edd12221', d: 3, key: '2' },
  { a: '133', c: 'edd12221 edd12221', d: 2, key: '3' },
  { a: '133', c: 'edd12221 edd12221', d: 2, key: '4' },
  { a: '133', c: 'edd12221 edd12221', d: 2, key: '5' },
  { a: '133', c: 'edd12221 edd12221', d: 2, key: '6' },
  { a: '133', c: 'edd12221 edd12221', d: 2, key: '7' },
  { a: '133', c: 'edd12221 edd12221', d: 2, key: '8' },
  { a: '133', c: 'edd12221 edd12221', d: 2, key: '9' },
];

const Demo = () => {
  const [widthMap, setWidthMap] = useState<Map<React.Key, number>>(new Map());

  const columns1 = [
    { title: 'title1', dataIndex: 'aaa', key: 'aaa', width: 100 },
    { title: 'title2', dataIndex: 'bbb', key: 'bbb', width: 100 },
  ].map(i => ({
    ...i,
    resizable: true,
    width: widthMap.get(i.key ?? i.dataIndex) ?? i.width,
  })) as ColumnType<any>[];

  const columns2 = [
    { title: 'title1', dataIndex: 'a', key: 'a', fixed: 'left' },
    { title: 'title2', dataIndex: 'b', key: 'b', fixed: 'left' },
    { title: 'title3', dataIndex: 'c', key: 'c' },
    { title: 'title4', dataIndex: 'b', key: 'd' },
    { title: 'title5', dataIndex: 'b', key: 'e' },
    { title: 'title6', dataIndex: 'b', key: 'f' },
    { title: 'title7', dataIndex: 'b', key: 'g' },
    { title: 'title8', dataIndex: 'b', key: 'h' },
    { title: 'title9', dataIndex: 'b', key: 'i' },
    { title: 'title10', dataIndex: 'b', key: 'j' },
    { title: 'title11', dataIndex: 'b', key: 'k', fixed: 'right' },
    { title: 'title12', dataIndex: 'b', key: 'l', fixed: 'right' },
  ].map(i => ({
    ...i,
    resizable: true,
    width: widthMap.get(i.key ?? i.dataIndex) ?? 150,
  })) as ColumnType<any>[];

  return (
    <div>
      table width: 800px {'columns=[{width: 100, width: 100}]'} 情况
      <Table
        style={{ width: 800 }}
        scroll={{ y: 300, x: columns1.reduce((t, c) => t + (c.width as number), 0) }}
        columns={columns1}
        data={data}
        onColumnResizeComplete={({ columnWidths }) => {
          setWidthMap(prev => {
            const result = new Map(prev);
            columnWidths.forEach(i => {
              result.set(i.columnKey, i.width);
            });
            return result;
          });
        }}
        internalHooks={INTERNAL_HOOKS}
        getContainerWidth={(ele, width) => {
          // Minus border
          const borderWidth = getComputedStyle(
            ele.querySelector('.rc-table-body'),
          ).borderInlineStartWidth;
          const mergedWidth = width - parseInt(borderWidth, 10);
          return mergedWidth;
        }}
      />
      <br />
      大多数情况
      <Table
        style={{ width: 800 }}
        scroll={{ y: 300, x: columns2.reduce((t, c) => t + (c.width as number), 0) }}
        columns={columns2}
        data={data}
        onColumnResizeComplete={({ columnWidths }) => {
          setWidthMap(prev => {
            const result = new Map(prev);
            columnWidths.forEach(i => {
              result.set(i.columnKey, i.width);
            });
            return result;
          });
        }}
        internalHooks={INTERNAL_HOOKS}
        getContainerWidth={(ele, width) => {
          // Minus border
          const borderWidth = getComputedStyle(
            ele.querySelector('.rc-table-body'),
          ).borderInlineStartWidth;
          const mergedWidth = width - parseInt(borderWidth, 10);
          return mergedWidth;
        }}
      />
    </div>
  );
};

export default Demo;
