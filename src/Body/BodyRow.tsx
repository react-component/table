import React from 'react';
import shallowEqual from 'shallowequal';
import Cell from '../Cell';
import { PureContextConsumer, DefaultPureCompareProps } from '../context/DataContext';
import { getColumnKey } from '../utils/valueUtil';
import { ColumnType, CellType } from '../interface';

export interface BodyRowProps<RecordType> {
  record: RecordType;
  index: number;
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
    return true;
  }

  return prevRowColumns.some(
    (prevColumn, colIndex) => !shallowEqual(prevColumn, rowColumns[colIndex]),
  );
}

function useComputeRowProps<RecordType>({
  record,
  index,
  context: { flattenColumns },
}: DefaultPureCompareProps<RecordType, BodyRowProps<RecordType>>): ComputedProps<RecordType> {
  const rowColumns = React.useMemo(() => getRequiredColumnProps<RecordType>(flattenColumns), [
    flattenColumns,
  ]);

  return {
    record,
    index,
    rowColumns,
  };
}

function BodyRow<RecordType>(props: BodyRowProps<RecordType>) {
  return (
    <PureContextConsumer<RecordType, BodyRowProps<RecordType>, ComputedProps<RecordType>>
      {...props}
      useComputeProps={useComputeRowProps}
      shouldUpdate={shouldUpdate}
    >
      {({ rowColumns, record, index }) => (
        <tr>
          {rowColumns.map((column, colIndex) => {
            const { render, dataIndex, fixed } = column;

            return (
              <Cell
                key={getColumnKey(column, colIndex)}
                record={record}
                index={index}
                dataIndex={dataIndex}
                render={render}
                fixLeft={fixed === 'left'}
              />
            );
          })}
        </tr>
      )}
    </PureContextConsumer>
  );
}

BodyRow.displayName = 'BodyRow';

export default BodyRow;
