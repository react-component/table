/* eslint react/no-multi-comp: 0*/
const React = require('react');
const ReactDOM = require('react-dom');
const Table = require('rc-table');
require('rc-table/assets/index.less');

const CheckBox = React.createClass({
  render: function() {
    const props = this.props;
    return (
      <label>
        <input type="checkbox" />
        {props.id}
      </label>
    );
  },
});

const MyTable = React.createClass({
  getInitialState: function() {
    const props = this.props;
    return {
      data: props.data,
      expandedRowKeys: [],
    };
  },

  onExpandedRowsChange(rows) {
    this.setState({
      expandedRowKeys: rows,
    });
  },

  getRowKey(record) {
    return record.a;
  },

  toggleButton() {
    if (this.state.expandedRowKeys.length) {
      const closeAll = () => this.setState({expandedRowKeys: []});
      return <button onClick={closeAll}>关闭所有</button>;
    }
    const openAll = () => this.setState({expandedRowKeys: ['123', 'cdd', '1333']});
    return <button onClick={openAll}>展开全部</button>;
  },

  handleClick: function(index) {
    const self = this;
    return function() {
      self.remove(index);
    };
  },

  remove: function(index) {
    const rows = this.state.data;
    rows.splice(index, 1);
    this.setState({
      data: rows,
    });
  },

  checkbox: function(a) {
    return <CheckBox id={a} />;
  },

  expandedRowRender(record) {
    console.log(record);
    return <p>extra: {record.a}</p>;
  },

  renderAction: function(o, row, index) {
    return <a href="#" onClick={this.handleClick(index)}>删除</a>;
  },

  render: function() {
    const state = this.state;
    const columns = [
      {title: '表头1', dataIndex: 'a', key: 'a', width: 100, render: this.checkbox},
      {title: '表头2', dataIndex: 'b', key: 'b', width: 100},
      {title: '表头3', dataIndex: 'c', key: 'c', width: 200},
      {title: '操作', dataIndex: '', key: 'x', render: this.renderAction},
    ];
    return (
      <div>
        {this.toggleButton()}
        <Table
          columns={columns}
          expandIconAsCell
          expandedRowRender={this.expandedRowRender}
          expandedRowKeys={this.state.expandedRowKeys}
          onExpandedRowsChange={this.onExpandedRowsChange}
          data={state.data}
          className="table"
          rowKey={this.getRowKey}
        />
      </div>
    );
  },
});

const data = [{a: '123'}, {a: 'cdd', b: 'edd'}, {a: '1333', c: 'eee', d: 2}];

ReactDOM.render(
  <div>
    <h2>expandedRowRender</h2>
    <MyTable
      data={data}
      className="table"
    />
  </div>,
  document.getElementById('__react-content')
);
