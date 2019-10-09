import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import get from 'lodash/get';

function isInvalidRenderCellText(text) {
  return (
    text &&
    !React.isValidElement(text) &&
    Object.prototype.toString.call(text) === '[object Object]'
  );
}

export default class TableCell extends React.PureComponent {
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
      tdProps = { ...tdProps, ...column.onCell(record, index) };
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
      tdProps.style = {
        textAlign: column.align,
        ...tdProps.style,
      };
    }

    const cellClassName = classNames(className, {
      [`${prefixCls}-cell-ellipsis`]: !!column.ellipsis,
      // 如果有宽度，增加断行处理
      // https://github.com/ant-design/ant-design/issues/13825#issuecomment-449889241
      [`${prefixCls}-cell-break-word`]: !!column.width,
    });

    return (
      <BodyCell className={cellClassName} onClick={this.handleClick} {...tdProps}>
        {indentText}
        {expandIcon}
        {text}
      </BodyCell>
    );
  }
}
