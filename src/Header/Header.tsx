import React from 'react';
import DataContext from '../context/TableContext';
import { ColumnsType, CellType } from '../interface';
import HeaderRow from './HeaderRow';

// TODO: warning user if mix using `children` & `xxxSpan`
function parseHeaderRows<RecordType>(
  rootColumns: ColumnsType<RecordType>,
): CellType<RecordType>[][] {
  const rows: CellType<RecordType>[][] = [];

  function fillRowCells(columns: ColumnsType<RecordType>, rowIndex: number = 0): number[] {
    // Init rows
    rows[rowIndex] = rows[rowIndex] || [];

    const colSpans: number[] = columns.map(column => {
      const cell: CellType<RecordType> = {
        key: column.key,
        className: column.className || '',
        children: column.title,
        column,
      };

      let colSpan = 1;

      if ('children' in column) {
        colSpan = fillRowCells(column.children, rowIndex + 1).reduce(
          (total, count) => total + count,
          0,
        );
        cell.hasSubColumns = true;
      }

      if ('colSpan' in column) {
        ({ colSpan } = column);
      }

      if ('rowSpan' in column) {
        cell.rowSpan = column.rowSpan;
      }

      cell.colSpan = colSpan;
      rows[rowIndex].push(cell);

      return colSpan;
    });

    return colSpans;
  }

  // Generate `rows` cell data
  fillRowCells(rootColumns);

  // Handle `rowSpan`
  const rowCount = rows.length;
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    rows[rowIndex].forEach(cell => {
      if (!('rowSpan' in cell) && !cell.hasSubColumns) {
        // eslint-disable-next-line no-param-reassign
        cell.rowSpan = rowCount - rowIndex;
      }
    });
  }

  return rows;
}

export interface HeaderProps<RecordType> {}

function Header<RecordType>(props: HeaderProps<RecordType>): React.ReactElement {
  const { columns } = React.useContext(DataContext);
  const rows: CellType<RecordType>[][] = React.useMemo(() => parseHeaderRows(columns), [columns]);

  return (
    <thead>
      {rows.map((row, rowIndex) => {
        const rowNode = <HeaderRow key={rowIndex} cells={row} index={rowIndex} />;

        return rowNode;
      })}
    </thead>
  );
}

export default Header;
