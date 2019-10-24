import * as React from 'react';
import shallowEqual from 'shallowequal';
import getScrollBarSize from 'rc-util/lib/getScrollBarSize';
import ResizeObserver from 'rc-resize-observer';
import Cell from '../Cell';
import { PureContextConsumer, DefaultPureCompareProps } from '../context/TableContext';
import { getColumnKey, mergeObject } from '../utils/valueUtil';
import {
  ColumnType,
  StickyOffsets,
  ExpandedRowRender,
  CustomizeComponent,
  InternalColumnType,
} from '../interface';
import ResizeContext from '../context/ResizeContext';
import { getCellFixedInfo } from '../utils/fixUtil';

const scrollBarSize = getScrollBarSize();

export interface BodyRowProps<RecordType> {
  record: RecordType;
  index: number;
  /** Set if need collect column width info */
  measureColumnWidth: boolean;
  stickyOffsets: StickyOffsets;
  expandable: boolean;
  expanded: boolean;
  expandedRowRender: ExpandedRowRender<RecordType>;
  additionalProps: React.HTMLAttributes<HTMLTableRowElement>;
  cellComponent: CustomizeComponent;
}

type RawColumnType<RecordType> = Partial<InternalColumnType<RecordType>>;

/** Return a subset of `ColumnType` which used in Row */
function getRequiredColumnProps<RecordType>(
  columns: InternalColumnType<RecordType>[],
): RawColumnType<RecordType>[] {
  return (columns || []).map(({ key, dataIndex, render, fixed, width, ellipsis, colWidth }) => ({
    key,
    dataIndex,
    render,
    fixed,
    width,
    colWidth,
    ellipsis,
  }));
}

/**
 * Merged with BodyRowProps & function component internal state props
 */
interface BodyRowPassingProps<RecordType> extends BodyRowProps<RecordType> {
  expandRended: boolean;
}

interface ComputedProps<RecordType> extends BodyRowPassingProps<RecordType> {
  rowColumns: ColumnType<RecordType>[];
  prefixCls: string;
  componentWidth: number;
  fixHeader: boolean;
  fixColumn: boolean;
}

function shouldUpdate<RecordType>(
  prevProps: ComputedProps<RecordType>,
  props: ComputedProps<RecordType>,
): boolean {
  const {
    rowColumns: prevRowColumns,
    additionalProps: prevAdditionalProps,
    ...prevRestProps
  } = prevProps;
  const { rowColumns, additionalProps, ...restProps } = props;

  if (
    prevRowColumns.length !== rowColumns.length ||
    prevRowColumns.some((prevColumn, colIndex) => !shallowEqual(prevColumn, rowColumns[colIndex]))
  ) {
    return true;
  }

  if (!shallowEqual(prevAdditionalProps, additionalProps)) {
    return true;
  }

  return !shallowEqual(prevRestProps, restProps);
}

function useComputeRowProps<RecordType>({
  context: { flattenColumns, prefixCls, fixHeader, fixColumn, componentWidth },
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
  };
}

function BodyRow<RecordType>(props: BodyRowProps<RecordType>) {
  const { onColumnResize } = React.useContext(ResizeContext);
  const [expandRended, setExpandRended] = React.useState(false);

  React.useEffect(() => {
    if (props.expandable && props.expanded) {
      setExpandRended(true);
    }
  }, [props.expanded, props.expandable]);

  return (
    <PureContextConsumer<RecordType, BodyRowPassingProps<RecordType>, ComputedProps<RecordType>>
      {...props}
      expandRended={expandRended}
      useComputeProps={useComputeRowProps}
      shouldUpdate={shouldUpdate}
    >
      {({
        prefixCls,
        rowColumns,
        record,
        index,
        measureColumnWidth,
        stickyOffsets,
        expanded,
        expandable,
        expandedRowRender,
        additionalProps = {},
        cellComponent,
        fixHeader,
        fixColumn,
        componentWidth,
      }) => {
        // Move to Body to enhance performance
        const fixedInfoList = rowColumns.map((column, colIndex) =>
          getCellFixedInfo(colIndex, colIndex, rowColumns, stickyOffsets),
        );

        // ======================== Base tr row ========================
        const baseRowNode = (
          <tr {...additionalProps}>
            {rowColumns.map((column: InternalColumnType<RecordType>, colIndex) => {
              const { render, dataIndex } = column;

              const key = getColumnKey(column, colIndex);
              const fixedInfo = fixedInfoList[colIndex];

              let additionalCellProps: React.HTMLAttributes<HTMLElement> & {
                'data-col-width'?: boolean;
              };
              if (column.onCell) {
                additionalCellProps = column.onCell(record, index);
              }

              if (column.width) {
                additionalCellProps = mergeObject(additionalCellProps, {
                  style: {
                    width: column.width,
                  },
                });
              }

              if (column.colWidth) {
                additionalCellProps = mergeObject(additionalCellProps, {
                  'data-col-width': column.colWidth,
                });
              }

              const cellNode = (
                <Cell
                  ellipsis={column.ellipsis}
                  component={cellComponent}
                  prefixCls={prefixCls}
                  key={key}
                  record={record}
                  index={index}
                  dataIndex={dataIndex}
                  render={render}
                  {...fixedInfo}
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
          </tr>
        );

        // ======================== Expand row =========================
        let expandRowNode: React.ReactElement;
        if (expandable && (expandRended || expanded)) {
          let expandContent = expandedRowRender(record, index, 1, expanded);

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

          expandRowNode = (
            <tr
              className={`${prefixCls}-expanded-row`}
              style={{
                display: expanded ? null : 'none',
              }}
            >
              <Cell component={cellComponent} prefixCls={prefixCls} colSpan={rowColumns.length}>
                {expandContent}
              </Cell>
            </tr>
          );
        }

        return (
          <>
            {baseRowNode}
            {expandRowNode}
          </>
        );
      }}
    </PureContextConsumer>
  );
}

BodyRow.displayName = 'BodyRow';

export default BodyRow;
