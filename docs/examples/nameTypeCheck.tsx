import Table from 'rc-table';
import React from 'react';

// This file only performs type verification

type FieldType = {
  a: string;
  b?: string[];
  c?: { c1?: string; c2?: string[]; c3?: boolean[] }[];
  d?: { d1?: string[]; d2?: string };
  e?: { e1?: { e2?: string; e3?: string[]; e4: { e5: { e6: string } } } };
  list?: { age?: string }[];
};

export const Demo = () => {
  return (
    <Table<FieldType>
      columns={[
        { dataIndex: 'a' },
        { dataIndex: 'b' },
        { dataIndex: 'c' },
        { dataIndex: ['c', 0] },
        { dataIndex: ['c', 0, 'c1'] },
        { dataIndex: ['c', 0, 'c2'] },
        { dataIndex: ['c', 0, 'c3'] },
        { dataIndex: ['d', 'd1'] },
        { dataIndex: ['d', 'd2'] },
        { dataIndex: ['e', 'e1'] },
        { dataIndex: ['e', 'e1', 'e2'] },
        { dataIndex: ['e', 'e1', 'e3'] },
        { dataIndex: ['e', 'e1', 'e4'] },
        { dataIndex: ['e', 'e1', 'e4', 'e5'] },
        { dataIndex: ['e', 'e1', 'e4', 'e5', 'e6'] },
        { dataIndex: ['list'] },
        { dataIndex: ['list', 0] },
        { dataIndex: ['list', 0, 'age'] },
      ]}
    />
  );
};

declare module 'rc-table' {
  export interface DataIndexExtendProps {
    more?: string;
  }
}

export const Demo2 = () => {
  return <Table<{ name?: string }> columns={[{ dataIndex: 'name' }, { dataIndex: 'more' }]} />;
};
