import * as React from 'react';
import Cell from '../Cell';
import { CellType, StickyOffsets, ColumnType } from '../interface';
import TableContext from '../context/TableContext';
import { getCellFixedInfo } from '../utils/fixUtil';

export interface RowProps<RecordType> {
  cells: CellType<RecordType>[];
  stickyOffsets: StickyOffsets;
  flattenColumns: ColumnType<RecordType>[];
}

function HeaderRow<RecordType>({ cells, stickyOffsets, flattenColumns }: RowProps<RecordType>) {
  const { prefixCls } = React.useContext(TableContext);

  return (
    <tr>
      {cells.map((cell: CellType<RecordType>, cellIndex) => {
        const { column } = cell;
        const fixedInfo = getCellFixedInfo(
          cell.colStart,
          cell.colEnd,
          flattenColumns,
          stickyOffsets,
        );

        let additionalProps: React.HTMLAttributes<HTMLElement>;
        if (column && column.onHeaderCell) {
          additionalProps = cell.column.onHeaderCell(column);
        }

        return (
          <Cell
            {...cell}
            component="th"
            prefixCls={prefixCls}
            key={cellIndex}
            {...fixedInfo}
            additionalProps={additionalProps}
          />
        );
      })}
    </tr>
  );
}

HeaderRow.displayName = 'HeaderRow';

export default HeaderRow;
