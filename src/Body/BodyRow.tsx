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
  rowKeys: React.Key[],
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
    expandable,
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

  let additionalCellProps: React.TdHTMLAttributes<HTMLElement>;
  if (column.onCell) {
    additionalCellProps = column.onCell(record, index);
    const { rowSpan } = additionalCellProps;

    // For expandable row with rowSpan,
    // We should increase the rowSpan if the row is expanded
    if (expandable) {
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
    additionalCellProps: additionalCellProps || {},
  };
}

const getOffsetData = (
  columnsData: {
    column: ColumnType<any>;
    cell: { additionalCellProps: React.TdHTMLAttributes<HTMLElement> };
  }[],
) => {
  let offsetWidth = 0;
  let offsetColumn = 0;
  let isRowSpanEnd = false;
  columnsData.forEach(item => {
    if (!isRowSpanEnd) {
      const { column, cell } = item;
      if (cell.additionalCellProps.rowSpan !== undefined) {
        offsetColumn += 1;
        if (typeof column.width === 'number') {
          offsetWidth = offsetWidth + (column.width ?? 0);
        }
      } else {
        isRowSpanEnd = true;
      }
    }
  });
  return { offsetWidth, offsetColumn };
};

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
    indent = 0,
    rowComponent: RowComponent,
    cellComponent,
    scopeCellComponent,
    rowKeys,
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

  const { columnsData, offsetData } = React.useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const columnsData = flattenColumns.map((column: ColumnType<RecordType>, colIndex) => {
      const cell = getCellProps(rowInfo, column, colIndex, indent, index, rowKeys);
      return { column, cell };
    });
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const offsetData = getOffsetData(columnsData);
    return { columnsData, offsetData };
  }, [flattenColumns, indent, index, rowInfo, rowKeys]);

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
      {columnsData.map(item => {
        const { column, cell } = item;
        const { render, dataIndex, className: columnClassName } = column;

        const { key, fixedInfo, appendCellNode, additionalCellProps } = cell;

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
        offsetWidth={offsetData.offsetWidth}
        colSpan={flattenColumns.length - offsetData.offsetColumn}
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
