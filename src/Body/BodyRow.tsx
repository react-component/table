import classNames from 'classnames';
import * as React from 'react';
import Cell from '../Cell';
import { responseImmutable } from '../context/TableContext';
import devRenderTimes from '../hooks/useRenderTimes';
import useRowInfo from '../hooks/useRowInfo';
import type { ColumnType, CustomizeComponent } from '../interface';
import ExpandedRow from './ExpandedRow';
import { computedExpandedClassName } from '../utils/expandUtil';

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
  getRowKey: (index: number) => React.Key;
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
  getRowKey: (index: number) => React.Key,
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
    expandedKeys,
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

  const addChildrenRowSpan = (rowSpan: number, index2: number) => {
    const _index = index2 + 1;
    let _rowSpan = rowSpan;
    // 下面如果是 0 的，增加 +1 逻辑
    const thisCellProps = column.onCell(record, _index);
    if (thisCellProps.rowSpan === 0) {
      const thisExpanded = expandedKeys.has(getRowKey(_index));
      if (thisExpanded) {
        _rowSpan = _rowSpan + 1;
      }
      // 继续往下找
      return addChildrenRowSpan(_rowSpan, _index);
    }
    // 找不到后返回
    return _rowSpan;
  };

  let additionalCellProps: React.TdHTMLAttributes<HTMLElement>;
  if (column.onCell) {
    additionalCellProps = column.onCell(record, index);
    if (additionalCellProps.rowSpan > 0) {
      // 本身展开 +1
      if (expanded) {
        additionalCellProps.rowSpan = additionalCellProps.rowSpan + 1;
      }
      additionalCellProps.rowSpan = addChildrenRowSpan(additionalCellProps.rowSpan, index);
    }
    console.log('additionalCellProps.rowSpan', additionalCellProps.rowSpan);
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
    getRowKey,
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

  // 若没有 expandedRowRender 参数, 将使用 baseRowNode 渲染 Children
  // 此时如果 level > 1 则说明是 expandedRow, 一样需要附加 computedExpandedRowClassName
  const expandedClsName = computedExpandedClassName(expandedRowClassName, record, index, indent);

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
        {
          [expandedClsName]: indent >= 1,
        },
      )}
      style={{ ...style, ...rowProps?.style }}
    >
      {flattenColumns.map((column: ColumnType<RecordType>, colIndex) => {
        const { render, dataIndex, className: columnClassName } = column;

        const { key, fixedInfo, appendCellNode, additionalCellProps } = getCellProps(
          rowInfo,
          column,
          colIndex,
          indent,
          index,
          getRowKey,
        );

        return (
          <Cell<RecordType>
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

    expandRowNode = (
      <ExpandedRow
        expanded={expanded}
        className={classNames(
          `${prefixCls}-expanded-row`,
          `${prefixCls}-expanded-row-level-${indent + 1}`,
          expandedClsName,
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
