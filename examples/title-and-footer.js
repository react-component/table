/* eslint-disable no-console,func-names,react/no-multi-comp */
import React from 'react';
import Table from '../src';
import '../assets/index.less';

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

const data = [
  { a: '123', key: '1' },
  { a: 'cdd', b: 'edd', key: '2' },
  { a: '1333', c: 'eee', d: 2, key: '3' },
];

const Demo = () => (
  <div>
    <h2>title and footer</h2>
    <Table
      columns={columns}
      data={data}
      title={currentData => <div>Title: {currentData.length} items</div>}
      footer={currentData => <div>Footer: {currentData.length} items</div>}
    />
  </div>
);

export default Demo;
/* eslint-enable */
