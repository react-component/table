import * as React from 'react';
import classNames from 'classnames';
import get from 'lodash/get';
import { ColumnType, CustomizeComponent, Cell, RenderedCell } from './interface';

function isInvalidRenderCellText(text: any): text is RenderedCell {
  return (
    text &&
    !React.isValidElement(text) &&
    Object.prototype.toString.call(text) === '[object Object]'
  );
}

export interface TableCellProps<ValueType> {
  record?: ValueType;
  prefixCls?: string;
  index?: number;
  indent?: number;
  indentSize?: number;
  column?: ColumnType;
  title?: string;
  expandIcon?: React.ReactNode;
  component?: CustomizeComponent;
}

export default class TableCell<ValueType> extends React.Component<TableCellProps<ValueType>> {
  handleClick: React.MouseEventHandler<HTMLElement> = e => {
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
    let text: React.ReactNode | RenderedCell;
    if (typeof dataIndex === 'number') {
      text = get(record, dataIndex);
    } else if (!dataIndex || dataIndex.length === 0) {
      text = record;
    } else {
      text = get(record, dataIndex);
    }
    let tdProps: Cell & { title?: string } = {};
    let colSpan: number;
    let rowSpan: number;

    if (render) {
      text = render(text, record, index);

      // `render` support cell with additional config like `props`
      if (isInvalidRenderCellText(text)) {
        tdProps = text.props || tdProps;
        ({ colSpan, rowSpan } = tdProps);
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

    if (column.ellipsis) {
      if (typeof text === 'string') {
        tdProps.title = text;
      } else if (text) {
        const { props: textProps } = text as React.ReactElement<any>;
        if (textProps && textProps.children && typeof textProps.children === 'string') {
          tdProps.title = textProps.children;
        }
      }
    }

    return (
      <BodyCell className={cellClassName} onClick={this.handleClick} {...tdProps}>
        {indentText}
        {expandIcon}
        {text}
      </BodyCell>
    );
  }
}
