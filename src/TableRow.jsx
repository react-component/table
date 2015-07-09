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
    for (var i = 0; i < columns.length; i++) {
      var col = columns[i];
      var render = col.render;
      var text = record[col.dataIndex];
      if (render) {
        text = render(text, record, index);
      }
      var expandIcon = null;
      if (props.expandable && i === 0) {
        expandIcon = <span
          className={`${prefixCls}-expand-icon ${prefixCls}-${expanded ? 'expanded' : 'collapsed'}`}
          onClick={props.onExpand.bind(null, !expanded, record)}
        ></span>;
      }
      cells.push(<td key={col.key}>
      {expandIcon}
      {text}
      </td>);
    }
    return (<tr className={prefixCls} style={{display: props.visible ? '' : 'none'}}>{cells}</tr>);
  }
}

module.exports = TableRow;
