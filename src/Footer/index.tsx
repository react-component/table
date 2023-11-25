import { useContext } from '@rc-component/context';
import * as React from 'react';
import TableContext, { responseImmutable } from '../context/TableContext';
import devRenderTimes from '../hooks/useRenderTimes';
import type { ColumnsType, ColumnType, StickyOffsets } from '../interface';
import Summary from './Summary';
import SummaryContext from './SummaryContext';

type FlattenColumns<RecordType> = readonly (ColumnType<RecordType> & { scrollbar?: boolean })[];

export interface FooterProps<RecordType> {
  children: React.ReactNode;
  stickyOffsets: StickyOffsets;
  flattenColumns: FlattenColumns<RecordType>;
  columns: ColumnsType<RecordType>;
}

function Footer<RecordType>(props: FooterProps<RecordType>) {
  if (process.env.NODE_ENV !== 'production') {
    devRenderTimes(props);
  }

  const { children, stickyOffsets, flattenColumns, columns } = props;

  const prefixCls = useContext(TableContext, 'prefixCls');

  const lastColumnIndex = flattenColumns.length - 1;
  const scrollColumn = flattenColumns[lastColumnIndex];

  const summaryContext = React.useMemo(
    () => ({
      stickyOffsets,
      flattenColumns,
      scrollColumnIndex: scrollColumn?.scrollbar ? lastColumnIndex : null,
      columns,
    }),
    [scrollColumn, flattenColumns, lastColumnIndex, stickyOffsets, columns],
  );

  return (
    <SummaryContext.Provider value={summaryContext}>
      <tfoot className={`${prefixCls}-summary`}>{children}</tfoot>
    </SummaryContext.Provider>
  );
}

export default responseImmutable(Footer);

export const FooterComponents = Summary;
