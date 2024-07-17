import * as React from 'react';
import TableContext from '../context/TableContext';
import { useContext } from '@rc-component/context';
import type {
  CellType,
  ColumnType,
  CustomizeComponent,
  GetComponentProps,
  StickyOffsets,
} from '../interface';
import { getCellFixedInfo } from '../utils/fixUtil';
import { getColumnsKey } from '../utils/valueUtil';
import HeaderCell from './HeaderCell';

export interface RowProps<RecordType> {
  cells: CellType<RecordType>[];
  stickyOffsets: StickyOffsets;
  flattenColumns: readonly ColumnType<RecordType>[];
  rowComponent: CustomizeComponent;
  cellComponent: CustomizeComponent;
  onHeaderRow: GetComponentProps<readonly ColumnType<RecordType>[]>;
  index: number;
}

const HeaderRow = <RecordType extends any>(props: RowProps<RecordType>) => {
  const {
    cells,
    stickyOffsets,
    flattenColumns,
    rowComponent: RowComponent,
    cellComponent: CellComponent,
    onHeaderRow,
    index,
  } = props;
  const { prefixCls, direction, supportSticky } = useContext(TableContext, [
    'prefixCls',
    'direction',
    'supportSticky',
  ]);
  let rowProps: React.HTMLAttributes<HTMLElement>;
  if (onHeaderRow) {
    rowProps = onHeaderRow(
      cells.map(cell => cell.column),
      index,
    );
  }

  const columnsKey = getColumnsKey(cells.map(cell => cell.column));

  return (
    <RowComponent {...rowProps}>
      {cells.map((cell: CellType<RecordType>, cellIndex) => {
        const { column } = cell;
        const fixedInfo = getCellFixedInfo(
          cell.colStart,
          cell.colEnd,
          flattenColumns,
          stickyOffsets,
          direction,
        );

        let additionalProps: React.HTMLAttributes<HTMLElement>;
        if (column && column.onHeaderCell) {
          additionalProps = cell.column.onHeaderCell(column);
        }
        const isFixLeft = typeof fixedInfo.fixLeft === 'number' && supportSticky;
        const isFixRight = typeof fixedInfo.fixRight === 'number' && supportSticky;
        // If scrollbar cell is not fixed right, and the previous cell of the scrollbar is resizable, then the scrollbar is resizable
        const isScrollBarCellAndResizable =
          column.scrollbar &&
          // if scrollbar fixed right, the resize handle of previous cell is on the left, so there is no need to put the handle inside the scrollbar
          (direction === 'rtl' ? !isFixLeft : !isFixRight) &&
          (cells[cells.length - 2].column as ColumnType<RecordType>).resizable;

        // Whether this cell is in the previous cell of the scrollbar
        const isScrollBarPreviousCell =
          cells[cells.length - 1].column.scrollbar && cellIndex === cells.length - 2;

        let resizable: boolean;
        // ltr: If it is the column before the scrollbar and fixed right, resizable is required.
        // rtl: If it is the column before the scrollbar and fixed left, resizable is required.
        if (isScrollBarPreviousCell) {
          if (direction === 'rtl' ? isFixLeft : isFixRight) {
            resizable = (column as ColumnType<RecordType>).resizable;
          } else {
            resizable = false;
          }
        } else {
          resizable = isScrollBarCellAndResizable || (column as ColumnType<RecordType>).resizable;
        }

        return (
          <HeaderCell
            {...cell}
            scope={column.title ? (cell.colSpan > 1 ? 'colgroup' : 'col') : null}
            ellipsis={column.ellipsis}
            align={column.align}
            component={CellComponent}
            prefixCls={prefixCls}
            key={columnsKey[cellIndex]}
            {...fixedInfo}
            additionalProps={additionalProps}
            rowType="header"
            columnKey={
              isScrollBarCellAndResizable
                ? columnsKey[columnsKey.length - 2]
                : columnsKey[cellIndex]
            }
            isFixLeft={isFixLeft}
            isFixRight={isFixRight}
            resizable={resizable}
            minWidth={(column as ColumnType<RecordType>).minWidth}
          />
        );
      })}
    </RowComponent>
  );
};

if (process.env.NODE_ENV !== 'production') {
  HeaderRow.displayName = 'HeaderRow';
}

export default HeaderRow;
