import * as React from 'react';
import shallowEqual from 'shallowequal';
import classNames from 'classnames';
import getScrollBarSize from 'rc-util/lib/getScrollBarSize';
import ResizeObserver from 'rc-resize-observer';
import Cell from '../Cell';
import { PureContextConsumer, DefaultPureCompareProps } from '../context/TableContext';
import { getColumnKey } from '../utils/valueUtil';
import {
  ColumnType,
  StickyOffsets,
  ExpandedRowRender,
  CustomizeComponent,
  RenderExpandIcon,
  TriggerEventHandler,
  GetComponentProps,
  Key,
  GetRowKey,
  ExpandableType,
  RowClassName,
} from '../interface';
import ResizeContext from '../context/ResizeContext';
import { getCellFixedInfo } from '../utils/fixUtil';

const scrollBarSize = getScrollBarSize();

export interface BodyRowProps<RecordType> {
  record: RecordType;
  index: number;
  className?: string;
  style?: React.CSSProperties;
  /** Set if need collect column width info */
  measureColumnWidth: boolean;
  stickyOffsets: StickyOffsets;
  recordKey: Key;
  expandedKeys: Set<Key>;
  expandedRowRender: ExpandedRowRender<RecordType>;
  rowComponent: CustomizeComponent;
  cellComponent: CustomizeComponent;
  onTriggerExpand: TriggerEventHandler<RecordType>;
  onRow: GetComponentProps<RecordType>;
  rowExpandable: (record: RecordType) => boolean;
  indent?: number;
}

type RawColumnType<RecordType> = Partial<ColumnType<RecordType>>;

/** Return a subset of `ColumnType` which used in Row */
function getRequiredColumnProps<RecordType>(
  columns: ColumnType<RecordType>[],
): RawColumnType<RecordType>[] {
  return (columns || []).map(({ key, dataIndex, render, fixed, width, ellipsis, className }) => ({
    key,
    dataIndex,
    render,
    fixed,
    width,
    ellipsis,
    className,
  }));
}

/**
 * Merged with BodyRowProps & function component internal state props
 */
interface BodyRowPassingProps<RecordType> extends BodyRowProps<RecordType> {
  expandRended: boolean;
  expanded: boolean;
}

interface ComputedProps<RecordType> extends BodyRowPassingProps<RecordType> {
  rowColumns: ColumnType<RecordType>[];
  prefixCls: string;
  componentWidth: number;
  fixHeader: boolean;
  fixColumn: boolean;
  expandIcon: RenderExpandIcon<RecordType>;
  getRowKey: GetRowKey<RecordType>;
  indentSize: number;
  expandableType: ExpandableType;
  expandRowByClick: boolean;
  rowClassName: string | RowClassName<RecordType>;
  expandedRowClassName: RowClassName<RecordType>;
}

function shouldUpdate<RecordType>(
  prevProps: ComputedProps<RecordType>,
  props: ComputedProps<RecordType>,
): boolean {
  const { rowColumns: prevRowColumns, ...prevRestProps } = prevProps;
  const { rowColumns, ...restProps } = props;

  if (
    prevRowColumns.length !== rowColumns.length ||
    prevRowColumns.some((prevColumn, colIndex) => !shallowEqual(prevColumn, rowColumns[colIndex]))
  ) {
    return true;
  }

  return !shallowEqual(prevRestProps, restProps);
}

function useComputeRowProps<RecordType>({
  context: {
    flattenColumns,
    prefixCls,
    fixHeader,
    fixColumn,
    componentWidth,
    expandIcon,
    getRowKey,
    indentSize,
    expandableType,
    expandRowByClick,
    rowClassName,
    expandedRowClassName,
  },
  ...props
}: DefaultPureCompareProps<RecordType, BodyRowPassingProps<RecordType>>): ComputedProps<
  RecordType
> {
  const rowColumns = React.useMemo(() => getRequiredColumnProps<RecordType>(flattenColumns), [
    flattenColumns,
  ]);

  return {
    ...props,
    rowColumns,
    prefixCls,
    fixHeader,
    fixColumn,
    componentWidth,
    expandIcon,
    getRowKey,
    indentSize,
    expandableType,
    expandRowByClick,
    rowClassName,
    expandedRowClassName,
  };
}

function BodyRow<RecordType>(props: BodyRowProps<RecordType>) {
  const { onColumnResize } = React.useContext(ResizeContext);
  const [expandRended, setExpandRended] = React.useState(false);

  const expanded = props.expandedKeys.has(props.recordKey);

  React.useEffect(() => {
    if (expanded) {
      setExpandRended(true);
    }
  }, [expanded]);

  return (
    <PureContextConsumer<RecordType, BodyRowPassingProps<RecordType>, ComputedProps<RecordType>>
      {...props}
      expanded={expanded}
      expandRended={expandRended}
      useComputeProps={useComputeRowProps}
      shouldUpdate={shouldUpdate}
    >
      {({
        prefixCls,
        className,
        style,
        rowColumns,
        record,
        index,
        measureColumnWidth,
        stickyOffsets,
        expandedRowRender,
        rowComponent: RowComponent,
        cellComponent,
        fixHeader,
        fixColumn,
        componentWidth,
        expandIcon,
        onTriggerExpand,
        onRow,
        rowExpandable,
        getRowKey,
        indent = 0,
        indentSize,
        expandableType,
        expandRowByClick,
        rowClassName,
        expandedRowClassName,
      }) => {
        // Move to Body to enhance performance
        const fixedInfoList = rowColumns.map((column, colIndex) =>
          getCellFixedInfo(colIndex, colIndex, rowColumns, stickyOffsets),
        );

        const rowSupportExpand =
          expandableType === 'row' && (!rowExpandable || rowExpandable(record));
        // Only when row is not expandable and `children` exist in record
        const nestExpandable = expandableType === 'nest';
        const hasNestChildren = 'children' in record;
        const mergedExpandable = rowSupportExpand || nestExpandable;

        // =========================== onRow ===========================
        let additionalProps: React.HTMLAttributes<HTMLElement>;
        if (onRow) {
          additionalProps = onRow(record, index);
        }

        const onClick: React.MouseEventHandler<HTMLTableRowElement> = (event, ...args) => {
          if (expandRowByClick && mergedExpandable) {
            onTriggerExpand(record, event);
          }

          if (additionalProps && additionalProps.onClick) {
            additionalProps.onClick(event, ...args);
          }
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
            {rowColumns.map((column: ColumnType<RecordType>, colIndex) => {
              const { render, dataIndex, className: columnClassName } = column;

              const key = getColumnKey(column, colIndex);
              const fixedInfo = fixedInfoList[colIndex];

              // ============= Used for nest expandable =============
              let appendCellNode: React.ReactNode;
              if (colIndex === 0 && nestExpandable) {
                appendCellNode = (
                  <>
                    <span
                      style={{ paddingLeft: `${indentSize * indent}px` }}
                      className={`${prefixCls}-indent indent-level-${indent}`}
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

              let additionalCellProps: React.HTMLAttributes<HTMLElement>;
              if (column.onCell) {
                additionalCellProps = column.onCell(record, index);
              }

              const cellNode = (
                <Cell
                  className={columnClassName}
                  ellipsis={column.ellipsis}
                  component={cellComponent}
                  prefixCls={prefixCls}
                  key={key}
                  record={record}
                  index={index}
                  dataIndex={dataIndex}
                  render={render}
                  {...fixedInfo}
                  appendNode={appendCellNode}
                  additionalProps={additionalCellProps}
                />
              );

              if (measureColumnWidth) {
                return (
                  <ResizeObserver
                    key={key}
                    onResize={({ width }) => {
                      onColumnResize(colIndex, width);
                    }}
                  >
                    {cellNode}
                  </ResizeObserver>
                );
              }

              return cellNode;
            })}
          </RowComponent>
        );

        // ======================== Expand Row =========================
        let expandRowNode: React.ReactElement;
        if (rowSupportExpand && (expandRended || expanded)) {
          let expandContent = expandedRowRender(record, index, indent + 1, expanded);

          if (fixColumn) {
            expandContent = (
              <div
                style={{
                  width: componentWidth - (fixHeader ? scrollBarSize : 0),
                  position: 'sticky',
                  left: 0,
                  overflow: 'hidden',
                }}
                className={`${prefixCls}-expanded-row-fixed`}
              >
                {expandContent}
              </div>
            );
          }

          let computeExpandRowClassName: string;
          if (expandedRowClassName) {
            computeExpandRowClassName = expandedRowClassName(record, index, indent);
          }

          expandRowNode = (
            <RowComponent
              className={classNames(
                `${prefixCls}-expanded-row`,
                `${prefixCls}-expanded-row-level-${indent + 1}`,
                computeExpandRowClassName,
              )}
              style={{
                display: expanded ? null : 'none',
              }}
            >
              <Cell component={cellComponent} prefixCls={prefixCls} colSpan={rowColumns.length}>
                {expandContent}
              </Cell>
            </RowComponent>
          );
        }

        // ========================= Nest Row ==========================
        let nestRowNode: React.ReactElement;
        if (hasNestChildren && expanded) {
          nestRowNode = ((record as any).children || []).map(
            (subRecord: RecordType, subIndex: number) => {
              const subKey = getRowKey(subRecord, subIndex);

              return (
                <BodyRow
                  {...props}
                  key={subKey}
                  record={subRecord}
                  recordKey={subKey}
                  index={subIndex}
                  indent={indent + 1}
                  measureColumnWidth={false}
                />
              );
            },
          );
        }

        return (
          <>
            {baseRowNode}
            {expandRowNode}
            {nestRowNode}
          </>
        );
      }}
    </PureContextConsumer>
  );
}

BodyRow.displayName = 'BodyRow';

export default BodyRow;
