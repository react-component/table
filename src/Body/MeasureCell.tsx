import * as React from 'react';
import ResizeObserver from '@rc-component/resize-observer';
import useLayoutEffect from '@rc-component/util/lib/hooks/useLayoutEffect';

export interface MeasureCellProps {
  columnKey: React.Key;
  onColumnResize: (key: React.Key, width: number) => void;
}

export default function MeasureCell({ columnKey, onColumnResize }: MeasureCellProps) {
  const cellRef = React.useRef<HTMLTableCellElement>();

  useLayoutEffect(() => {
    if (cellRef.current) {
      onColumnResize(columnKey, cellRef.current.offsetWidth);
    }
  }, []);

  return (
    <ResizeObserver data={columnKey}>
      <td ref={cellRef} style={{ padding: 0, border: 0, height: 0 }}>
        <div style={{ height: 0, overflow: 'hidden' }}>&nbsp;</div>
      </td>
    </ResizeObserver>
  );
}
