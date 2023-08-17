import * as React from 'react';
import { getCellProps, useRowInfo } from '../Body/BodyRow';
import Cell from '../Cell';
import type { ColumnType } from '../interface';

export interface VirtualCellProps<RecordType extends { index: number }> {
  rowInfo: ReturnType<typeof useRowInfo>;
  column: ColumnType<RecordType>;
  colIndex: number;
  indent: number;
  index: number;
  record: RecordType;

  // Follow props is used for RowSpanVirtualCell only
  forceRender?: boolean;
  style?: React.CSSProperties;
}

function VirtualCell<RecordType extends { index: number } = any>(
  props: VirtualCellProps<RecordType>,
) {
  const { rowInfo, column, colIndex, indent, index, record, forceRender, style } = props;

  const { render, dataIndex, className: columnClassName, width: colWidth } = column;

  const { key, fixedInfo, appendCellNode, additionalCellProps } = getCellProps(
    rowInfo,
    column,
    colIndex,
    indent,
    index,
  );

  const { style: cellStyle, colSpan, rowSpan } = additionalCellProps;
  const mergedStyle = {
    ...cellStyle,
    ...style,
    '--virtual-width': `${colWidth}px`,
  };

  // When `colSpan` or `rowSpan` is `0`, should skip render.
  const mergedRender =
    !forceRender && (colSpan === 0 || rowSpan === 0 || colSpan > 1 || rowSpan > 1)
      ? () => null
      : render;

  return (
    <Cell
      className={columnClassName}
      ellipsis={column.ellipsis}
      align={column.align}
      scope={column.rowScope}
      component="div"
      prefixCls={rowInfo.prefixCls}
      key={key}
      record={record}
      index={index}
      renderIndex={record.index}
      dataIndex={dataIndex}
      render={mergedRender}
      shouldCellUpdate={column.shouldCellUpdate}
      {...fixedInfo}
      appendNode={appendCellNode}
      additionalProps={{
        ...additionalCellProps,
        style: mergedStyle,

        // Virtual should reset `colSpan` & `rowSpan`
        rowSpan: 1,
        colSpan: 1,
      }}
    />
  );
}

export interface RowSpanVirtualCellProps<RecordType extends { index: number }>
  extends Omit<VirtualCellProps<RecordType>, 'rowInfo'> {
  record: RecordType;
  rowKey: React.Key;
}

export function RowSpanVirtualCell<RecordType extends { index: number } = any>(
  props: RowSpanVirtualCellProps<RecordType>,
) {
  const { record, rowKey } = props;

  const rowInfo = useRowInfo<RecordType>(record, rowKey);

  return <VirtualCell rowInfo={rowInfo} {...props} forceRender />;
}

export default VirtualCell;
