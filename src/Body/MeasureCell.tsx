import * as React from 'react';
import ResizeObserver from 'rc-resize-observer';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import type { ColumnType } from '../interface';

export interface MeasureCellProps {
  columnKey: React.Key;
  onColumnResize: (key: React.Key, width: number) => void;
  prefixCls: string;
  title?: React.ReactNode;
}

export default function MeasureCell({
  columnKey,
  onColumnResize,
  prefixCls,
  title,
}: MeasureCellProps) {
  const cellRef = React.useRef<HTMLTableCellElement>();

  useLayoutEffect(() => {
    if (cellRef.current) {
      onColumnResize(columnKey, cellRef.current.offsetWidth);
    }
  }, []);

  return (
    <ResizeObserver data={columnKey}>
      <th ref={cellRef} className={`${prefixCls}-measure-cell`}>
        <div className={`${prefixCls}-measure-cell-content`}>{title || '\xa0'}</div>
      </th>
    </ResizeObserver>
  );
}
