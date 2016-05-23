/* eslint-disable no-console,func-names,react/no-multi-comp */
const React = require('react');
const ReactDOM = require('react-dom');
const Table = require('rc-table');
require('rc-table/assets/index.less');

const columns = [
  {title: '表头1', dataIndex: 'a', key: 'a', width: 100, fixed: 'left'},
  {title: '表头2', dataIndex: 'b', key: 'b', width: 100, fixed: 'left'},
  {title: '表头3', dataIndex: 'c', key: 'c'},
  {title: '表头4', dataIndex: 'b', key: 'd'},
  {title: '表头5', dataIndex: 'b', key: 'e'},
  {title: '表头6', dataIndex: 'b', key: 'f'},
  {title: '表头7', dataIndex: 'b', key: 'g'},
  {title: '表头8', dataIndex: 'b', key: 'h'},
  {title: '表头9', dataIndex: 'b', key: 'i'},
  {title: '表头10', dataIndex: 'b', key: 'j'},
  {title: '表头11', dataIndex: 'b', key: 'k'},
  {title: '表头12', dataIndex: 'b', key: 'l', width: 100, fixed: 'right'},
];

const data = [
  {a: '123', b: 'xxxxxxxx', d: 3, key: '1'},
  {a: 'cdd', b: 'edd12221', d: 3, key: '2'},
  {a: '133', c: 'edd12221', d: 2, key: '3'},
  {a: '133', c: 'edd12221', d: 2, key: '4'},
  {a: '133', c: 'edd12221', d: 2, key: '5'},
  {a: '133', c: 'edd12221', d: 2, key: '6'},
  {a: '133', c: 'edd12221', d: 2, key: '7'},
  {a: '133', c: 'edd12221', d: 2, key: '8'},
  {a: '133', c: 'edd12221', d: 2, key: '9'},
];

ReactDOM.render(
  <div style={{ width: 800 }}>
    <h2>Fixed columns</h2>
    <Table columns={columns} expandedRowRender={record => record.title} expandIconAsCell scroll={{ x: 1200 }} data={data} />
  </div>
, document.getElementById('__react-content'));
