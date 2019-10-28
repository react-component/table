import React from 'react';
import Table from '../src';
import '../assets/index.less';
import { ColumnType } from '../src/interface';

interface RecordType {
  a: string;
  b?: string;
  c?: string;
  d: number;
  key: string;
  title: string;
}

const columns: ColumnType<RecordType>[] = [
  { title: 'title1', dataIndex: 'a', key: 'a', width: 100, fixed: 'left' },
  { title: 'title2', dataIndex: 'b', key: 'b', width: 100, fixed: 'left' },
  { title: 'title3', dataIndex: 'c', key: 'c' },
  { title: 'title4', dataIndex: 'b', key: 'd' },
  { title: 'title5', dataIndex: 'b', key: 'e' },
  {
    title: 'title6',
    dataIndex: 'b',
    key: 'f',
    render: () => <div style={{ height: '40px', lineHeight: '40px' }}>我很高</div>,
  },
  { title: 'title7', dataIndex: 'b', key: 'g' },
  { title: 'title8', dataIndex: 'b', key: 'h' },
  { title: 'title9', dataIndex: 'b', key: 'i' },
  { title: 'title10', dataIndex: 'b', key: 'j' },
  { title: 'title11', dataIndex: 'b', key: 'k' },
  { title: 'title12', dataIndex: 'b', key: 'l', width: 100, fixed: 'right' },
];

const data: RecordType[] = [
  { a: '123', b: 'xxxxxxxx', d: 3, key: '1', title: 'hello' },
  { a: 'cdd', b: 'edd12221', d: 3, key: '2', title: 'hello' },
  { a: '133', c: 'edd12221', d: 2, key: '3', title: 'hello' },
  { a: '133', c: 'edd12221', d: 2, key: '4', title: 'hello' },
  { a: '133', c: 'edd12221', d: 2, key: '5', title: 'hello' },
  { a: '133', c: 'edd12221', d: 2, key: '6', title: 'hello' },
  { a: '133', c: 'edd12221', d: 2, key: '7', title: 'hello' },
  { a: '133', c: 'edd12221', d: 2, key: '8', title: 'hello' },
  { a: '133', c: 'edd12221', d: 2, key: '9', title: 'hello' },
];

const Demo = () => (
  <div style={{ width: 800 }}>
    <h2>Fixed columns</h2>
    <Table<RecordType>
      columns={columns}
      expandedRowRender={record => record.title}
      scroll={{ x: 1200 }}
      data={data}
      onRow={(record, index) => ({
        className: `customize-class-${index}`,
      })}
    />
  </div>
);

export default Demo;
