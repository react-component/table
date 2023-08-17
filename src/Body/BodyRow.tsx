import { responseImmutable, useContext } from '@rc-component/context';
import classNames from 'classnames';
import { useEvent } from 'rc-util';
import * as React from 'react';
import Cell from '../Cell';
import TableContext, { type TableContextProps } from '../context/TableContext';
import devRenderTimes from '../hooks/useRenderTimes';
import type { ColumnType, CustomizeComponent, GetComponentProps, GetRowKey } from '../interface';
import { getColumnsKey } from '../utils/valueUtil';
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
  onRow: GetComponentProps<RecordType>;
  rowExpandable: (record: RecordType) => boolean;
  indent?: number;
  rowKey: React.Key;
  getRowKey: GetRowKey<RecordType>;
}

export function useRowInfo<RecordType>(
  record: RecordType,
  rowKey: React.Key,
): Pick<
  TableContextProps,
  | 'prefixCls'
  | 'fixedInfoList'
  | 'flattenColumns'
  | 'expandableType'
  | 'expandRowByClick'
  | 'onTriggerExpand'
  | 'rowClassName'
  | 'expandedRowClassName'
  | 'indentSize'
  | 'expandIcon'
  | 'expandedRowRender'
  | 'expandIconColumnIndex'
  | 'expandedKeys'
  | 'childrenColumnName'
> & {
  columnsKey: React.Key[];
  nestExpandable: boolean;
  expanded: boolean;
  hasNestChildren: boolean;
  record: RecordType;
} {
  const context: TableContextProps = useContext(TableContext, [
    'prefixCls',
    'fixedInfoList',
    'flattenColumns',
    'expandableType',
    'expandRowByClick',
    'onTriggerExpand',
    'rowClassName',
    'expandedRowClassName',
    'indentSize',
    'expandIcon',
    'expandedRowRender',
    'expandIconColumnIndex',
    'expandedKeys',
    'childrenColumnName',
  ]);

  const { flattenColumns, expandableType, expandedKeys, childrenColumnName, onTriggerExpand } =
    context;

  const columnsKey = getColumnsKey(flattenColumns);

  // Only when row is not expandable and `children` exist in record
  const nestExpandable = expandableType === 'nest';

  const expanded = expandedKeys && expandedKeys.has(rowKey);

  const hasNestChildren = childrenColumnName && record && record[childrenColumnName];

  const onInternalTriggerExpand = useEvent(onTriggerExpand);

  return {
    ...context,
    columnsKey,
    nestExpandable,
    expanded,
    hasNestChildren,
    record,
    onTriggerExpand: onInternalTriggerExpand,
  };
}

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

  let additionalCellProps: React.TdHTMLAttributes<HTMLElement> = {};
  if (column.onCell) {
    additionalCellProps = column.onCell(record, index);
  }

  return {
    key,
    fixedInfo,
    appendCellNode,
    additionalCellProps,
  };
}

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
    rowExpandable,
    onRow,
    indent = 0,
    rowComponent: RowComponent,
    cellComponent,
    scopeCellComponent,
  } = props;
  const rowInfo = useRowInfo(record, rowKey);
  const {
    prefixCls,
    flattenColumns,
    expandableType,
    expandRowByClick,
    onTriggerExpand,
    rowClassName,
    expandedRowClassName,
    expandedRowRender,

    // Misc
    nestExpandable,
    expanded,
  } = rowInfo;

  const [expandRended, setExpandRended] = React.useState(false);

  if (process.env.NODE_ENV !== 'production') {
    devRenderTimes(props);
  }

  React.useEffect(() => {
    if (expanded) {
      setExpandRended(true);
    }
  }, [expanded]);

  const rowSupportExpand = expandableType === 'row' && (!rowExpandable || rowExpandable(record));
  const mergedExpandable = rowSupportExpand || nestExpandable;

  // =========================== onRow ===========================
  const additionalProps = onRow?.(record, index);

  const onClick: React.MouseEventHandler<HTMLElement> = (event, ...args) => {
    if (expandRowByClick && mergedExpandable) {
      onTriggerExpand(record, event);
    }

    additionalProps?.onClick?.(event, ...args);
  };

  // ======================== Base tr row ========================
  let computeRowClassName: string;
  if (typeof rowClassName === 'string') {
    computeRowClassName = rowClassName;
  } else if (typeof rowClassName === 'function') {
    computeRowClassName = rowClassName(record, index, indent);
  }

  const baseRowNode = (
    <RowComponent
      {...additionalProps}
      data-row-key={rowKey}
      className={classNames(
        className,
        `${prefixCls}-row`,
        `${prefixCls}-row-level-${indent}`,
        computeRowClassName,
        additionalProps && additionalProps.className,
      )}
      style={{
        ...style,
        ...(additionalProps ? additionalProps.style : null),
      }}
      onClick={onClick}
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
  if (rowSupportExpand && (expandRended || expanded)) {
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

BodyRow.displayName = 'BodyRow';

export default responseImmutable(BodyRow);
