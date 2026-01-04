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
import type { TableProps } from '..';

export interface RowProps<RecordType> {
  cells: readonly CellType<RecordType>[];
  stickyOffsets: StickyOffsets;
  flattenColumns: readonly ColumnType<RecordType>[];
  rowComponent: CustomizeComponent;
  cellComponent: CustomizeComponent;
  onHeaderRow: GetComponentProps<readonly ColumnType<RecordType>[]>;
  index: number;
  classNames: TableProps['classNames']['header'];
  styles: TableProps['styles']['header'];
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
    classNames,
    styles,
  } = props;
  const { prefixCls } = useContext(TableContext, ['prefixCls']);
  let rowProps: React.HTMLAttributes<HTMLElement>;
  if (onHeaderRow) {
    rowProps = onHeaderRow(
      cells.map(cell => cell.column),
      index,
    );
  }

  const columnsKey = getColumnsKey(cells.map(cell => cell.column));

  return (
    <RowComponent {...rowProps} className={classNames.row} style={styles.row}>
      {cells.map((cell: CellType<RecordType>, cellIndex) => {
        const { column, colStart, colEnd, colSpan } = cell;
        const fixedInfo = getCellFixedInfo(colStart, colEnd, flattenColumns, stickyOffsets);

        const additionalProps: React.HTMLAttributes<HTMLElement> = column?.onHeaderCell?.(column) || {};

        // Whether this cell is in the previous cell of the scrollbar
        const isScrollBarPreviousCell =
          cells[cells.length - 1]?.column.scrollbar && cellIndex === cells.length - 2;

        return (
          <HeaderCell
            {...cell}
            scope={column.title ? (colSpan > 1 ? 'colgroup' : 'col') : null}
            ellipsis={column.ellipsis}
            align={column.align}
            component={CellComponent}
            prefixCls={prefixCls}
            key={columnsKey[cellIndex]}
            {...fixedInfo}
            additionalProps={additionalProps}
            rowType="header"
            columnKey={columnsKey[cellIndex]}
            isScrollBarPreviousCell={isScrollBarPreviousCell}
            resizable={column.scrollbar ? false : (column as ColumnType<RecordType>).resizable}
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
