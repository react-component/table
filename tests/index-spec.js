/** @jsx React.DOM */


var expect = require('expect.js');
var Table = require('../index');
var React = require('react');

var $ = require('jquery');

$('<div id="t1"></div>').appendTo('body');

$('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">')
  .appendTo(document.getElementsByTagName('head')[0])
describe('table', function() {

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

  var node = $('#t1');

  it('create', function() {
    expect(node.find('table').length).to.be(1);
  });

  it('init data', function() {
     expect(node.find('tbody tr').length).to.be(data.length);
  });

  it('change data', function() {

  });
/*
  it('renderer', function() {
    expect(node.find('a').first().text()).to.be('操作')；
  });

*/
});
