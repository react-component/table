import React from 'react';
import { connect } from 'mini-store';
import PropTypes from 'prop-types';
import get from 'lodash/get';

function isInvalidRenderCellText(text) {
  return (
    text &&
    !React.isValidElement(text) &&
    Object.prototype.toString.call(text) === '[object Object]'
  );
}

class TableCell extends React.Component {
  static propTypes = {
    record: PropTypes.object,
    prefixCls: PropTypes.string,
    index: PropTypes.number,
    indent: PropTypes.number,
    indentSize: PropTypes.number,
    column: PropTypes.object,
    expandIcon: PropTypes.node,
    component: PropTypes.any,
  };

  handleClick = e => {
    const {
      record,
      column: { onCellClick },
    } = this.props;
    if (onCellClick) {
      onCellClick(record, e);
    }
  };

  render() {
    const {
      record,
      indentSize,
      prefixCls,
      indent,
      index,
      expandIcon,
      column,
      component: BodyCell,
      virtualized,
      columnIndex,
      columnWidths
    } = this.props;
    const { dataIndex, render, className = '' } = column;

    // We should return undefined if no dataIndex is specified, but in order to
    // be compatible with object-path's behavior, we return the record object instead.
    let text;
    if (typeof dataIndex === 'number') {
      text = get(record, dataIndex);
    } else if (!dataIndex || dataIndex.length === 0) {
      text = record;
    } else {
      text = get(record, dataIndex);
    }
    let tdProps = {};
    let colSpan;
    let rowSpan;

    if (render) {
      text = render(text, record, index);
      if (isInvalidRenderCellText(text)) {
        tdProps = text.props || tdProps;
        colSpan = tdProps.colSpan;
        rowSpan = tdProps.rowSpan;
        text = text.children;
      }
    }

    if (column.onCell) {
      tdProps = { ...tdProps, ...column.onCell(record) };
    }

    // Fix https://github.com/ant-design/ant-design/issues/1202
    if (isInvalidRenderCellText(text)) {
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

    if (column.align) {
      tdProps.style = { ...tdProps.style, textAlign: column.align };
    }
    if(virtualized && columnWidths && columnWidths[columnIndex]){
      tdProps.style={...tdProps.style, width: columnWidths[columnIndex]}
    }

    return (
      <BodyCell className={className} onClick={this.handleClick} {...tdProps}>
        {indentText}
        {expandIcon}
        {text}
      </BodyCell>
    );
  }
}
export default connect((state, props) => {
  const { virtualized, columnWidths } = state;
  return {
    virtualized,
    columnWidths
  };
})(TableCell);
