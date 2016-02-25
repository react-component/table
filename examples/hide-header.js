/* eslint-disable no-console,func-names,react/no-multi-comp */
const React = require('react');
const ReactDOM = require('react-dom');
const Table = require('rc-table');
require('rc-table/assets/index.less');

const columns = [
  {title: '表头1', dataIndex: 'a', key: 'a', width: 100},
  {id: '123', title: '表头2', dataIndex: 'b', key: 'b', width: 100},
  {title: '表头3', dataIndex: 'c', key: 'c', width: 200},
  {
    title: '操作', dataIndex: '', key: 'd', render: function() {
      return <a href="#">操作</a>;
    },
  },
];

const data = [{a: '123', key: '1'}, {a: 'cdd', b: 'edd', key: '2'}, {a: '1333', c: 'eee', d: 2, key: '3'}];

ReactDOM.render(
  <div>
    <h2>hide table head</h2>
    <Table columns={columns}
      showHeader={false}
      data={data}
      className="table"/>
  </div>,
  document.getElementById('__react-content')
);
