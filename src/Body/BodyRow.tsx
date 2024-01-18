import classNames from 'classnames';
import * as React from 'react';
import Cell from '../Cell';
import { responseImmutable } from '../context/TableContext';
import devRenderTimes from '../hooks/useRenderTimes';
import useRowInfo from '../hooks/useRowInfo';
import type { ColumnType, CustomizeComponent, GetRowKey } from '../interface';
import ExpandedRow from './ExpandedRow';

export interface BodyRowProps<RecordType> {
  record: RecordType;
  index: number;
  renderIndex: number;
  className?: string;
  style?: React.CSSProperties;
  rowComponent: CustomizeComponent;
  cellComponent: CustomizeComponent;
  scopeCellComponent: CustomizeComponent;
  indent?: number;
  rowKey: React.Key;
  getRowKey: GetRowKey<RecordType>;
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
) {
  const {
    record,
    prefixCls,
    columnsKey,
    fixedInfoList,
    expandIconColumnIndex,
    nestExpandable,
    indentSize,
    expandIcon,
    expanded,
    hasNestChildren,
    onTriggerExpand,
  } = rowInfo;

  const key = columnsKey[colIndex];
  const fixedInfo = fixedInfoList[colIndex];

  // ============= Used for nest expandable =============
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

  let additionalCellProps: React.TdHTMLAttributes<HTMLElement>;
  if (column.onCell) {
    additionalCellProps = column.onCell(record, index);
  }

  return {
    key,
    fixedInfo,
    appendCellNode,
    additionalCellProps: additionalCellProps || {},
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
    record,
    index,
    renderIndex,
    rowKey,
    indent = 0,
    rowComponent: RowComponent,
    cellComponent,
    scopeCellComponent,
  } = props;
  const rowInfo = useRowInfo(record, rowKey, index, indent);
  const {
    prefixCls,
    flattenColumns,
    expandedRowClassName,
    expandedRowRender,
    rowProps,

    // Misc
    expanded,
    rowSupportExpand,
  } = rowInfo;

  // Force render expand row if expanded before
  const expandedRef = React.useRef(false);
  expandedRef.current ||= expanded;

  if (process.env.NODE_ENV !== 'production') {
    devRenderTimes(props);
  }

  // ======================== Base tr row ========================
  const baseRowNode = (
    <RowComponent
      {...rowProps}
      data-row-key={rowKey}
      className={classNames(
        className,
        `${prefixCls}-row`,
        `${prefixCls}-row-level-${indent}`,
        rowProps?.className,
      )}
      style={{
        ...style,
        ...rowProps?.style,
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
        );

        return (
          <Cell
            className={columnClassName}
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
    const computedExpandedRowClassName =
      expandedRowClassName && expandedRowClassName(record, index, indent);
    expandRowNode = (
      <ExpandedRow
        expanded={expanded}
        className={classNames(
          `${prefixCls}-expanded-row`,
          `${prefixCls}-expanded-row-level-${indent + 1}`,
          computedExpandedRowClassName,
        )}
        prefixCls={prefixCls}
        component={RowComponent}
        cellComponent={cellComponent}
        colSpan={flattenColumns.length}
        isEmpty={false}
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
