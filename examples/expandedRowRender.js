/* eslint-disable no-console,func-names,react/no-multi-comp */
const React = require('react');
const ReactDOM = require('react-dom');
const Table = require('rc-table');
require('rc-table/assets/index.less');

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
      return <button onClick={closeAll}>Close All</button>;
    }
    const openAll = () => this.setState({ expandedRowKeys: [0, 1, 2] });
    return <button onClick={openAll}>Expand All</button>;
  },

  remove(index) {
    const data = this.state.data;
    data.splice(index, 1);
    this.setState({ data });
  },

  expandedRowRender(record) {
    console.log(record);
    return <p>extra: {record.a}</p>;
  },

  renderAction(o, row, index) {
    return <a href="#" onClick={() => this.remove(index)}>Delete</a>;
  },

  render() {
    const state = this.state;
    const columns = [
      { title: 'title 1', dataIndex: 'a', key: 'a', width: 100 },
      { title: 'title 2', dataIndex: 'b', key: 'b', width: 100 },
      { title: 'title 3', dataIndex: 'c', key: 'c', width: 200 },
      { title: 'Operation', dataIndex: '', key: 'x', render: this.renderAction },
    ];
    return (
      <div>
        {this.toggleButton()}
        <Table
          columns={columns}
          expandIconAsCell
          expandRowByClick
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
