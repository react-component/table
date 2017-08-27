/* eslint-disable no-console,func-names,react/no-multi-comp */
import React from 'react';
import ReactDOM from 'react-dom';
import Table from 'rc-table';
import 'rc-table/assets/index.less';

const columns = [
  { title: 'title1', dataIndex: 'a', key: 'a', width: 100, fixed: 'left' },
  { title: 'title2', dataIndex: 'b', key: 'b', width: 100, fixed: 'left' },
  { title: 'title3', dataIndex: 'c', key: 'c', width: 150 },
  { title: 'title4', dataIndex: 'c', key: 'd', width: 150 },
  { title: 'title5', dataIndex: 'c', key: 'e', width: 150 },
  { title: 'title6', dataIndex: 'c', key: 'f', width: 150 },
  { title: 'title7', dataIndex: 'c', key: 'g', width: 150 },
  { title: 'title8', dataIndex: 'c', key: 'h', width: 150 },
  { title: 'title9', dataIndex: 'b', key: 'i', width: 150 },
  { title: 'title10', dataIndex: 'b', key: 'j', width: 150 },
  { title: 'title11', dataIndex: 'b', key: 'k', width: 150 },
  { title: 'title12', dataIndex: 'b', key: 'l', width: 100, fixed: 'right' },
];

const data = [];

ReactDOM.render(
  <div>
    <h2>Fixed columns and header</h2>
    <Table columns={columns} scroll={{ x: true, y: 300 }} data={data} style={{ width: 800 }} />
  </div>
, document.getElementById('__react-content'));
