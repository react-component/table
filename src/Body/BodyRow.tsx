import * as React from 'react';
import shallowEqual from 'shallowequal';
import ResizeObserver from 'rc-resize-observer';
import Cell from '../Cell';
import { PureContextConsumer, DefaultPureCompareProps } from '../context/TableContext';
import { getColumnKey } from '../utils/valueUtil';
import { ColumnType, StickyOffsets, ExpandedRowRender } from '../interface';
import ResizeContext from '../context/ResizeContext';
import { getCellFixedInfo } from '../utils/fixUtil';

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
}

type RawColumnType<RecordType> = Partial<ColumnType<RecordType>>;

/** Return a subset of `ColumnType` which used in Row */
function getRequiredColumnProps<RecordType>(
  columns: ColumnType<RecordType>[],
): RawColumnType<RecordType>[] {
  return (columns || []).map(({ key, dataIndex, render, fixed }) => ({
    key,
    dataIndex,
    render,
    fixed,
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
  context: { flattenColumns, prefixCls },
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
        expandedRowRender,
        additionalProps = {},
      }) => {
        const fixedInfoList = rowColumns.map((column, colIndex) =>
          getCellFixedInfo(colIndex, colIndex, rowColumns, stickyOffsets),
        );

        // Base tr row
        const baseRowNode = (
          <tr {...additionalProps}>
            {rowColumns.map((column, colIndex) => {
              const { render, dataIndex } = column;

              const key = getColumnKey(column, colIndex);
              const fixedInfo = fixedInfoList[colIndex];

              const cellNode = (
                <Cell
                  prefixCls={prefixCls}
                  key={key}
                  record={record}
                  index={index}
                  dataIndex={dataIndex}
                  render={render}
                  {...fixedInfo}
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

        // Expand row
        let expandRowNode: React.ReactElement;
        if (expandRended || expanded) {
          expandRowNode = (
            <tr
              style={{
                display: expanded ? null : 'none',
              }}
            >
              <Cell prefixCls={prefixCls}>{null}</Cell>
              <Cell prefixCls={prefixCls} colSpan={rowColumns.length - 1}>
                {expandedRowRender(record, index, 0, expanded)}
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
