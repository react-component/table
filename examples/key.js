'use strict';

var React = require('react');
var Table = require('rc-table');
require('rc-table/assets/index.less');

var CheckBox = React.createClass({
  render: function () {
    return (
      <label>
        <input type="checkbox" />
        {this.props.id}
      </label>
    );
  }
});

var MyTable = React.createClass({
  getInitialState: function () {
    return {
      data: this.props.data
    };
  },

  handleClick: function (index) {
    var self = this;
    return function () {
      self.remove(index);
    };
  },

  remove: function (index) {
    var rows = this.state.data;
    rows.splice(index, 1);
    this.setState({
      data: rows
    });
  },

  renderAction: function (o, row, index) {
    return <a href="#" onClick={this.handleClick(index)}>删除</a>;
  },

  getRowKey(record) {
    return record.a;
  },

  render: function () {
    var state = this.state;
    var columns = [
      {title: '表头1', dataIndex: 'a', key: 'a', width: 100, render: this.checkbox},
      {title: '表头2', dataIndex: 'b', key: 'b', width: 100},
      {title: '表头3', dataIndex: 'c', key: 'c', width: 200},
      {title: '操作', dataIndex: '', key: 'x', render: this.renderAction}
    ];
    return (
      <Table columns={columns} data={state.data} className="table" rowKey={this.getRowKey}/>
    );
  },

  checkbox: function (a) {
    return <CheckBox id={a} />;
  }
});

var data = [{a: '123'}, {a: 'cdd', b: 'edd'}, {a: '1333', c: 'eee', d: 2}];

React.render(
  <div>
    <h2>specify key</h2>
    <MyTable data={data} className="table"/>
  </div>,
  document.getElementById('__react-content')
);
