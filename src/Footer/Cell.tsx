import * as React from 'react';
import Cell from '../Cell';
import TableContext from '../context/TableContext';
import { AlignType } from '../interface';

export interface SummaryCellProps {
  className?: string;
  children?: React.ReactNode;
  index: number;
  colSpan?: number;
  rowSpan?: number;
  align?: AlignType;
}

export default function SummaryCell({
  className,
  index,
  children,
  colSpan,
  rowSpan,
  align,
}: SummaryCellProps) {
  const {
    prefixCls,
    fixedInfoList,
    summaryFixedInfoList,
    columnsWithScrollbar,
    isSummaryFixed,
  } = React.useContext(TableContext);

  const fixedInfo = isSummaryFixed ? summaryFixedInfoList[index] : fixedInfoList[index];
  const summaryListLength = summaryFixedInfoList.length;
  const summaryColumn = columnsWithScrollbar[summaryListLength - 1];

  let additionalProps: React.HTMLAttributes<HTMLElement>;

  if (isSummaryFixed && summaryColumn.onHeaderCell) {
    additionalProps = summaryColumn.onHeaderCell(summaryColumn);
  }


  return (
    <>
      <Cell
        className={className}
        index={index}
        component="td"
        prefixCls={prefixCls}
        record={null}
        dataIndex={null}
        align={align}
        render={() => ({
          children,
          props: {
            colSpan,
            rowSpan,
          },
        })}
        {...fixedInfo}
      />
      {
        isSummaryFixed && index === summaryListLength - 2 &&
          <Cell
            component="td"
            prefixCls={prefixCls}
            additionalProps={additionalProps}
            {...summaryFixedInfoList[summaryListLength - 1]}
          />
      }
    </>
  );
}
