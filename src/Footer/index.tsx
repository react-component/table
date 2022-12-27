import * as React from 'react';
import TableContext from '../context/TableContext';
import { useContext } from '@rc-component/context';
import type { ColumnType, StickyOffsets } from '../interface';
import Summary from './Summary';
import SummaryContext from './SummaryContext';

type FlattenColumns<RecordType> = readonly (ColumnType<RecordType> & { scrollbar?: boolean })[];

export interface FooterProps<RecordType> {
  children: React.ReactNode;
  stickyOffsets: StickyOffsets;
  flattenColumns: FlattenColumns<RecordType>;
}

function Footer<RecordType>({ children, stickyOffsets, flattenColumns }: FooterProps<RecordType>) {
  const prefixCls = useContext(TableContext, 'prefixCls');

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
