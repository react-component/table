/* eslint-disable no-console,func-names,react/no-multi-comp */
const React = require('react');
const ReactDOM = require('react-dom');
const Table = require('rc-table');
require('rc-table/assets/index.less');

const columns = [
  { title: 'title1', dataIndex: 'a', key: 'a', width: 100, fixed: 'left' },
  { title: 'title2', dataIndex: 'b', key: 'b', width: 100, fixed: 'left' },
  { title: 'title3', dataIndex: 'c', key: 'c', width: 100 },
  { title: 'title4', dataIndex: 'b', key: 'd', width: 100 },
  { title: 'title5', dataIndex: 'b', key: 'e', width: 100 },
  { title: 'title6', dataIndex: 'b', key: 'f', width: 100 },
  { title: <div>title7<br /><br /><br />Hello world!</div>, dataIndex: 'b', key: 'g', width: 100 },
  { title: 'title8', dataIndex: 'b', key: 'h', width: 100 },
  { title: 'title9', dataIndex: 'b', key: 'i', width: 100 },
  { title: 'title10', dataIndex: 'b', key: 'j', width: 100 },
  { title: 'title11', dataIndex: 'b', key: 'k', width: 100 },
  { title: 'title12', dataIndex: 'b', key: 'l', width: 100, fixed: 'right' },
];

const data = [
  { a: '123', b: 'xxxxxxxx', d: 3, key: '1' },
  { a: 'cdd', b: 'edd12221', d: 3, key: '2' },
  { a: '133', c: 'edd12221', d: 2, key: '3' },
  { a: '133', c: 'edd12221', d: 2, key: '4' },
  { a: '133', c: 'edd12221', d: 2, key: '5' },
  { a: '133', c: 'edd12221', d: 2, key: '6' },
  { a: '133', c: 'edd12221', d: 2, key: '7' },
  { a: '133', c: 'edd12221', d: 2, key: '8' },
  { a: '133', c: 'edd12221', d: 2, key: '9' },
];

ReactDOM.render(
  <div style={{ width: 800 }}>
    <h2>Fixed columns</h2>
    <Table
      columns={columns}
      expandedRowRender={record => record.title}
      expandIconAsCell
      scroll={{ x: 1200 }}
      data={data}
    />
  </div>
, document.getElementById('__react-content'));
