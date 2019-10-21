import React from 'react';
import classNames from 'classnames';
import DataContext from '../context/DataContext';
import ResizeContext from '../context/ResizeContext';
import { ColumnsType, CellType } from '../interface';
import HeaderRow from './HeaderRow';
import { useFrameState } from '../hooks/useFrameState';

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

export interface HeaderProps<RecordType> {
  fixHeader: boolean;
}

function Header<RecordType>(props: HeaderProps<RecordType>): React.ReactElement {
  const { fixHeader } = props;
  const { columns, prefixCls } = React.useContext(DataContext);
  const rows: CellType<RecordType>[][] = React.useMemo(() => parseHeaderRows(columns), [columns]);

  // =============== Fix ===============
  const [rowHeights, updateRowHeights] = useFrameState<number[]>([]);
  function onRowResize(rowIndex: number, height: number) {
    updateRowHeights((heights: number[]) => {
      const newHeights = [...heights];
      newHeights[rowIndex] = height;
      return newHeights;
    });
  }

  let fixedTop = 0;

  return (
    <ResizeContext.Provider
      value={{
        onRowResize,
      }}
    >
      <thead className={classNames(`${prefixCls}-header`)}>
        {rows.map((row, rowIndex) => {
          const rowNode = (
            <HeaderRow
              key={rowIndex}
              cells={row}
              index={rowIndex}
              fixedTop={fixHeader ? fixedTop : false}
            />
          );

          fixedTop += rowHeights[rowIndex] || 0;

          return rowNode;
        })}
      </thead>
    </ResizeContext.Provider>
  );
}

export default Header;
