/* eslint-disable no-console,func-names,react/no-multi-comp */
const React = require('react');
const ReactDOM = require('react-dom');
const Table = require('rc-table');
require('rc-table/assets/index.less');

const columns = [
  { title: '表头1', dataIndex: 'a',
    className: 'a',
    key: 'a', width: 100 },
  { id: '123', title: '表头2', dataIndex: 'b',
    className: 'b',
    key: 'b', width: 100 },
  { title: '表头3', dataIndex: 'c',
    className: 'c',
    key: 'c', width: 200 },
  {
    title: '操作', dataIndex: '',
    className: 'd',
    key: 'd', render() {
      return <a href="#">操作</a>;
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
    <h2>rowClassName and className</h2>
    <Table
      columns={columns}
      rowClassName={(record, i) => `row-${i}`}
      expandedRowRender={record => <p>extra: {record.a}</p>}
      expandedRowClassName={(record, i) => `ex-row-${i}`}
      data={data}
      className="table"
    />
  </div>,
  document.getElementById('__react-content')
);
