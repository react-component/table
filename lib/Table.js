/** @jsx React.DOM */

var React = require('react');

//表格列
var TableColumn = React.createClass({

  render : function () {
    return (<th width={this.props.width}>{this.props.title}</th>);
  }
});

/**
 * 表格行
 */
var TableRow = React.createClass({

  render : function () {
    var _self= this,
      columns = _self.props.columns,
      record = _self.props.record,
      index = _self.props.index,
      cells = [];
    for (var i = 0; i < columns.length; i++) {
      var col = columns[i],
        renderer = col.renderer,
        text = record[col.dataIndex];
      if(renderer){
        text = renderer(text,record,index);
      }
      cells.push(<td>{text}</td>);
    }
    return (<tr>{cells}</tr>);
  }
});

var Table = React.createClass({
  _getColumns : function () {

    var _self = this,
      columns = _self.props.columns,
      rst = [];
    for (var i = 0; i < columns.length; i++) {
      var col = columns[i];
      rst.push(<TableColumn title={col.title} dataIndex={col.dataIndex} width={col.width}/>);
    }
    return rst;
  },
  _getRows : function () {
    var _self = this,
      data = _self.props.data,
      columns = _self.props.columns,
      rst = [];

    for (var i = 0; i < data.length; i++) {
      var record = data[i];
      rst.push(<TableRow record={record} index={i} columns={columns}/>);
    }
    return rst;

  },
  render : function () {
    var _self = this,
      columns = _self._getColumns(),
      rows = _self._getRows();

    return (
      <table className={this.props.className}>
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
});

module.exports = Table;