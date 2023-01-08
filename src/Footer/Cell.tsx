import * as React from 'react';
import Cell from '../Cell';
import TableContext from '../context/TableContext';
import { useContext } from '@rc-component/context';
import type { AlignType } from '../interface';
import { getCellFixedInfo } from '../utils/fixUtil';
import SummaryContext from './SummaryContext';

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
  colSpan = 1,
  rowSpan,
  align,
}: SummaryCellProps) {
  const { prefixCls, direction } = useContext(TableContext, ['prefixCls', 'direction']);
  const { scrollColumnIndex, stickyOffsets, flattenColumns, columns } = React.useContext(SummaryContext);
  const lastIndex = index + colSpan - 1;
  const mergedColSpan = lastIndex + 1 === scrollColumnIndex ? colSpan + 1 : colSpan;

  const fixedInfo = getCellFixedInfo(
    index,
    index + mergedColSpan - 1,
    flattenColumns,
    stickyOffsets,
    direction,
    columns?.[index]
  );

  return (
    <Cell
      className={className}
      index={index}
      component="td"
      prefixCls={prefixCls}
      record={null}
      dataIndex={null}
      align={align}
      colSpan={mergedColSpan}
      rowSpan={rowSpan}
      render={() => children}
      {...fixedInfo}
    />
  );
}
