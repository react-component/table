import React from 'react';
import Table from 'rc-table';
import '../../assets/index.less';

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
    <h2>Table with no header</h2>
    <Table columns={columns} data={data} showHeader={false} />
    <br />
    <h2>Table with header</h2>
    <Table columns={columns} data={data} showHeader={true} />
  </div>
);

export default Demo;
