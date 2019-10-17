import React from 'react';
import shallowEqual from 'shallowequal';
import Cell from './Cell';
import { PureContextConsumer, DefaultPureCompareProps } from './context';
import { getColumnKey } from './utils/valueUtil';
import { ColumnType } from './interface';

export interface RowProps<RecordType> {
  record: RecordType;
  index: number;
  flattenColumns?: ColumnType<RecordType>[];
}

interface RawColumnType<RecordType> {
  key: ColumnType<RecordType>['key'];
  dataIndex: ColumnType<RecordType>['dataIndex'];
  render: ColumnType<RecordType>['render'];
}

/** Return a subset of `ColumnType` which used in Row */
function getRequiredColumnProps<RecordType>(
  columns: ColumnType<RecordType>[],
): RawColumnType<RecordType>[] {
  return (columns || []).map(({ key, dataIndex, render }) => ({ key, dataIndex, render }));
}

interface ComputedProps<RecordType> {
  record: RecordType;
  index: number;
  rowColumns: ColumnType<RecordType>[];
}

function shouldUpdate<RecordType>(
  prevProps: ComputedProps<RecordType>,
  props: ComputedProps<RecordType>,
): boolean {
  const { record: prevRecord, index: prevIndex, rowColumns: prevRowColumns } = prevProps;
  const { record, index, rowColumns } = props;

  if (prevRecord !== record || prevIndex !== index || prevRowColumns.length !== rowColumns.length) {
    return false;
  }

  return prevRowColumns.every((prevColumn, colIndex) =>
    shallowEqual(prevColumn, rowColumns[colIndex]),
  );
}

function useComputeRowProps<RecordType>({
  record,
  index,
  flattenColumns,
  context,
}: DefaultPureCompareProps<RecordType, RowProps<RecordType>>): ComputedProps<RecordType> {
  /**
   * Row is both used in `tbody` & `thead`.
   * In `tbody`, we use `flattenColumns` from Table context.
   * In `thead`, we need use `flattenColumns` row by row since it will change by nested head
   */
  const mergedFlattenColumns = flattenColumns || context.flattenColumns;

  const rowColumns = React.useMemo(() => getRequiredColumnProps<RecordType>(mergedFlattenColumns), [
    mergedFlattenColumns,
  ]);

  return {
    record,
    index,
    rowColumns,
  };
}

function Row<RecordType>(props: RowProps<RecordType>) {
  return (
    <PureContextConsumer<RecordType, RowProps<RecordType>, ComputedProps<RecordType>>
      {...props}
      useComputeProps={useComputeRowProps}
      shouldUpdate={shouldUpdate}
    >
      {({ rowColumns, record, index }) => (
        <tr>
          {rowColumns.map((column, colIndex) => {
            const { render, dataIndex } = column;

            return (
              <Cell
                key={getColumnKey(column, colIndex)}
                record={record}
                index={index}
                dataIndex={dataIndex}
                render={render}
              />
            );
          })}
        </tr>
      )}
    </PureContextConsumer>
  );
}

Row.displayName = 'Row';

export default Row;
