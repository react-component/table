import * as React from 'react';
import Cell from '../Cell';
import {
  CellType,
  StickyOffsets,
  ColumnType,
  CustomizeComponent,
  GetComponentProps,
} from '../interface';
import TableContext from '../context/TableContext';
import { getCellFixedInfo } from '../utils/fixUtil';
import { getColumnsKey } from '../utils/valueUtil';

export interface RowProps<RecordType> {
  cells: CellType<RecordType>[];
  stickyOffsets: StickyOffsets;
  flattenColumns: ColumnType<RecordType>[];
  rowComponent: CustomizeComponent;
  cellComponent: CustomizeComponent;
  onHeaderRow: GetComponentProps<ColumnType<RecordType>[]>;
  index: number;
}

function HeaderRow<RecordType>({
  cells,
  stickyOffsets,
  flattenColumns,
  rowComponent: RowComponent,
  cellComponent: CellComponent,
  onHeaderRow,
  index,
}: RowProps<RecordType>) {
  const { prefixCls } = React.useContext(TableContext);

  let rowProps: React.HTMLAttributes<HTMLElement>;
  if (onHeaderRow) {
    rowProps = onHeaderRow(cells.map(cell => cell.column), index);
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
        );

        let additionalProps: React.HTMLAttributes<HTMLElement>;
        if (column && column.onHeaderCell) {
          additionalProps = cell.column.onHeaderCell(column);
        }

        return (
          <Cell
            {...cell}
            ellipsis={column.ellipsis}
            align={column.align}
            component={CellComponent}
            prefixCls={prefixCls}
            key={columnsKey[cellIndex]}
            {...fixedInfo}
            additionalProps={additionalProps}
          />
        );
      })}
    </RowComponent>
  );
}

HeaderRow.displayName = 'HeaderRow';

export default HeaderRow;
