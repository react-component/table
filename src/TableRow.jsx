'use strict';

var React = require('react');

class TableRow extends React.Component {
  componentWillUnmount() {
    this.props.onDestroy(this.props.record);
  }

  render() {
    var props = this.props;
    var prefixCls = props.prefixCls;
    var columns = props.columns;
    var record = props.record;
    var index = props.index;
    var cells = [];
    var expanded = props.expanded;
    var expandable = props.expandable;

    if (expandable) {
      cells.push(<td>
        {<span
          className={`${prefixCls}-expand-icon ${prefixCls}-${expanded ? 'expanded' : 'collapsed'}`}
          onClick={props.onExpand.bind(null, !expanded, record)}
          ></span>}
      </td>);
    }

    for (var i = expandable ? 1 : 0; i < columns.length; i++) {
      var col = columns[i];
      var colClassName = col.className || '';
      var render = col.render;
      var text = record[col.dataIndex];
      if (render) {
        text = render(text, record, index);
      }
      cells.push(<td key={col.key} className={`${colClassName}`}>
        {text}
      </td>);
    }
    return (
      <tr className={`${prefixCls} ${props.className}`} style={{display: props.visible ? '' : 'none'}}>{cells}</tr>);
  }
}

module.exports = TableRow;
