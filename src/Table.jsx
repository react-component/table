'use strict';

var React = require('react');

//表格列
class TableColumn extends React.Component {
  render() {
    return (<th width={this.props.width}>{this.props.title}</th>);
  }
}

/**
 * 表格行
 */
class TableRow extends React.Component {
  render() {
    var self = this,
      columns = self.props.columns,
      record = self.props.record,
      index = self.props.index,
      cells = [];
    for (var i = 0; i < columns.length; i++) {
      var col = columns[i],
        renderer = col.renderer,
        text = record[col.dataIndex];
      if (renderer) {
        text = renderer(text, record, index);
      }
      cells.push(<td key={col.key}>{text}</td>);
    }
    return (<tr>{cells}</tr>);
  }
}

class Table extends React.Component {
  _getColumns() {
    var self = this,
      columns = self.props.columns,
      rst = [];
    for (var i = 0; i < columns.length; i++) {
      var col = columns[i];
      rst.push(<TableColumn title={col.title} dataIndex={col.dataIndex} width={col.width} key={col.key}/>);
    }
    return rst;
  }

  _getRows() {
    var self = this,
      data = self.props.data,
      columns = self.props.columns,
      rst = [];

    var keyFn = this.props.rowKey;
    for (var i = 0; i < data.length; i++) {
      var record = data[i];
      var key = keyFn ? keyFn(record, i) : undefined;
      rst.push(<TableRow record={record} index={i} columns={columns} key={key}/>);
    }
    return rst;
  }

  render() {
    var self = this,
      columns = self._getColumns(),
      rows = self._getRows();
    var className = 'rc-table';
    if (this.props.className) {
      className += ' ' + this.props.className;
    }
    return (
      <table className={className}>
        <thead>
          <tr>
            {columns}
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
}

module.exports = Table;
