import React from 'react';
import shallowEqual from 'shallowequal';
import Cell from './Cell';
import { PureContextConsumer, DefaultPureCompareProps } from './context';
import { getColumnKey } from './utils/valueUtil';
import { ColumnType, CellType } from './interface';

export interface RowProps<RecordType> {
  cells: CellType<RecordType>[];
  fixHeader: boolean;
}

function HeaderRow<RecordType>({ cells, fixHeader }: RowProps<RecordType>) {
  return (
    <tr>
      {cells.map((cell, cellIndex) => (
        <Cell {...cell} fixTop={fixHeader} key={cellIndex} />
      ))}
    </tr>
  );
}

HeaderRow.displayName = 'HeaderRow';

export default HeaderRow;
