/* eslint-disable no-console,func-names,react/no-multi-comp */
const React = require('react');
const ReactDOM = require('react-dom');
const Table = require('rc-table');
require('rc-table/assets/index.less');

const CheckBox = React.createClass({
  render() {
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
  getInitialState() {
    const props = this.props;
    return {
      data: props.data,
      expandedRowKeys: [],
    };
  },

  onExpand(expanded, record) {
    console.log('onExpand', expanded, record);
  },

  onExpandedRowsChange(rows) {
    this.setState({
      expandedRowKeys: rows,
    });
  },

  toggleButton() {
    if (this.state.expandedRowKeys.length) {
      const closeAll = () => this.setState({ expandedRowKeys: [] });
      return <button onClick={closeAll}>关闭所有</button>;
    }
    const openAll = () => this.setState({ expandedRowKeys: ['123', 'cdd', '1333'] });
    return <button onClick={openAll}>展开全部</button>;
  },

  handleClick(index) {
    const self = this;
    return () => {
      self.remove(index);
    };
  },

  remove(index) {
    const rows = this.state.data;
    rows.splice(index, 1);
    this.setState({
      data: rows,
    });
  },

  checkbox(a) {
    return <CheckBox id={a} />;
  },

  expandedRowRender(record) {
    console.log(record);
    return <p>extra: {record.a}</p>;
  },

  renderAction(o, row, index) {
    return <a href="#" onClick={this.handleClick(index)}>删除</a>;
  },

  render() {
    const state = this.state;
    const columns = [
      { title: '表头1', dataIndex: 'a', key: 'a', width: 100, render: this.checkbox },
      { title: '表头2', dataIndex: 'b', key: 'b', width: 100 },
      { title: '表头3', dataIndex: 'c', key: 'c', width: 200 },
      { title: '操作', dataIndex: '', key: 'x', render: this.renderAction },
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
          onExpand={this.onExpand}
          data={state.data}
        />
      </div>
    );
  },
});

const data = [
  { key: 0, a: '123' },
  { key: 1, a: 'cdd', b: 'edd' },
  { key: 2, a: '1333', c: 'eee', d: 2 },
];

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
