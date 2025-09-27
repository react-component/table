import * as React from 'react';
import { clsx } from 'clsx';
import { useContext } from '@rc-component/context';
import TableContext, { responseImmutable } from '../context/TableContext';
import devRenderTimes from '../hooks/useRenderTimes';
import type {
  CellType,
  ColumnGroupType,
  ColumnsType,
  ColumnType,
  GetComponentProps,
  StickyOffsets,
} from '../interface';
import HeaderRow from './HeaderRow';
import type { TableProps } from '..';

function parseHeaderRows<RecordType>(
  rootColumns: ColumnsType<RecordType>,
  classNames: TableProps['classNames']['header'],
  styles: TableProps['styles']['header'],
): CellType<RecordType>[][] {
  const rows: CellType<RecordType>[][] = [];

  function fillRowCells(
    columns: ColumnsType<RecordType>,
    colIndex: number,
    rowIndex: number = 0,
  ): number[] {
    // Init rows
    rows[rowIndex] = rows[rowIndex] || [];

    let currentColIndex = colIndex;
    const colSpans: number[] = columns.filter(Boolean).map(column => {
      const cell: CellType<RecordType> = {
        key: column.key,
        className: clsx(column.className, classNames.cell) || '',
        style: styles.cell,
        children: column.title,
        column,
        colStart: currentColIndex,
      };

      let colSpan: number = 1;

      const subColumns = (column as ColumnGroupType<RecordType>).children;
      if (subColumns && subColumns.length > 0) {
        colSpan = fillRowCells(subColumns, currentColIndex, rowIndex + 1).reduce(
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
  flattenColumns: readonly ColumnType<RecordType>[];
  stickyOffsets: StickyOffsets;
  onHeaderRow: GetComponentProps<readonly ColumnType<RecordType>[]>;
}

const Header = <RecordType extends any>(props: HeaderProps<RecordType>) => {
  if (process.env.NODE_ENV !== 'production') {
    devRenderTimes(props);
  }

  const { stickyOffsets, columns, flattenColumns, onHeaderRow } = props;

  const { prefixCls, getComponent, classNames, styles } = useContext(TableContext, [
    'prefixCls',
    'getComponent',
    'classNames',
    'styles',
  ]);
  const { header: headerCls = {} } = classNames || {};
  const { header: headerStyles = {} } = styles || {};
  const rows = React.useMemo<CellType<RecordType>[][]>(
    () => parseHeaderRows(columns, headerCls, headerStyles),
    [columns, headerCls, headerStyles],
  );

  const WrapperComponent = getComponent(['header', 'wrapper'], 'thead');
  const trComponent = getComponent(['header', 'row'], 'tr');
  const thComponent = getComponent(['header', 'cell'], 'th');

  return (
    <WrapperComponent
      className={clsx(`${prefixCls}-thead`, headerCls.wrapper)}
      style={headerStyles.wrapper}
    >
      {rows.map((row, rowIndex) => {
        const rowNode = (
          <HeaderRow
            classNames={headerCls}
            styles={headerStyles}
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
};

export default responseImmutable(Header);
