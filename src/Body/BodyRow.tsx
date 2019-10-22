import React from 'react';
import shallowEqual from 'shallowequal';
import ResizeObserver from 'rc-resize-observer';
import Cell from '../Cell';
import { PureContextConsumer, DefaultPureCompareProps } from '../context/TableContext';
import { getColumnKey } from '../utils/valueUtil';
import { ColumnType } from '../interface';
import ResizeContext from '../context/ResizeContext';

export interface BodyRowProps<RecordType> {
  record: RecordType;
  index: number;
  fixColumn: boolean;
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
  fixColumn,
  context: { flattenColumns },
}: DefaultPureCompareProps<RecordType, BodyRowProps<RecordType>>): ComputedProps<RecordType> {
  const rowColumns = React.useMemo(() => getRequiredColumnProps<RecordType>(flattenColumns), [
    flattenColumns,
  ]);

  return {
    record,
    index,
    fixColumn,
    rowColumns,
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
      {({ rowColumns, record, index, fixColumn }) => (
        <tr>
          {rowColumns.map((column, colIndex) => {
            const { render, dataIndex, fixed } = column;

            const key = getColumnKey(column, colIndex);

            const cellNode = (
              <Cell
                key={key}
                record={record}
                index={index}
                dataIndex={dataIndex}
                render={render}
                fixLeft={fixed === 'left'}
              />
            );

            if (fixColumn && index === 0) {
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
