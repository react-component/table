/* eslint-disable no-console,func-names,react/no-multi-comp */
const React = require('react');
const ReactDOM = require('react-dom');
const Table = require('rc-table');
require('rc-table/assets/index.less');

const columns = [
  { title: '表头1', dataIndex: 'a', key: 'a', width: 100, fixed: 'left' },
  { title: '表头2', dataIndex: 'b', key: 'b', width: 100, fixed: 'left' },
  { title: '表头3', dataIndex: 'c', key: 'c', width: 150 },
  { title: '表头4', dataIndex: 'c', key: 'd', width: 150 },
  { title: '表头5', dataIndex: 'c', key: 'e', width: 150 },
  { title: '表头6', dataIndex: 'c', key: 'f', width: 150 },
  { title: '表头7', dataIndex: 'c', key: 'g', width: 150 },
  { title: '表头8', dataIndex: 'c', key: 'h', width: 150 },
  { title: '表头9', dataIndex: 'b', key: 'i', width: 150 },
  { title: '表头10', dataIndex: 'b', key: 'j', width: 150 },
  { title: '表头11', dataIndex: 'b', key: 'k', width: 150 },
  { title: '表头12', dataIndex: 'b', key: 'l', width: 100, fixed: 'right' },
];

const data = [
  { a: 'aaa', b: 'bbb', c: '内容内容内容内容内容', d: 3, key: '1' },
  { a: 'aaa', b: 'bbb', c: '内容内容内容内容内容', d: 3, key: '2' },
  { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '3' },
  { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '4' },
  { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '5' },
  { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '6' },
  { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '7' },
  { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '8' },
  { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '9' },
];

ReactDOM.render(
  <div>
    <h2>Fixed columns and header</h2>
    <Table columns={columns} scroll={{ x: true, y: 300 }} data={data} style={{ width: 800 }} />
  </div>
, document.getElementById('__react-content'));
