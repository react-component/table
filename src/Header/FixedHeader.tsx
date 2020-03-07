import * as React from 'react';
import Header, { HeaderProps } from './Header';
import ColGroup from '../ColGroup';
import { ColumnsType, ColumnType } from '../interface';
import TableContext from '../context/TableContext';

export interface FixedHeaderProps<RecordType> extends HeaderProps<RecordType> {
  colWidths: number[];
  columCount: number;
  direction: 'ltr' | 'rtl';
}

function FixedHeader<RecordType>({
  columns,
  flattenColumns,
  colWidths,
  columCount,
  stickyOffsets,
  direction,
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
    () => (scrollbarSize ? [...columns, ScrollBarColumn] : columns),
    [scrollbarSize, columns],
  );

  const flattenColumnsWithScrollbar = React.useMemo<ColumnType<RecordType>[]>(
    () => (scrollbarSize ? [...flattenColumns, ScrollBarColumn] : flattenColumns),
    [scrollbarSize, flattenColumns],
  );

  // Calculate the sticky offsets
  const headerStickyOffsets = React.useMemo(() => {
    const { right, left } = stickyOffsets;
    return {
      ...stickyOffsets,
      left: direction === 'rtl' ? [...left.map(width => width + scrollbarSize), 0] : left,
      right: direction === 'rtl' ? right : [...right.map(width => width + scrollbarSize), 0],
    };
  }, [scrollbarSize, stickyOffsets]);

  const cloneWidths: number[] = [];
  for (let i = 0; i < columCount; i += 1) {
    cloneWidths[i] = colWidths[i];
  }
  const columnWidthsReady = !colWidths.every(width => !width);

  return (
    <table style={{ tableLayout: 'fixed', visibility: columnWidthsReady ? null : 'hidden' }}>
      <ColGroup colWidths={[...colWidths, scrollbarSize]} columCount={columCount + 1} />
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
