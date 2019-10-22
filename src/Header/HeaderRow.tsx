import React from 'react';
import Cell from '../Cell';
import { CellType, StickyOffsets, ColumnType } from '../interface';
import TableContext from '../context/TableContext';

export interface RowProps<RecordType> {
  cells: CellType<RecordType>[];
  stickyOffsets: StickyOffsets;
}

function HeaderRow<RecordType>({ cells, stickyOffsets }: RowProps<RecordType>) {
  const { flattenColumns } = React.useContext(TableContext);

  return (
    <tr>
      {cells.map((cell, cellIndex) => {
        const startColumn: ColumnType<RecordType> = flattenColumns[cell.colStart] || {};
        const endColumn: ColumnType<RecordType> = flattenColumns[cell.colEnd] || {};

        let fixLeft: number;
        if (startColumn.fixed === 'left') {
          fixLeft = stickyOffsets.left[cell.colStart];
        }

        let fixRight: number;
        if (endColumn.fixed === 'right') {
          fixRight = stickyOffsets.right[cell.colEnd];
        }

        return <Cell {...cell} key={cellIndex} fixLeft={fixLeft} fixRight={fixRight} />;
      })}
    </tr>
  );
}

HeaderRow.displayName = 'HeaderRow';

export default HeaderRow;
