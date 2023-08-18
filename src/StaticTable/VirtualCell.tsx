import * as React from 'react';
import { getCellProps, type useRowInfo } from '../Body/BodyRow';
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
  style?: React.CSSProperties;
  className?: string;

  /** Render cell only when it has `rowSpan > 1` */
  inverse?: boolean;
  getHeight?: (rowSpan: number) => number;
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
  const { rowInfo, column, colIndex, indent, index, record, style, className, inverse, getHeight } =
    props;

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
    pointerEvents: 'auto',
  };

  // When `colSpan` or `rowSpan` is `0`, should skip render.
  const needHide = React.useMemo(() => {
    if (inverse) {
      return rowSpan <= 1;
    } else {
      return colSpan === 0 || rowSpan === 0 || rowSpan > 1;
    }
  }, [rowSpan, colSpan, inverse]);

  // 0 rowSpan or colSpan should not render
  if (needHide) {
    mergedStyle.visibility = 'hidden';
  } else if (inverse) {
    mergedStyle.height = getHeight?.(rowSpan);
  }
  const mergedRender = needHide ? () => null : render;

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
      }}
    />
  );
}

export default VirtualCell;
