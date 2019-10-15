/* eslint-disable no-console,func-names,react/no-multi-comp */
import React from 'react';
import Table from '../src';
import '../assets/index.less

const columns = [
  { title: 'title1', dataIndex: 'a', key: 'a', width: 100 },
  { id: '123', title: 'title2', dataIndex: 'b', key: 'b', width: 100 },
  { title: 'title3', dataIndex: 'c', key: 'c', width: 200 },
  {
    title: 'Operations',
    dataIndex: '',
    key: 'd',
    render() {
      return <a href="#">Operations</a>;
    },
  },
];

const data = [];

const Demo = () => (
  <div>
    <h2>simple table</h2>
    <Table columns={columns} data={data} />
  </div>
);

export default Demo;
