import type { TableProps } from 'rc-table';
import Table from 'rc-table';
import React, { useState } from 'react';
import '../../assets/index.less';

interface RecordType {
  a?: string;
  b?: string;
  c?: string;
}

const data = [
  { a: '123', key: '1' },
  { a: 'cdd', b: 'edd', key: '2' },
  { a: '1333', c: 'eee', d: 2, key: '3' },
];

const Demo = () => {
  const [count, setCount] = useState(0);

  const columns: TableProps<any>['columns'] = [
    {
      title: 'title',
      dataIndex: 'a',
      render: () => count,
      // shouldCellUpdate: () => false,
    },
  ];

  return (
    <>
      <button
        onClick={() => {
          setCount(val => val + 1);
        }}
      >
        Click {count} times
      </button>
      <Table<RecordType> columns={columns} data={data} />
    </>
  );
};

export default Demo;
