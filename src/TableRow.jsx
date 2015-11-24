import React from 'react';

const TableRow = React.createClass({
  propTypes: {
    onDestroy: React.PropTypes.func,
    record: React.PropTypes.object,
    prefixCls: React.PropTypes.string,
  },

  componentWillUnmount() {
    this.props.onDestroy(this.props.record);
  },

  render() {
    const props = this.props;
    const prefixCls = props.prefixCls;
    const columns = props.columns;
    const record = props.record;
    const index = props.index;
    const cells = [];
    const expanded = props.expanded;
    const expandable = props.expandable;
    const expandIconAsCell = props.expandIconAsCell;

    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      const colClassName = col.className || '';
      const render = col.render;
      let text = record[col.dataIndex];

      let expandIcon = null;
      let tdProps;
      let colSpan;
      let rowSpan;
      let notRender = false;

      if (i === 0 && expandable) {
        expandIcon = (<span
          className={`${prefixCls}-expand-icon ${prefixCls}-${expanded ? 'expanded' : 'collapsed'}`}
          onClick={props.onExpand.bind(null, !expanded, record)}/>);
      }

      if (expandIconAsCell && i === 0) {
        cells.push(<td className={`${prefixCls}-expand-icon-cell`}
                       key="rc-table-expand-icon-cell">{expandIcon}</td>);
        expandIcon = null;
      }

      if (render) {
        text = render(text, record, index) || {};
        tdProps = text.props || {};

        if (!React.isValidElement(text) && 'children' in text) {
          text = text.children;
        }
        rowSpan = tdProps.rowSpan;
        colSpan = tdProps.colSpan;
      }

      if (rowSpan === 0 || colSpan === 0) {
        notRender = true;
      }
      if (!notRender) {
        cells.push(<td key={col.key} colSpan={colSpan} rowSpan={rowSpan} className={`${colClassName}`}>
        {expandIcon}
        {text}
        </td>);
      }
    }
    return (
      <tr className={`${prefixCls} ${props.className}`} style={{display: props.visible ? '' : 'none'}}>{cells}</tr>);
  },
});

export default TableRow;
