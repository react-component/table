import * as React from 'react';
import { getCellProps, useRowInfo } from '../Body/BodyRow';
import Cell from '../Cell';
import type { ColumnType } from '../interface';
import classNames from 'classnames';
import { useContext } from '@rc-component/context';
import { GridContext } from './context';

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
  className?: string;
}

/**
 * Return the width of the column by `colSpan`.
 * When `colSpan` is `0` will be trade as `1`.
 */
export function getColumnWidth(colIndex: number, colSpan: number, columnsOffset: number[]) {
  const mergedColSpan = colSpan || 1;
  return columnsOffset[colIndex + mergedColSpan] - (columnsOffset[colIndex] || 0);
}

function VirtualCell<RecordType extends { index: number } = any>(
  props: VirtualCellProps<RecordType>,
) {
  const { rowInfo, column, colIndex, indent, index, record, forceRender, style, className } = props;

  const { render, dataIndex, className: columnClassName, width: colWidth } = column;

  const { columnsOffset } = useContext(GridContext, ['columnsOffset']);

  const { key, fixedInfo, appendCellNode, additionalCellProps } = getCellProps(
    rowInfo,
    column,
    colIndex,
    indent,
    index,
  );

  const { style: cellStyle, colSpan = 1, rowSpan = 1 } = additionalCellProps;

  // ========================= ColWidth =========================
  // column width
  const startColIndex = colIndex - 1;
  const concatColWidth = getColumnWidth(startColIndex, colSpan, columnsOffset);

  // margin offset
  const marginOffset = colSpan > 1 ? (colWidth as number) - concatColWidth : 0;

  // ========================== Style ===========================
  const mergedStyle: React.CSSProperties = {
    ...cellStyle,
    ...style,
    ['--virtual-width' as any]: `${concatColWidth}px`,
    marginRight: marginOffset,
  };

  // 0 rowSpan or colSpan should not render
  if (colSpan === 0 || rowSpan === 0 || (rowSpan > 1 && !forceRender)) {
    mergedStyle.visibility = 'hidden';
  }

  // When `colSpan` or `rowSpan` is `0`, should skip render.
  const mergedRender =
    !forceRender && (colSpan === 0 || rowSpan === 0 || rowSpan > 1) ? () => null : render;

  // ========================== Render ==========================
  return (
    <Cell
      className={classNames(columnClassName, className)}
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

        'data-fixed-info': {
          rowInfo,
          column,
          colIndex,
          indent,
          index,
        },
      }}
    />
  );
}

// ================= Virtual Row Span Cell =================
export interface RowSpanVirtualCellProps<RecordType extends { index: number }>
  extends Omit<VirtualCellProps<RecordType>, 'rowInfo'> {
  record: RecordType;
  rowKey: React.Key;
  top: number;
  height: number;
  left: number;
}

export function RowSpanVirtualCell<RecordType extends { index: number } = any>(
  props: RowSpanVirtualCellProps<RecordType>,
) {
  const { record, rowKey, top, height, left, style } = props;

  const rowInfo = useRowInfo<RecordType>(record, rowKey);
  const { prefixCls } = rowInfo;

  return (
    <VirtualCell
      rowInfo={rowInfo}
      {...props}
      style={{
        ...style,
        top,
        height,
        left,
        position: 'absolute',
      }}
      className={`${prefixCls}-cell-virtual-fixed`}
      forceRender
    />
  );
}

export default VirtualCell;
