'use strict';

var React = require('react');
var Table = require('rc-table');
require('rc-table/assets/index.less');


var data = [];
for (var i = 0; i < 30; i++) {
  data.push({
    key: i,
    a: 'a' + i,
    b: 'b' + i,
    c: 'c' + i
  });
}

function getRowKey(record) {
  return record.key;
}

var Test = React.createClass({
  getInitialState() {

    return {
      showBody: true
    }
  },

  toggleBody() {
    this.setState({
      showBody: !this.state.showBody
    })
  },

  render() {
    var columns = [
      {title: '表头1', key: 'a', dataIndex: 'a', width: 100},
      {id: '123', title: '表头2', dataIndex: 'b', key: 'b', width: 100},
      {title: '表头3', key: 'c', dataIndex: 'c', width: 200},
      {
        title: <a onClick={this.toggleBody} href='#'>{this.state.showBody ? '隐藏' : '显示'}体</a>,
        key: 'x',
        width: 200,
        render: function () {
          return <a href="#">操作</a>
        }
      }
    ];
    return <Table columns={columns}
      data={data}
      useFixedHeader={true}
      rowKey={getRowKey}
      bodyStyle={{
        overflow: 'auto',
        height: 200,
        display: this.state.showBody ? '' : 'none'
      }}
      className="table"/>;
  }
});

React.render(
  <div>
    <h2>scroll body table</h2>
    <Test/>
  </div>,
  document.getElementById('__react-content')
);

