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
  noData: boolean;
  colWidths: number[];
  columCount: number;
  direction: 'ltr' | 'rtl';
  fixHeader: boolean;
}

function FixedHeader<RecordType>({
  noData,
  columns,
  flattenColumns,
  colWidths,
  columCount,
  stickyOffsets,
  direction,
  fixHeader,
  ...props
}: FixedHeaderProps<RecordType>) {
  const { prefixCls, scrollbarSize, isSticky } = React.useContext(TableContext);

  const combinationScrollBarSize = isSticky && !fixHeader ? 0 : scrollbarSize;

  // Add scrollbar column
  const lastColumn = flattenColumns[flattenColumns.length - 1];
  const ScrollBarColumn: ColumnType<RecordType> = {
    fixed: lastColumn ? lastColumn.fixed : null,
    onHeaderCell: () => ({
      className: `${prefixCls}-cell-scrollbar`,
    }),
  };

  const columnsWithScrollbar = useMemo<ColumnsType<RecordType>>(
    () => (combinationScrollBarSize ? [...columns, ScrollBarColumn] : columns),
    [combinationScrollBarSize, columns],
  );

  const flattenColumnsWithScrollbar = useMemo<ColumnType<RecordType>[]>(
    () => (combinationScrollBarSize ? [...flattenColumns, ScrollBarColumn] : flattenColumns),
    [combinationScrollBarSize, flattenColumns],
  );

  // Calculate the sticky offsets
  const headerStickyOffsets = useMemo(() => {
    const { right, left } = stickyOffsets;
    return {
      ...stickyOffsets,
      left:
        direction === 'rtl' ? [...left.map(width => width + combinationScrollBarSize), 0] : left,
      right:
        direction === 'rtl' ? right : [...right.map(width => width + combinationScrollBarSize), 0],
      isSticky,
    };
  }, [combinationScrollBarSize, stickyOffsets, isSticky]);

  const mergedColumnWidth = useColumnWidth(colWidths, columCount);

  return (
    <table style={{ tableLayout: 'fixed', visibility: noData || mergedColumnWidth ? null : 'hidden' }}>
      <ColGroup
        colWidths={mergedColumnWidth ? [...mergedColumnWidth, combinationScrollBarSize] : []}
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
