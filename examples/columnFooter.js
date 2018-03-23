/* eslint-disable no-console,func-names,react/no-multi-comp */
import React from 'react';
import ReactDOM from 'react-dom';
import Table from 'rc-table';
import 'rc-table/assets/index.less';

const columns = [
  { title: 'Name', dataIndex: 'name', width: 100, fixed: 'left', footer: 'Summary' },
  { title: 'Money', dataIndex: 'money', width: 100, render: (text) => '$' + text.toFixed(2), footer: (data) => 'Total: $' + data.reduce((acc, row) => acc + row.money, 0).toFixed(2) },
  { title: 'Address', dataIndex: 'address', width: 300 }
];

const data = [
  {
    name: 'John Brown',
    money: 300,
    address: 'New York No. 1 Lake Park',
  }, {
    name: 'Jim Green',
    money: 128,
    address: 'London No. 1 Lake Park',
  }, {
    name: 'Joe Black',
    money: 240,
    address: 'Sidney No. 1 Lake Park',
  }, {
    name: 'Mick Sydney',
    money: 300,
    address: 'Sidney No. 1 Lake Park',
  }, {
    name: 'Miguel Manning',
    money: 120,
    address: 'Sidney No. 1 Lake Park',
  }, {
    name: 'John Appleseed',
    money: 256,
    address: '1 Infinite Loop; Cupertino, CA 95014',
  }
];

ReactDOM.render(
  <div>
    <h2>Demonstrate column footer</h2>
    <Table columns={columns} scroll={{ x: '150%', y: 200 }} data={data} />
  </div>
, document.getElementById('__react-content'));
