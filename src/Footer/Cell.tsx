import * as React from 'react';
import Cell from '../Cell';
import TableContext from '../context/TableContext';
import { useContext } from '@rc-component/context';
import type { AlignType } from '../interface';
import { getCellFixedInfo } from '../utils/fixUtil';
import SummaryContext from './SummaryContext';

export interface SummaryCellProps {
  className?: string;
  index: number;
  colSpan?: number;
  rowSpan?: number;
  align?: AlignType;
}

const SummaryCell: React.FC<React.PropsWithChildren<SummaryCellProps>> = props => {
  const { className, index, children, colSpan = 1, rowSpan, align } = props;
  const { prefixCls } = useContext(TableContext, ['prefixCls']);
  const { scrollColumnIndex, stickyOffsets, flattenColumns } = React.useContext(SummaryContext);
  const lastIndex = index + colSpan - 1;
  const mergedColSpan = lastIndex + 1 === scrollColumnIndex ? colSpan + 1 : colSpan;

  const fixedInfo = React.useMemo(
    () => getCellFixedInfo(index, index + mergedColSpan - 1, flattenColumns, stickyOffsets),
    [index, mergedColSpan, flattenColumns, stickyOffsets],
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
};

export default SummaryCell;
