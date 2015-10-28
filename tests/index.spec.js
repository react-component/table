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
    {title: '表头1', dataIndex: 'a', headerColSpan: 2,width: 100,render: function(o, row, index){
      //第一列中第一行合并两列
      let obj ={
        children:o,
        props:{}
      };
      if(index === 0){
        obj.props.colspan = 2;
      }
      return obj;

    }},
    {id: '123', title: '表头2', headerColSpan: 0,dataIndex: 'b', width: 100, render: function(o, row, index){
      //2列被合并掉了colspan:0，第二列中第一行合并两行rowspan:2
      let obj ={
        children:o,
        props:{}
      }
      if(index === 0){
        obj.props.colspan = 0;
      }
      return obj;
    }},
    {title: '表头3', dataIndex: 'c', width: 200, render: function(o, row, index){
      let obj ={
        children:o,
        props:{}
      }
      if(index === 0){
        obj.props.rowspan = 2;
      }
      if(index === 1){
        obj.props.rowspan = 0;
      }
      return obj;
    }},
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

  it('th colspan works', function () {
    expect(node.find('table').length).to.be(1);
    let colspanNum = 0;
    let cLen = columns.length;
    for(let i = 0; i < cLen; i++){
      let headerColSpan = columns[i].headerColSpan;
      if(headerColSpan){
        colspanNum += headerColSpan
      }
    }
    expect(node.find('thead th').length).to.be(columns.length - (colspanNum - 1));
  });

  it('td colspan works', function () {
    expect(node.find('table').length).to.be(1);

    let colspan = 2;
    //第一行第一列合并了
    let trFstTds = node.find('tbody tr:first td').length;
    //最后一行是没有合并的
    let trLstTds = node.find('tbody tr:last td').length;
    //检查未合并列是否受到影响
    expect(trLstTds).to.be(columns.length);
    //合并和未合并行中列数是否相等
    expect(trFstTds).to.not.be(trLstTds);
    //合并的列数是否正确
    expect(trFstTds).to.be(columns.length - ( 2 - 1));
  });

  it('td rwowspan works', function () {
    expect(node.find('table').length).to.be(1);
    let rowspanNum = 2;
    expect(node.find('tbody tr').eq(1).find('td').length).to.be(columns.length - (rowspanNum - 1));
  });
});
