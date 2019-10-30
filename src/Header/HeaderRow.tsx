import * as React from 'react';
import ResizeObserver from 'rc-resize-observer';
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
import ResizeContext from '../context/ResizeContext';

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
  const { onColumnResize } = React.useContext(ResizeContext);

  let rowProps: React.HTMLAttributes<HTMLElement>;
  if (onHeaderRow) {
    rowProps = onHeaderRow(cells.map(cell => cell.column), index);
  }

  return (
    <RowComponent {...rowProps}>
      {cells.map((cell: CellType<RecordType>, cellIndex) => {
        const { column, measure } = cell;
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

        let cellNode = (
          <Cell
            {...cell}
            ellipsis={column.ellipsis}
            align={column.align}
            component={CellComponent}
            prefixCls={prefixCls}
            key={cellIndex}
            {...fixedInfo}
            additionalProps={additionalProps}
          />
        );

        if (measure) {
          cellNode = (
            <ResizeObserver
              key={cellIndex}
              onResize={({ width }) => {
                onColumnResize(cell.colStart, width);
              }}
            >
              {cellNode}
            </ResizeObserver>
          );
        }

        return cellNode;
      })}
    </RowComponent>
  );
}

HeaderRow.displayName = 'HeaderRow';

export default HeaderRow;
