import React from 'react';
import Table from 'rc-table';
import type { TableProps } from 'rc-table';

const columns = [
  {
    title: (
      <div>
        Name
        <div className="filter-dropdown" style={{ display: 'none' }}>
          Filter Content
        </div>
      </div>
    ),
    dataIndex: 'name',
    key: 'name',
    width: 100,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: 80,
  },
];

const data = [
  { key: 1, name: 'John', age: 25 },
  { key: 2, name: 'Jane', age: 30 },
  { key: 3, name: 'Jime', age: 35 },
];

// 注意，这个 measureRow 实际上是一个 <tr> 元素
// 按照 html 规范，tr 的父元素必须是 table/thead/tbody/tfoot，tr 的子元素必须是 th/td
// 因此这里我们用一个 div 包裹是不对的，在控制台中会报错
const measureRowRender: TableProps['measureRowRender'] = measureRow => (
  <div style={{ display: 'none' }}>{measureRow}</div>
);

// 示例：使用 measureRowRender 来隐藏 MeasureRow 中的弹层
const MeasureRowRenderExample: React.FC = () => {
  return (
    <Table
      columns={columns}
      data={data}
      sticky
      scroll={{ x: true }}
      measureRowRender={measureRowRender}
    />
  );
};

export default MeasureRowRenderExample;
