import React from 'react';
import Table from 'rc-table';
import '../../assets/index.less';
import type { ColumnsType } from '@/interface';

const columns: ColumnsType = [
  {
    title: '手机号',
    dataIndex: 'a',
    colSpan: 2,
    width: 100,
    onCell: (_, index) => {
      const props: React.TdHTMLAttributes<HTMLTableCellElement> = {};
      if (index === 0) props.rowSpan = 1;
      if (index === 1) props.rowSpan = 4;
      if (index === 2) props.rowSpan = 0;
      if (index === 3) props.rowSpan = 0;
      if (index === 4) props.rowSpan = 0;
      if (index === 5) props.rowSpan = undefined;
      return props;
    },
  },
  { title: '电话', dataIndex: 'b', colSpan: 0, width: 100 },
  Table.EXPAND_COLUMN,
  { title: 'Name', dataIndex: 'c', width: 100 },
  { title: 'Address', dataIndex: 'd', width: 200 },
];

const data = [
  { a: '12313132132', b: '0571-43243256', c: '小二', d: '文零西路', e: 'Male', key: 'z' },
  { a: '13812340987', b: '0571-12345678', c: '张三', d: '文一西路', e: 'Male', key: 'a' },
  { a: '13812340987', b: '0571-12345678', c: '张夫人', d: '文一西路', e: 'Female', key: 'b' },
  { a: '13812340987', b: '0571-099877', c: '李四', d: '文二西路', e: 'Male', key: 'c' },
  { a: '13812340987', b: '0571-099877', c: '李四', d: '文二西路', e: 'Male', key: 'd' },
  { a: '1381200008888', b: '0571-099877', c: '王五', d: '文二西路', e: 'Male', key: 'e' },
];

const Demo = () => (
  <div>
    <h2>expanded & rowSpan</h2>
    <Table<Record<string, any>>
      rowKey="key"
      columns={columns}
      data={data}
      expandable={{ expandedRowRender: record => <p style={{ margin: 0 }}>{record.key}</p> }}
      className="table"
    />
  </div>
);

export default Demo;
