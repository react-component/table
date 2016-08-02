import React, { PropTypes } from 'react';
import objectPath from 'object-path';
import shallowequal from 'shallowequal';
import ExpandIcon from './ExpandIcon';

const TableCell = React.createClass({
  propTypes: {
    record: PropTypes.object,
    prefixCls: PropTypes.string,
    isColumnHaveExpandIcon: PropTypes.bool,
    index: PropTypes.number,
    expanded: PropTypes.bool,
    expandable: PropTypes.any,
    onExpand: PropTypes.func,
    needIndentSpaced: PropTypes.bool,
    indent: PropTypes.number,
    indentSize: PropTypes.number,
    column: PropTypes.object,
  },
  shouldComponentUpdate(nextProps) {
    return !shallowequal(nextProps, this.props);
  },
  isInvalidRenderCellText(text) {
    return text && !React.isValidElement(text) &&
      Object.prototype.toString.call(text) === '[object Object]';
  },
  render() {
    const { record, indentSize, prefixCls, indent,
            isColumnHaveExpandIcon, index, expandable, onExpand,
            needIndentSpaced, expanded, column } = this.props;

    const { dataIndex, render, className } = column;

    let text = objectPath.get(record, dataIndex);
    let tdProps;
    let colSpan;
    let rowSpan;

    if (render) {
      text = render(text, record, index);
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

    const expandIcon = (
      <ExpandIcon
        expandable={expandable}
        prefixCls={prefixCls}
        onExpand={onExpand}
        needIndentSpaced={needIndentSpaced}
        expanded={expanded}
        record={record}
      />
    );

    const indentText = (
      <span
        style={{ paddingLeft: `${indentSize * indent}px` }}
        className={`${prefixCls}-indent indent-level-${indent}`}
      />
    );

    if (rowSpan === 0 || colSpan === 0) {
      return null;
    }
    return (
      <td
        colSpan={colSpan}
        rowSpan={rowSpan}
        className={className}
      >
        {isColumnHaveExpandIcon ? indentText : null}
        {isColumnHaveExpandIcon ? expandIcon : null}
        {text}
      </td>
    );
  },
});

export default TableCell;
