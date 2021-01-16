import * as React from 'react';
import Cell from '../Cell';
import TableContext from '../context/TableContext';

export interface FooterRowProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function FooterRow({ children, ...props }: FooterRowProps) {
  const {
    prefixCls,
    scrollbarSize,
    isSummaryFixed,
    summaryFixedInfoList,
    columnsWithScrollbar,
  } = React.useContext(TableContext);

  const summaryListLength = summaryFixedInfoList.length;
  const summaryColumn = columnsWithScrollbar[summaryListLength - 1];

  let additionalProps: React.HTMLAttributes<HTMLElement>;

  if (isSummaryFixed && summaryColumn.onHeaderCell) {
    additionalProps = summaryColumn.onHeaderCell(summaryColumn);
  }

  return (
    <tr {...props}>
      {children}
      {isSummaryFixed && !!scrollbarSize && (
        <Cell
          component="td"
          prefixCls={prefixCls}
          additionalProps={additionalProps}
          {...summaryFixedInfoList[summaryListLength - 1]}
        />
      )}
    </tr>
  );
}
