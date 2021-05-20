import * as React from 'react';
import TableContext from '../context/TableContext';
import Summary from './Summary';
import type { ColumnType, StickyOffsets } from '../interface';
import { SummaryScrollIndexContext } from './Row';
import { getCellFixedInfo } from '../utils/fixUtil';

type FlattenColumns<RecordType> = readonly (ColumnType<RecordType> & { scrollbar?: boolean })[];

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

  return (
    <TableContext.Provider value={mergedTableContext}>
      <SummaryScrollIndexContext.Provider value={scrollColumn.scrollbar ? lastColumnIndex : null}>
        <tfoot className={`${prefixCls}-summary`}>{children}</tfoot>
      </SummaryScrollIndexContext.Provider>
    </TableContext.Provider>
  );
}

export default Footer;

export const FooterComponents = Summary;
