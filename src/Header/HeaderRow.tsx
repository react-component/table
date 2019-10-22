import React from 'react';
import Cell from '../Cell';
import { CellType } from '../interface';

export interface RowProps<RecordType> {
  cells: CellType<RecordType>[];
  index: number;
}

function HeaderRow<RecordType>({ cells, index }: RowProps<RecordType>) {
  return (
    <tr>
      {cells.map((cell, cellIndex) => (
        <Cell {...cell} key={cellIndex} />
      ))}
    </tr>
  );
}

HeaderRow.displayName = 'HeaderRow';

export default HeaderRow;
