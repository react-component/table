import * as React from 'react';
import getScrollBarSize from 'rc-util/lib/getScrollBarSize';
import Header, { HeaderProps } from './Header';
import ColGroup from '../ColGroup';
import { ColumnsType, ColumnType } from '../interface';

const scrollbarSize = getScrollBarSize();

export interface FixedHeaderProps<RecordType> extends HeaderProps<RecordType> {
  colWidths: number[];
  columCount: number;
}

const ScrollBarColumn: ColumnType<any> = {
  fixed: 'right',
  render: () => null,
};

function FixedHeader<RecordType>({
  columns,
  flattenColumns,
  colWidths,
  columCount,
  stickyOffsets,
  ...props
}: FixedHeaderProps<RecordType>) {
  // Add scrollbar column
  const columnsWithScrollbar = React.useMemo<ColumnsType<RecordType>>(
    () => [...columns, ScrollBarColumn],
    [columns],
  );

  const flattenColumnsWithScrollbar = React.useMemo<ColumnType<RecordType>[]>(
    () => [...flattenColumns, ScrollBarColumn],
    [flattenColumns],
  );

  // Calculate the sticky offsets
  const headerStickyOffsets = React.useMemo(() => {
    const { right } = stickyOffsets;

    return {
      ...stickyOffsets,
      right: [...right.map(width => width + scrollbarSize), 0],
    };
  }, [stickyOffsets]);

  return (
    <table style={{ tableLayout: 'fixed' }}>
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
