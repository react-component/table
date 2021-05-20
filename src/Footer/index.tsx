import * as React from 'react';
import TableContext from '../context/TableContext';
import Summary from './Summary';
import type { ColumnType } from '../interface';
import { SummaryScrollIndexContext } from './Row';

export interface FooterProps<RecordType> {
  children: React.ReactNode;
  flattenColumns?: readonly (ColumnType<RecordType> & { scrollbar?: boolean })[];
}

function Footer<RecordType>({ children, flattenColumns = [] }: FooterProps<RecordType>) {
  const { prefixCls } = React.useContext(TableContext);
  const lastColumnIndex = flattenColumns.length - 1;
  const scrollColumn = flattenColumns[lastColumnIndex];

  return (
    <SummaryScrollIndexContext.Provider value={scrollColumn.scrollbar ? lastColumnIndex : null}>
      <tfoot className={`${prefixCls}-summary`}>{children}</tfoot>
    </SummaryScrollIndexContext.Provider>
  );
}

export default Footer;

export const FooterComponents = Summary;
