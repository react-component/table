import * as React from 'react';
import classNames from 'classnames';
import TableContext from '../context/TableContext';
import { useColumnWidth } from '../hooks/useColumnWidth';

export interface FixedSummaryProps {
  noData: boolean;
  colWidths: readonly number[];
  columCount: number;
  children?: React.ReactNode;
}

export default function FixedSummary({
  noData,
  colWidths,
  columCount,
  children,
}: FixedSummaryProps) {
  const { prefixCls, scrollbarSize } = React.useContext(TableContext);

  const mergedColumnWidth = useColumnWidth(colWidths, columCount);

  return (
    <div
      style={{
        overflow: 'hidden',
      }}
      className={classNames(`${prefixCls}-summary`)}
    >
      <table
        style={{
          tableLayout: 'fixed',
          visibility: noData || mergedColumnWidth ? null : 'hidden',
        }}
      >
        {children}
      </table>
    </div>
  );
}
