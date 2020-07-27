import * as React from 'react';
import { useMemo } from 'react';
import Header, { HeaderProps } from './Header';
import ColGroup from '../ColGroup';
import { ColumnsType, ColumnType } from '../interface';
import TableContext from '../context/TableContext';

function useColumnWidth(colWidths: number[], columCount: number) {
  return useMemo(() => {
    const cloneColumns: number[] = [];
    for (let i = 0; i < columCount; i += 1) {
      const val = colWidths[i];
      if (val) {
        cloneColumns[i] = val;
      } else {
        return null;
      }
    }
    return cloneColumns;
  }, [colWidths.join('_'), columCount]);
}

export interface FixedHeaderProps<RecordType> extends HeaderProps<RecordType> {
  colWidths: number[];
  columCount: number;
  direction: 'ltr' | 'rtl';
  fixHeader: boolean;
}

function FixedHeader<RecordType>({
  columns,
  flattenColumns,
  colWidths,
  columCount,
  stickyOffsets,
  direction,
  fixHeader,
  ...props
}: FixedHeaderProps<RecordType>) {
  const { prefixCls, scrollbarSize } = React.useContext(TableContext);

  // Add scrollbar column
  const lastColumn = flattenColumns[flattenColumns.length - 1];
  const ScrollBarColumn: ColumnType<RecordType> = {
    fixed: lastColumn ? lastColumn.fixed : null,
    onHeaderCell: () => ({
      className: `${prefixCls}-cell-scrollbar`,
    }),
  };

  const columnsWithScrollbar = React.useMemo<ColumnsType<RecordType>>(
    () => (scrollbarSize && fixHeader ? [...columns, ScrollBarColumn] : columns),
    [scrollbarSize, columns],
  );

  const flattenColumnsWithScrollbar = useMemo<ColumnType<RecordType>[]>(
    () => (scrollbarSize ? [...flattenColumns, ScrollBarColumn] : flattenColumns),
    [scrollbarSize, flattenColumns],
  );

  // Calculate the sticky offsets
  const headerStickyOffsets = useMemo(() => {
    const { right, left } = stickyOffsets;
    return {
      ...stickyOffsets,
      left: direction === 'rtl' ? [...left.map(width => width + scrollbarSize), 0] : left,
      right: direction === 'rtl' ? right : [...right.map(width => width + scrollbarSize), 0],
    };
  }, [scrollbarSize, stickyOffsets]);

  const mergedColumnWidth = useColumnWidth(colWidths, columCount);

  return (
    <table style={{ tableLayout: 'fixed', visibility: mergedColumnWidth ? null : 'hidden' }}>
      <ColGroup
        colWidths={mergedColumnWidth ? [...mergedColumnWidth, scrollbarSize] : []}
        columCount={columCount + 1}
        columns={flattenColumnsWithScrollbar}
      />
      <Header
        {...props}
        stickyOffsets={headerStickyOffsets}
        columns={columnsWithScrollbar}
        flattenColumns={flattenColumnsWithScrollbar}
      />
    </table>
  );
}

export default FixedHeader;
