'use strict';

var React = require('react');

class TableRow extends React.Component {
  componentWillUnmount() {
    this.props.onDestroy(this.props.record);
  }

  render() {
    let props = this.props;
    let prefixCls = props.prefixCls;
    let columns = props.columns;
    let record = props.record;
    let index = props.index;
    let cells = [];
    let expanded = props.expanded;
    let expandable = props.expandable;
    let expandIconAsCell = props.expandIconAsCell === false ? false : true;

    if (expandIconAsCell) {
      if (expandable) {
        cells.push(<td>
          {<span
            className={`${prefixCls}-expand-icon ${prefixCls}-${expanded ? 'expanded' : 'collapsed'}`}
            onClick={props.onExpand.bind(null, !expanded, record)}
            ></span>}
        </td>);
      } else {
        cells.push(<td></td>);
      }
      if (!columns[0].title) {
        columns.shift();
      }
    } else {
      let col = columns[0];
      let text = record[col.dataIndex];
      if (expandable) {
        cells.push(<td>
          {<span
            className={`${prefixCls}-expand-icon ${prefixCls}-${expanded ? 'expanded' : 'collapsed'}`}
            onClick={props.onExpand.bind(null, !expanded, record)}
            ></span>}
          {text}
        </td>);
      } else {
        cells.push(<td>{text}</td>);
      }
    }

    for (let i = expandIconAsCell ? 0 : 1; i < columns.length; i++) {
      let col = columns[i];
      let colClassName = col.className || '';
      let render = col.render;
      let text = record[col.dataIndex];
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
