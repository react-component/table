import React from 'react';
import shallowEqual from 'shallowequal';
import ResizeObserver from 'rc-resize-observer';
import Cell from '../Cell';
import { PureContextConsumer, DefaultPureCompareProps } from '../context/TableContext';
import { getColumnKey } from '../utils/valueUtil';
import { ColumnType, StickyOffsets } from '../interface';
import ResizeContext from '../context/ResizeContext';
import { getCellFixedInfo } from '../utils/fixUtil';

export interface BodyRowProps<RecordType> {
  record: RecordType;
  index: number;
  /** Set if need collect column width info */
  measureColumnWidth: boolean;
  stickyOffsets: StickyOffsets;
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

interface ComputedProps<RecordType> extends BodyRowProps<RecordType> {
  rowColumns: ColumnType<RecordType>[];
  prefixCls: string;
}

function shouldUpdate<RecordType>(
  prevProps: ComputedProps<RecordType>,
  props: ComputedProps<RecordType>,
): boolean {
  const {
    prefixCls: prevPrefixCls,
    record: prevRecord,
    index: prevIndex,
    rowColumns: prevRowColumns,
    stickyOffsets: prevStickyOffsets,
  } = prevProps;
  const { prefixCls, record, index, rowColumns, stickyOffsets } = props;

  if (
    prevPrefixCls !== prefixCls ||
    prevRecord !== record ||
    prevIndex !== index ||
    prevRowColumns.length !== rowColumns.length ||
    prevStickyOffsets !== stickyOffsets
  ) {
    return true;
  }

  if (
    prevRowColumns.some((prevColumn, colIndex) => !shallowEqual(prevColumn, rowColumns[colIndex]))
  ) {
    return true;
  }

  return false;
}

function useComputeRowProps<RecordType>({
  record,
  index,
  measureColumnWidth,
  stickyOffsets,
  context: { flattenColumns, prefixCls },
}: DefaultPureCompareProps<RecordType, BodyRowProps<RecordType>>): ComputedProps<RecordType> {
  const rowColumns = React.useMemo(() => getRequiredColumnProps<RecordType>(flattenColumns), [
    flattenColumns,
  ]);

  return {
    record,
    index,
    measureColumnWidth,
    rowColumns,
    stickyOffsets,
    prefixCls,
  };
}

function BodyRow<RecordType>(props: BodyRowProps<RecordType>) {
  const { onColumnResize } = React.useContext(ResizeContext);

  return (
    <PureContextConsumer<RecordType, BodyRowProps<RecordType>, ComputedProps<RecordType>>
      {...props}
      useComputeProps={useComputeRowProps}
      shouldUpdate={shouldUpdate}
    >
      {({ prefixCls, rowColumns, record, index, measureColumnWidth, stickyOffsets }) => (
          <tr>
            {rowColumns.map((column, colIndex) => {
              const { render, dataIndex } = column;

              const key = getColumnKey(column, colIndex);

              const fixedInfo = getCellFixedInfo(colIndex, colIndex, rowColumns, stickyOffsets);

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
        )}
    </PureContextConsumer>
  );
}

BodyRow.displayName = 'BodyRow';

export default BodyRow;
