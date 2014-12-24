/** @jsx React.DOM */

var Table = require('../');
var React = require('react');

// TODO with table

var columns = [
    {title : '表头1',dataIndex :'a', width:100},
    {id: '123',title : '表头2',dataIndex :'b', width:100},
    {title : '表头3',dataIndex : 'c',width:200},
    {title : '操作',dataIndex : '',renderer :function () {
      return <a href="#">操作</a>
    }}
  ];

var data = [{a:'123'},{a:'cdd',b:'edd'},{a:'1333',c:'eee',d:2}];

var table = React.renderComponent(
      <Table columns={columns} data={data} className="table"/>,
      document.getElementById('t1')
);