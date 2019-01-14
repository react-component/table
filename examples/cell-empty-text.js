/* eslint-disable no-console,func-names,react/no-multi-comp */
import React from 'react';
import ReactDOM from 'react-dom';
import Table from 'rc-table';
import 'rc-table/assets/index.less';

const columns = [
  { title: 'title1', dataIndex: null, key: 'a' },
  { id: '123', title: 'title2', dataIndex: 'b', key: 'b' },
  { title: 'title3', dataIndex: 'c', key: 'c' },
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

ReactDOM.render(
  <div>
    <Table
      columns={columns}
      data={data}
      cellEmptyText={<span style={{ color: '#f00' }}>暂无数据</span>}
    />
  </div>,
  document.getElementById('__react-content'),
);
