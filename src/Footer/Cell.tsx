import * as React from 'react';
import Cell from '../Cell';
import TableContext from '../context/TableContext';

export interface SummaryCellProps {
  className?: string;
  children?: React.ReactNode;
  index: number;
  colSpan?: number;
  rowSpan?: number;
}

export default function SummaryCell({
  className,
  index,
  children,
  colSpan,
  rowSpan,
}: SummaryCellProps) {
  const { prefixCls, fixedInfoList } = React.useContext(TableContext);

  const fixedInfo = fixedInfoList[index];

  return (
    <Cell
      className={className}
      index={index}
      component="td"
      prefixCls={prefixCls}
      record={null}
      dataIndex={null}
      render={() => ({
        children,
        props: {
          colSpan,
          rowSpan,
        },
      })}
      {...fixedInfo}
    />
  );
}
