import React from 'react';
import '../../assets/index.less';
import { VirtualTable } from '../../src';
import type { ColumnsType } from '../../src/interface';

interface RecordType {
  a: string;
  b?: string;
  c?: string;
}

const columns1: ColumnsType = [
  { title: 'title1', dataIndex: 'a', width: 100 },
  { title: 'title2', dataIndex: 'b', width: 100 },
  {
    title: 'title13',
    dataIndex: 'c',
  },
];

const columns2: ColumnsType = [
  { title: 'title1', dataIndex: 'a', width: 100 },
  { title: 'title2', dataIndex: 'b', width: 100 },
];

const columns3: ColumnsType = [
  { title: 'title1', dataIndex: 'a', width: 500 },
  { title: 'title2', dataIndex: 'b', width: 500 },
];

const data: RecordType[] = new Array(4 * 10000).fill(null).map((_, index) => ({
  a: `a${index}`,
  b: `b${index}`,
  c: `c${index}`,
}));

const Demo = () => {
  const [columns, setColumns] = React.useState(columns1);

  return (
    <div style={{ width: 800, padding: `0 64px` }}>
      <label>
        <input type="radio" checked={columns === columns1} onChange={() => setColumns(columns1)} />
        Fill Rest
      </label>
      <label>
        <input type="radio" checked={columns === columns2} onChange={() => setColumns(columns2)} />
        Stretch
      </label>
      <label>
        <input type="radio" checked={columns === columns3} onChange={() => setColumns(columns3)} />
        Over Size
      </label>

      <VirtualTable
        getContainerWidth={(_, w) => w - 1}
        columns={columns}
        scroll={{ y: 200 }}
        data={data}
        rowKey="a"
      />
    </div>
  );
};

export default Demo;
