import React, { PropTypes } from 'react';
import objectPath from 'object-path';

const TableCell = React.createClass({
  propTypes: {
    record: PropTypes.object,
    prefixCls: PropTypes.string,
    index: PropTypes.number,
    indent: PropTypes.number,
    indentSize: PropTypes.number,
    column: PropTypes.object,
    columnExtraInfo: PropTypes.any,
    expandIcon: PropTypes.node,
  },
  isInvalidRenderCellText(text) {
    return text && !React.isValidElement(text) &&
      Object.prototype.toString.call(text) === '[object Object]';
  },
  handleClick(e) {
    const { record, column: { onCellClick } } = this.props;
    if (onCellClick) {
      onCellClick(record, e);
    }
  },
  render() {
    const { record, indentSize, prefixCls, indent,
            index, expandIcon, column, columnExtraInfo } = this.props;
    const { dataIndex, render, className = '' } = column;

    let text = objectPath.get(record, dataIndex);
    let tdProps;
    let colSpan;
    let rowSpan;

    if (render) {
      text = render(text, record, index, columnExtraInfo);
      if (this.isInvalidRenderCellText(text)) {
        tdProps = text.props || {};
        rowSpan = tdProps.rowSpan;
        colSpan = tdProps.colSpan;
        text = text.children;
      }
    }

    // Fix https://github.com/ant-design/ant-design/issues/1202
    if (this.isInvalidRenderCellText(text)) {
      text = null;
    }

    const indentText = expandIcon ? (
      <span
        style={{ paddingLeft: `${indentSize * indent}px` }}
        className={`${prefixCls}-indent indent-level-${indent}`}
      />
    ) : null;

    if (rowSpan === 0 || colSpan === 0) {
      return null;
    }
    return (
      <td
        colSpan={colSpan}
        rowSpan={rowSpan}
        className={className}
        onClick={this.handleClick}
      >
        {indentText}
        {expandIcon}
        {text}
      </td>
    );
  },
});

export default TableCell;
