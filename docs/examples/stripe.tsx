import React from 'react';
import type { TableProps } from 'rc-table';
import Table from 'rc-table';
import '../../assets/index.less';

interface FieldType {
  name?: string;
  age?: string;
  address?: string;
}

const columns: TableProps<FieldType>['columns'] = [
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
  { name: 'Ben', age: '14', address: '4 C Street' },
  { name: 'Hali', age: '34', address: '5 C Street' },
  { name: 'Hama', age: '25', address: '6 C Street' },
];

const Demo = () => (
  <div>
    <h2>Table with stripe</h2>
    <Table columns={columns} data={data} stripe />
  </div>
);

export default Demo;
