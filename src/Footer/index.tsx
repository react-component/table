import * as React from 'react';
import TableContext from '../context/TableContext';
import Summary from './Summary';
import type { ColumnType, StickyOffsets } from '../interface';
import { getCellFixedInfo } from '../utils/fixUtil';

type FlattenColumns<RecordType> = readonly (ColumnType<RecordType> & { scrollbar?: boolean })[];

export const SummaryContext =
  React.createContext<{
    stickyOffsets?: StickyOffsets;
    scrollColumnIndex?: number;
    flattenColumns?: FlattenColumns<any>;
  }>({});

export interface FooterProps<RecordType> {
  children: React.ReactNode;
  stickyOffsets?: StickyOffsets;
  flattenColumns?: FlattenColumns<RecordType>;
}

const EMPTY_LIST: FlattenColumns<any> = [];

function Footer<RecordType>({
  children,
  stickyOffsets,
  flattenColumns = EMPTY_LIST,
}: FooterProps<RecordType>) {
  const tableContext = React.useContext(TableContext);
  const { prefixCls, direction } = tableContext;

  const lastColumnIndex = flattenColumns.length - 1;
  const scrollColumn = flattenColumns[lastColumnIndex];

  const mergedTableContext = React.useMemo(
    () =>
      stickyOffsets
        ? {
            ...tableContext,
            fixedInfoList: flattenColumns.map((_, colIndex) =>
              getCellFixedInfo(colIndex, colIndex, flattenColumns, stickyOffsets, direction),
            ),
          }
        : tableContext,
    [tableContext, stickyOffsets, flattenColumns, direction],
  );

  const summaryContext = React.useMemo(
    () => ({
      stickyOffsets,
      flattenColumns,
      scrollColumnIndex: scrollColumn?.scrollbar ? lastColumnIndex : null,
    }),
    [scrollColumn, flattenColumns, lastColumnIndex, stickyOffsets],
  );

  return (
    <TableContext.Provider value={mergedTableContext}>
      <SummaryContext.Provider value={summaryContext}>
        <tfoot className={`${prefixCls}-summary`}>{children}</tfoot>
      </SummaryContext.Provider>
    </TableContext.Provider>
  );
}

export default Footer;

export const FooterComponents = Summary;
