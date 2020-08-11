import React from 'react';
import Table from '../src';
import '../assets/index.less';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
];

const Demo = () => (
  <Table
    columns={columns}
    data={[]}
    scroll={{
      x: true,
      y: 100,
    }}
  />
);

export default Demo;
