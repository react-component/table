import React from 'react';
import shallowEqual from 'shallowequal';
import Cell from './Cell';
import TableContext, { TableContextProps } from './context';
import { getPathValue, getColumnKey } from './utils/valueUtil';
import { ColumnType } from './interface';
import useMemo from './hooks/useMemo';

export interface RowProps<RecordType> {
  record: RecordType;
  index: number;
}

interface RawColumnType<RecordType> {
  key: ColumnType<RecordType>['key'];
  dataIndex: ColumnType<RecordType>['dataIndex'];
  render: ColumnType<RecordType>['render'];
}

type CompareCondition<RecordType> = [RecordType, number, ColumnType<RecordType>[]];

/** Return a subset of `ColumnType` which used in Row */
function getRequiredColumnProps<RecordType>(
  columns: ColumnType<RecordType>[],
): RawColumnType<RecordType>[] {
  return (columns || []).map(({ key, dataIndex, render }) => ({ key, dataIndex, render }));
}

function skipUpdate<RecordType>(
  [prevRecord, prevIndex, prevColumns]: CompareCondition<RecordType>,
  [record, index, columns]: CompareCondition<RecordType>,
): boolean {
  if (prevRecord !== record || prevIndex !== index || prevColumns.length !== columns.length) {
    return false;
  }

  return prevColumns.every((prevColumn, colIndex) => shallowEqual(prevColumn, columns[colIndex]));
}

function Row<RecordType>({ record, index }: RowProps<RecordType>) {
  const { flattenColumns } = React.useContext<TableContextProps<RecordType>>(TableContext);
  const rowColumns = React.useMemo(() => getRequiredColumnProps<RecordType>(flattenColumns), [
    flattenColumns,
  ]);

  return useMemo<React.ReactElement>(
    () => (
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
    ),
    [record, index, rowColumns],
    skipUpdate,
  );
}

Row.displayName = 'Row';

export default Row;
