import React from 'react';
import '../../assets/index.less';
import { PancakeTable } from '../../src';
import type { ColumnsType } from '../../src/interface';

interface RecordType {
  a_1: string;
  a: string;
  b?: string;
  c?: string;
}

const fakeRecord = recordIndex => {
  return new Array(200).fill(0).reduce((acc, _, index) => {
    acc[`a_${index}`] = `duma ${recordIndex + 1}-${index + 1}`;
    return acc;
  }, {});
};

const columns1: ColumnsType[] = new Array(200).fill(null).map((_, index) => ({
  title: `title ${index}`,
  dataIndex: `a_${index}`,
  width: 100,
}));

// const data: RecordType[] = new Array(4 * 10000).fill(null).map((_, index) => ({
//   a_1: `duma ${index}`,
//   a: `a${index}`,
//   b: `b${index}`,
//   c: `c${index}`,
// }));

const cloners = new Array(4 * 10_000).fill(null).map((_, index) => fakeRecord(index));

const Demo = () => {
  const [columns] = React.useState(columns1);

  return (
    <div style={{ width: 800, padding: `0 64px` }}>
      <div style={{ display: 'flex', gap: 5, marginBottom: 10, alignItems: 'center' }}>
        <img style={{ height: 22 }} src="https://crm.pancake.vn/static/img/logo-crm.svg" />
        <b>pancake</b> <span style={{ color: '#475467' }}>sales CRM</span>
      </div>
      <PancakeTable
        getContainerWidth={(_, w) => w - 1}
        columns={columns}
        scroll={{ y: 200 }}
        data={cloners}
        rowKey="a"
      />
    </div>
  );
};

export default Demo;
