'use strict';

var React = require('react');
var Table = require('rc-table');

var CheckBox = React.createClass({

  render: function() {
    return (
      <label>
        <input type="checkbox" />
        {this.props.id}
      </label>
    );
  }
});

var MyTable = React.createClass({

  getInitialState: function() {
    return {
      data: this.props.data
    };
  },

  handleClick: function(index) {
    var self = this;
    return function() {
      self.remove(index);
    };
  },

  remove: function(index) {
    var rows = this.state.data;
    rows.splice(index, 1);
    this.setState({
      data: rows
    });
  },

  renderAction: function(o, row, index) {
    return <a href="#" onClick={this.handleClick(index)}>删除</a>;
  },

  render: function() {
    var state = this.state;
    var columns = [
      { title: '表头1', dataIndex: 'a', width: 100, renderer: this.checkbox },
      { title: '表头2', dataIndex: 'b', width: 100},
      { title: '表头3', dataIndex: 'c', width: 200},
      { title: '操作', dataIndex: '', renderer: this.renderAction }
    ];
    return (
      <Table columns={columns} data={state.data} className="table" keyField="a"/>
    );
  },

  checkbox: function(a) {
    return <CheckBox id={a} />;
  }
});

var data = [{a: '123'}, {a: 'cdd', b: 'edd'}, {a: '1333', c: 'eee', d: 2}];

React.render(
  <div>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css" />
    <MyTable data={data} className="table"/>
  </div>,
  document.getElementById('__react-content')
);
