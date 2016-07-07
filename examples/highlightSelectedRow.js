/* eslint-disable no-console,func-names,react/no-multi-comp */
const React = require('react');
const ReactDOM = require('react-dom');
const Table = require('rc-table');
require('rc-table/assets/index.less');

const MyTable = React.createClass({
  onRowSelectionChange: function(record, key, index) {
    console.log('selection change');
    console.log('record', record);
    console.log('key', key);
    console.log('index', index);
  },

  render: function() {
    const props = this.props;
    const columns = [
      {title: '表头1', dataIndex: 'a', key: 'a', width: 100},
      {id: '123', title: '表头2', dataIndex: 'b', key: 'b', width: 100},
      {title: '表头3', dataIndex: 'c', key: 'c', width: 200}
    ];
    return (
      <Table
        columns={columns}
        data={props.data}
        className={props.className}
        highlightSelectedRow={true}
        onRowSelectionChange={this.onRowSelectionChange}
        selectedKey="2"/>
    );
  },
});

const data = [{a: '123', key: '1'}, {a: 'cdd', b: 'edd', key: '2'}, {a: '1333', c: 'eee', key: '3'}];

ReactDOM.render(
  <div>
    <h2>highlight selected row</h2>
    <MyTable data={data} className="table"/>
  </div>,
  document.getElementById('__react-content')
);
