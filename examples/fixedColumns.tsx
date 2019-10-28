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
}

const columns: ColumnType<RecordType>[] = [
  { title: 'title1', dataIndex: 'a', key: 'a', width: 100, fixed: 'left' },
  { title: 'title2', dataIndex: 'b', key: 'b', width: 100, fixed: 'left' },
  { title: 'title3', dataIndex: 'c', key: 'c' },
  { title: 'title4', dataIndex: 'b', key: 'd' },
  { title: 'title5', dataIndex: 'b', key: 'e' },
  { title: 'title6', dataIndex: 'b', key: 'f' },
  {
    title: (
      <div>
        title7
        <br />
        <br />
        <br />
        Hello world!
      </div>
    ),
    dataIndex: 'b',
    key: 'g',
  },
  { title: 'title8', dataIndex: 'b', key: 'h' },
  { title: 'title9', dataIndex: 'b', key: 'i' },
  { title: 'title10', dataIndex: 'b', key: 'j' },
  { title: 'title11', dataIndex: 'b', key: 'k' },
  { title: 'title12', dataIndex: 'b', key: 'l', width: 100, fixed: 'right' },
];

const data: RecordType[] = [
  { a: '123', b: 'xxxxxxxx', d: 3, key: '1' },
  { a: 'cdd', b: 'edd12221', d: 3, key: '2' },
  { a: '133', c: 'edd12221', d: 2, key: '3' },
  { a: '133', c: 'edd12221', d: 2, key: '4' },
  { a: '133', c: 'edd12221', d: 2, key: '5' },
  { a: '133', c: 'edd12221', d: 2, key: '6' },
  { a: '133', c: 'edd12221', d: 2, key: '7' },
  { a: '133', c: 'edd12221', d: 2, key: '8' },
  { a: '133', c: 'edd12221', d: 2, key: '9' },
];

const Demo = () => (
  <div style={{ width: 800 }}>
    <h2>Fixed columns</h2>
    <Table
      columns={columns}
      expandedRowRender={({ b, c }) => b || c}
      scroll={{ x: 1200 }}
      data={data}
    />
  </div>
);

export default Demo;
