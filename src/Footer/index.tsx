import * as React from 'react';
import TableContext from '../context/TableContext';
import Summary from './Summary';
import SummaryContext from './SummaryContext';
import type { ColumnType, StickyOffsets } from '../interface';

type FlattenColumns<RecordType> = readonly (ColumnType<RecordType> & { scrollbar?: boolean })[];

export interface FooterProps<RecordType> {
  children: React.ReactNode;
  stickyOffsets: StickyOffsets;
  flattenColumns: FlattenColumns<RecordType>;
}

function Footer<RecordType>({ children, stickyOffsets, flattenColumns }: FooterProps<RecordType>) {
  const tableContext = React.useContext(TableContext);
  const { prefixCls } = tableContext;

  const lastColumnIndex = flattenColumns.length - 1;
  const scrollColumn = flattenColumns[lastColumnIndex];

  const summaryContext = React.useMemo(
    () => ({
      stickyOffsets,
      flattenColumns,
      scrollColumnIndex: scrollColumn?.scrollbar ? lastColumnIndex : null,
    }),
    [scrollColumn, flattenColumns, lastColumnIndex, stickyOffsets],
  );

  return (
    <SummaryContext.Provider value={summaryContext}>
      <tfoot className={`${prefixCls}-summary`}>{children}</tfoot>
    </SummaryContext.Provider>
  );
}

export default Footer;

export const FooterComponents = Summary;
