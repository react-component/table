'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Table = require('rc-table');
require('rc-table/assets/index.less');
var Menu = require('rc-menu');
require('rc-dropdown/assets/index.less');
require('rc-menu/assets/index.less');
var DropDown = require('rc-dropdown');

var data = [];
for (var i = 0; i < 10; i++) {
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
    this.filters = [];
    return {
      visible: false
    }
  },

  handleVisibleChange(visible) {
    this.setState({
      visible: visible
    });
  },

  handleSelect(selected) {
    this.filters.push(selected);
  },

  handleDeselect(key) {
    var index = this.filters.indexOf(key);
    if (index !== -1) {
      this.filters.splice(index, 1);
    }
  },

  confirmFilter() {
    console.log(this.filters.join(','));
    this.setState({
      visible: false
    });
  },

  render() {
    var menu = <Menu style={{width: 200}} multiple={true} onSelect={this.handleSelect} onDeselect={this.handleDeselect}>
      <Menu.Item key="1">one</Menu.Item>
      <Menu.Item key="2">two</Menu.Item>
      <Menu.Item key="3">three</Menu.Item>
      <Menu.Divider/>
      <Menu.Item disabled>
        <button
          style={{
            cursor: 'pointer',
            color: '#000',
            'pointerEvents': 'visible'
          }}
          onClick={this.confirmFilter}>确定</button>
      </Menu.Item>
    </Menu>;

    var columns = [
      {
        title: <div>表头1
          <DropDown trigger="click"
            onVisibleChange={this.handleVisibleChange}
            visible={this.state.visible}
            closeOnSelect={false}
            overlay={menu}>
            <a href='#'>filter</a>
          </DropDown>
        </div>, key: 'a', dataIndex: 'a', width: 100
      },
      {id: '123', title: '表头2', dataIndex: 'b', key: 'b', width: 100},
      {title: '表头3', key: 'c', dataIndex: 'c', width: 200}
    ];
    return <Table columns={columns}
      data={data}
      rowKey={getRowKey}
      className="table"/>;
  }
});

ReactDOM.render(
  <div>
    <h2>use dropdown</h2>
    <Test/>
  </div>,
  document.getElementById('__react-content')
);

