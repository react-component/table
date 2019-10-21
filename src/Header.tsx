import React from 'react';
import classNames from 'classnames';
import { PureContextConsumer, DefaultPureCompareProps } from './context';
import { ColumnsType, CellType } from './interface';
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

interface ComputeProps<RecordType> {
  prefixCls: string;
  rows: CellType<RecordType>[][];
  fixHeader: boolean;
}

function useComputeProps<RecordType>({
  fixHeader,
  context: { columns, prefixCls },
}: DefaultPureCompareProps<RecordType, HeaderProps<RecordType>>): ComputeProps<RecordType> {
  const rows: CellType<RecordType>[][] = React.useMemo(() => parseHeaderRows(columns), [columns]);

  return { rows, prefixCls, fixHeader };
}

// TODO: Optimize header render if performance leak
function shouldUpdate<RecordType>(
  prevProps: ComputeProps<RecordType>,
  props: ComputeProps<RecordType>,
): boolean {
  const { rows: prevRows } = prevProps;
  const { rows } = props;

  return prevRows !== rows;
}

export interface HeaderProps<RecordType> {
  fixHeader: boolean;
}

function Header<RecordType>(props: HeaderProps<RecordType>): React.ReactElement {
  return (
    <PureContextConsumer<RecordType, HeaderProps<RecordType>, ComputeProps<RecordType>>
      {...props}
      shouldUpdate={shouldUpdate}
      useComputeProps={useComputeProps}
    >
      {({ rows, prefixCls, fixHeader }) => (
        <thead className={classNames(`${prefixCls}-header`)}>
          {rows.map((row, rowIndex) => (
            <HeaderRow fixHeader={fixHeader} key={rowIndex} cells={row} />
          ))}
        </thead>
      )}
    </PureContextConsumer>
  );
}

export default Header;
