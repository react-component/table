import * as React from 'react';

export interface MeasureCellProps {
  columnKey: React.Key;
  columnResizeObserver;
}

export default function MeasureCell({ columnKey, columnResizeObserver }: MeasureCellProps) {
  const cellRef = React.useRef<HTMLTableDataCellElement>();
  const lastCellRef = React.useRef<HTMLTableDataCellElement>();

  React.useEffect(() => {
    if (lastCellRef.current !== cellRef.current) {
      if (lastCellRef.current) {
        columnResizeObserver.unobserve(lastCellRef.current);
      }
      if (cellRef.current) {
        columnResizeObserver.observe(cellRef.current, {
          columnKey,
        });
      }

      lastCellRef.current = cellRef.current;
    }
  });

  React.useEffect(() => {
    return () => {
      if (lastCellRef.current) {
        columnResizeObserver.unobserve(lastCellRef.current);
      }
    };
  }, []);

  return (
    <td ref={cellRef} style={{ padding: 0, border: 0, height: 0 }}>
      <div style={{ height: 0, overflow: 'hidden' }}>&nbsp;</div>
    </td>
  );
}
