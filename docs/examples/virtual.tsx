import React from 'react';
import '../../assets/index.less';
import type { ColumnsType } from '../../src/interface';
import Table from '../../src/StaticTable';

interface RecordType {
  a: string;
  b?: string;
  c?: string;
  d: number;
  indexKey: string;
}

const columns: ColumnsType = [
  { title: 'title1', dataIndex: 'a', key: 'a', width: 100, fixed: 'left' },
  { title: 'title2', dataIndex: 'b', key: 'b', width: 100, fixed: 'left', ellipsis: true },
  { title: 'title3', dataIndex: 'c', key: 'c' },
  // { title: 'title4', dataIndex: 'b', key: 'd' },
  // { title: 'title5', dataIndex: 'b', key: 'e' },
  {
    title: 'title4',
    key: 'd',
    children: [
      // Children columns
      { title: 'title4-1' },
      { title: 'title4-2' },
    ],
  },
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
  { title: 'title8', dataIndex: 'b' },
  { title: 'title9', dataIndex: 'b', key: 'i' },
  { title: 'title10', dataIndex: 'b', key: 'j' },
  { title: 'title11', dataIndex: 'b', key: 'k', width: 50, fixed: 'right' },
  { title: 'title12', dataIndex: 'b', key: 'l', width: 100, fixed: 'right' },
];

const data: RecordType[] = new Array(1000).fill(null).map((_, index) => ({
  a: `a${index}`,
  b: `b${index}`,
  c: `c${index}`,
  d: index,
  indexKey: `${index}`,
}));

const Demo = () => {
  const [scrollY, setScrollY] = React.useState(true);

  return (
    <div style={{ width: 800 }}>
      <label>
        <input type="checkbox" checked={scrollY} onChange={() => setScrollY(!scrollY)} />
        Scroll Y
      </label>
      <Table
        columns={columns}
        // expandedRowRender={({ b, c }) => b || c}
        scroll={{ x: 1200, y: scrollY ? 200 : null }}
        data={data}
        rowKey="indexKey"
      />
    </div>
  );
};

export default Demo;
