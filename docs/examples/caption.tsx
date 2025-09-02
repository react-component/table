import React from 'react';
import type { TableProps } from 'rc-table';
import Table from 'rc-table';
import '../../assets/index.less';

const columns: TableProps['columns'] = [
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
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
];

const data = [
  { name: 'John', age: '25', address: '1 A Street' },
  { name: 'Fred', age: '38', address: '2 B Street' },
  { name: 'Anne', age: '47', address: '3 C Street' },
];

const Demo = () => (
  <div>
    <h2>Table with basic caption</h2>
    <Table columns={columns} data={data} caption="Users including age and address" />
    <br />
    <h2>Table with complex caption</h2>
    <Table
      columns={columns}
      data={data}
      caption={
        <div style={{ textAlign: 'right' }}>
          Users who are <em>old</em>
        </div>
      }
    />
  </div>
);

export default Demo;
