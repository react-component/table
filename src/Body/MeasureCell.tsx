import * as React from 'react';
import ResizeObserver from 'rc-resize-observer';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import type { ColumnType } from '../interface';

export interface MeasureCellProps {
  columnKey: React.Key;
  onColumnResize: (key: React.Key, width: number) => void;
  column?: ColumnType<any>;
}

export default function MeasureCell({ columnKey, onColumnResize, column }: MeasureCellProps) {
  const cellRef = React.useRef<HTMLTableCellElement>();

  useLayoutEffect(() => {
    if (cellRef.current) {
      onColumnResize(columnKey, cellRef.current.offsetWidth);
    }
  }, []);

  return (
    <ResizeObserver data={columnKey}>
      <td ref={cellRef} style={{ paddingBlock: 0, borderBlock: 0, height: 0 }}>
        <div style={{ height: 0, overflow: 'hidden', fontWeight: 'bold' }}>
          {column?.title || '\xa0'}
        </div>
      </td>
    </ResizeObserver>
  );
}
