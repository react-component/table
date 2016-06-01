'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Table = require('rc-table');
require('rc-table/assets/index.less');

var columns = [
  {title: 'First Name', dataIndex: 'names.first', key: 'a', width: 100},
  {title: 'Last Name', dataIndex: 'names.last', key: 'b', width: 100},
  {title: 'Age', dataIndex: 'age', key: 'c', width: 100},
];

var data = [{
  age: '23',
  names: {
    first: 'John',
    last: 'Doe'
  },
  key: '1'
}, {
  age: '36',
  names: {
    first: "Terry",
    last: "Garner"
  },
  key: '2'
}, {
  age: '52',
  names: {
    first: 'Thomas',
    last: 'Goodwin'
  },
  key: '3'
}];

var table = ReactDOM.render(
  <div>
    <h2>Nested data table</h2>
    <Table columns={columns}
      data={data}
      className="table"/>
  </div>,
  document.getElementById('__react-content')
);
