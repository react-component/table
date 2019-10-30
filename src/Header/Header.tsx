import * as React from 'react';
import { ColumnsType, CellType, StickyOffsets, ColumnType, GetComponentProps } from '../interface';
import HeaderRow from './HeaderRow';
import TableContext from '../context/TableContext';

function parseHeaderRows<RecordType>(
  rootColumns: ColumnsType<RecordType>,
  measureColumnWidth: boolean,
): CellType<RecordType>[][] {
  const rows: CellType<RecordType>[][] = [];

  // Record which cell should wrapped with resize observer used for fixed
  const measureCells: boolean[] = [];

  function fillRowCells(
    columns: ColumnsType<RecordType>,
    colIndex: number,
    rowIndex: number = 0,
  ): number[] {
    // Init rows
    rows[rowIndex] = rows[rowIndex] || [];

    let currentColIndex = colIndex;
    const colSpans: number[] = columns.map(column => {
      const cell: CellType<RecordType> = {
        key: column.key,
        className: column.className || '',
        children: column.title,
        column,
        colStart: currentColIndex,
      };

      let colSpan: number = 1;

      if ('children' in column) {
        colSpan = fillRowCells(column.children, currentColIndex, rowIndex + 1).reduce(
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
      cell.colEnd = cell.colStart + colSpan - 1;
      rows[rowIndex].push(cell);

      currentColIndex += colSpan;

      // Measure only happen on single node
      if (measureColumnWidth && colSpan === 1 && !measureCells[cell.colStart]) {
        cell.measure = true;
        measureCells[cell.colStart] = true;
      }

      return colSpan;
    });

    return colSpans;
  }

  // Generate `rows` cell data
  fillRowCells(rootColumns, 0);

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

export interface HeaderProps<RecordType> {
  columns: ColumnsType<RecordType>;
  flattenColumns: ColumnType<RecordType>[];
  stickyOffsets: StickyOffsets;
  measureColumnWidth?: boolean;
  onHeaderRow: GetComponentProps<ColumnType<RecordType>[]>;
}

function Header<RecordType>({
  stickyOffsets,
  columns,
  flattenColumns,
  measureColumnWidth,
  onHeaderRow,
}: HeaderProps<RecordType>): React.ReactElement {
  const { getComponent } = React.useContext(TableContext);
  const rows: CellType<RecordType>[][] = React.useMemo(
    () => parseHeaderRows(columns, measureColumnWidth),
    [columns],
  );

  const WrapperComponent = getComponent(['header', 'wrapper'], 'thead');
  const trComponent = getComponent(['header', 'row'], 'tr');
  const thComponent = getComponent(['header', 'cell'], 'th');

  return (
    <WrapperComponent>
      {rows.map((row, rowIndex) => {
        const rowNode = (
          <HeaderRow
            key={rowIndex}
            flattenColumns={flattenColumns}
            cells={row}
            stickyOffsets={stickyOffsets}
            rowComponent={trComponent}
            cellComponent={thComponent}
            onHeaderRow={onHeaderRow}
            index={rowIndex}
          />
        );

        return rowNode;
      })}
    </WrapperComponent>
  );
}

export default Header;
