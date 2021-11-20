import type { IColumnResizeObserver } from '../hooks/useColumnResizeObserver';
import { useObserveElement } from '../hooks/useColumnResizeObserver';
import * as React from 'react';

export interface MeasureCellProps {
  columnKey: React.Key;
  columnResizeObserver: IColumnResizeObserver<React.Key>;
}

export default function MeasureCell({ columnKey, columnResizeObserver }: MeasureCellProps) {
  const [cellRef] = useObserveElement(columnResizeObserver, columnKey);

  React.useEffect(() => {
    columnResizeObserver.trigger({ offsetWidth: cellRef.current.offsetWidth }, columnKey);
  }, []);

  return (
    <td
      ref={cellRef as React.RefObject<HTMLTableDataCellElement>}
      style={{ padding: 0, border: 0, height: 0 }}
    >
      <div style={{ height: 0, overflow: 'hidden' }}>&nbsp;</div>
    </td>
  );
}
