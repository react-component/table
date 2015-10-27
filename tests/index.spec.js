'use strict';

var expect = require('expect.js');
var Table = require('../');
var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');

describe('table', function () {
  var div = document.createElement('div');
  document.body.appendChild(div);

  var columns = [
    {title: '表头1', dataIndex: 'a', width: 100},
    {id: '123', title: '表头2', dataIndex: 'b', width: 100},
    {title: '表头3', dataIndex: 'c', width: 200},
    {
      title: '操作', dataIndex: '', renderer: function () {
      return <a href="#">操作</a>
    }
    }
  ];
  var data = [{a: '123'}, {a: 'cdd', b: 'edd'}, {a: '1333', c: 'eee', d: 2}];
  var table;
  var node = $(div);

  beforeEach(function () {
    table = ReactDOM.render(
      <Table columns={columns} data={data} className="table"/>,
      div
    );
    node = $(div);
  });

  afterEach(function () {
    ReactDOM.unmountComponentAtNode(div);
  });

  it('simple works', function () {
    expect(node.find('table').length).to.be(1);
    expect(node.find('tbody tr').length).to.be(data.length);
  });
});
