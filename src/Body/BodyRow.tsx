import cls from 'classnames';
import * as React from 'react';
import Cell from '../Cell';
import { responseImmutable } from '../context/TableContext';
import devRenderTimes from '../hooks/useRenderTimes';
import useRowInfo from '../hooks/useRowInfo';
import type { ColumnType, CustomizeComponent } from '../interface';
import ExpandedRow from './ExpandedRow';
import { computedExpandedClassName } from '../utils/expandUtil';
import type { TableProps } from '..';
import useStickyOffsets from '../hooks/useStickyOffsets';
import { getCellFixedInfo } from '../utils/fixUtil';

export interface BodyRowProps<RecordType> {
  record: RecordType;
  index: number;
  renderIndex: number;
  className?: string;
  style?: React.CSSProperties;
  classNames: TableProps['classNames']['body'];
  styles: TableProps['styles']['body'];
  rowComponent: CustomizeComponent;
  cellComponent: CustomizeComponent;
  scopeCellComponent: CustomizeComponent;
  indent?: number;
  rowKey: React.Key;
  rowKeys: React.Key[];

  // Expanded Row
  expandedRowInfo?: {
    offset: number;
    colSpan: number;
    sticky: number;
  };
}

// ==================================================================================
// ==                                 getCellProps                                 ==
// ==================================================================================
export function getCellProps<RecordType>(
  rowInfo: ReturnType<typeof useRowInfo<RecordType>>,
  column: ColumnType<RecordType>,
  colIndex: number,
  indent: number,
  index: number,
  rowKeys: React.Key[] = [],
  expandedRowOffset = 0,
  rowStickyOffsets?: ReturnType<typeof useStickyOffsets>,
) {
  const {
    record,
    prefixCls,
    columnsKey,
    fixedInfoList,
    flattenColumns,
    expandIconColumnIndex,
    nestExpandable,
    indentSize,
    expandIcon,
    expanded,
    hasNestChildren,
    onTriggerExpand,
    expandable,
    expandedKeys,
  } = rowInfo;

  const key = columnsKey[colIndex];
  let fixedInfo = fixedInfoList[colIndex];

  if (column.fixed && rowStickyOffsets) {
    fixedInfo = getCellFixedInfo(colIndex, colIndex, flattenColumns, rowStickyOffsets);
  }
  let appendCellNode: React.ReactNode;
  if (colIndex === (expandIconColumnIndex || 0) && nestExpandable) {
    appendCellNode = (
      <>
        <span
          style={{ paddingLeft: `${indentSize * indent}px` }}
          className={`${prefixCls}-row-indent indent-level-${indent}`}
        />
        {expandIcon({
          prefixCls,
          expanded,
          expandable: hasNestChildren,
          record,
          onExpand: onTriggerExpand,
        })}
      </>
    );
  }

  const additionalCellProps = column.onCell?.(record, index) || {};

  // Expandable row has offset
  if (expandedRowOffset) {
    const { rowSpan = 1 } = additionalCellProps;

    // For expandable row with rowSpan,
    // We should increase the rowSpan if the row is expanded
    if (expandable && rowSpan && colIndex < expandedRowOffset) {
      let currentRowSpan = rowSpan;

      for (let i = index; i < index + rowSpan; i += 1) {
        const rowKey = rowKeys[i];
        if (expandedKeys.has(rowKey)) {
          currentRowSpan += 1;
        }
      }
      additionalCellProps.rowSpan = currentRowSpan;
    }
  }

  return {
    key,
    fixedInfo,
    appendCellNode,
    additionalCellProps: additionalCellProps,
  };
}

// ==================================================================================
// ==                                 getCellProps                                 ==
// ==================================================================================
function BodyRow<RecordType extends { children?: readonly RecordType[] }>(
  props: BodyRowProps<RecordType>,
) {
  if (process.env.NODE_ENV !== 'production') {
    devRenderTimes(props);
  }

  const {
    className,
    style,
    classNames,
    styles,
    record,
    index,
    renderIndex,
    rowKey,
    rowKeys,
    indent = 0,
    rowComponent: RowComponent,
    cellComponent,
    scopeCellComponent,
    expandedRowInfo,
  } = props;

  const rowInfo = useRowInfo(record, rowKey, index, indent);
  const {
    prefixCls,
    flattenColumns,
    colWidths,
    expandedRowClassName,
    expandedRowRender,
    rowProps,

    // Misc
    expanded,
    rowSupportExpand,
  } = rowInfo;

  const hasColSpanZero = React.useMemo(() => {
    return flattenColumns.some(col => {
      const cellProps = col.onCell?.(record, index) || {};
      return (cellProps.colSpan ?? 1) === 0;
    });
  }, [flattenColumns, record, index]);

  const rowStickyOffsets = useStickyOffsets(
    colWidths,
    flattenColumns,
    hasColSpanZero ? { record, rowIndex: index } : undefined,
  );

  // Force render expand row if expanded before
  const expandedRef = React.useRef(false);
  expandedRef.current ||= expanded;

  if (process.env.NODE_ENV !== 'production') {
    devRenderTimes(props);
  }

  // 若没有 expandedRowRender 参数, 将使用 baseRowNode 渲染 Children
  // 此时如果 level > 1 则说明是 expandedRow, 一样需要附加 computedExpandedRowClassName
  const expandedClsName = computedExpandedClassName(expandedRowClassName, record, index, indent);

  // ======================== Base tr row ========================
  const baseRowNode = (
    <RowComponent
      {...rowProps}
      data-row-key={rowKey}
      className={cls(
        className,
        `${prefixCls}-row`,
        `${prefixCls}-row-level-${indent}`,
        rowProps?.className,
        classNames.row,
        {
          [expandedClsName]: indent >= 1,
        },
      )}
      style={{
        ...style,
        ...rowProps?.style,
        ...styles.row,
      }}
    >
      {flattenColumns.map((column: ColumnType<RecordType>, colIndex) => {
        const { render, dataIndex, className: columnClassName } = column;

        const { key, fixedInfo, appendCellNode, additionalCellProps } = getCellProps(
          rowInfo,
          column,
          colIndex,
          indent,
          index,
          rowKeys,
          expandedRowInfo?.offset,
          rowStickyOffsets,
        );

        return (
          <Cell<RecordType>
            className={cls(columnClassName, classNames.cell)}
            style={styles.cell}
            ellipsis={column.ellipsis}
            align={column.align}
            scope={column.rowScope}
            component={column.rowScope ? scopeCellComponent : cellComponent}
            prefixCls={prefixCls}
            key={key}
            record={record}
            index={index}
            renderIndex={renderIndex}
            dataIndex={dataIndex}
            render={render}
            shouldCellUpdate={column.shouldCellUpdate}
            {...fixedInfo}
            appendNode={appendCellNode}
            additionalProps={additionalCellProps}
          />
        );
      })}
    </RowComponent>
  );

  // ======================== Expand Row =========================
  let expandRowNode: React.ReactElement;
  if (rowSupportExpand && (expandedRef.current || expanded)) {
    const expandContent = expandedRowRender(record, index, indent + 1, expanded);

    expandRowNode = (
      <ExpandedRow
        expanded={expanded}
        className={cls(
          `${prefixCls}-expanded-row`,
          `${prefixCls}-expanded-row-level-${indent + 1}`,
          expandedClsName,
        )}
        prefixCls={prefixCls}
        component={RowComponent}
        cellComponent={cellComponent}
        colSpan={expandedRowInfo ? expandedRowInfo.colSpan : flattenColumns.length}
        isEmpty={false}
        stickyOffset={expandedRowInfo?.sticky}
      >
        {expandContent}
      </ExpandedRow>
    );
  }

  return (
    <>
      {baseRowNode}
      {expandRowNode}
    </>
  );
}

if (process.env.NODE_ENV !== 'production') {
  BodyRow.displayName = 'BodyRow';
}

export default responseImmutable(BodyRow);
