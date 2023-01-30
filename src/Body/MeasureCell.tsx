import { useContext } from '@rc-component/context';
import ResizeObserver from 'rc-resize-observer';
import * as React from 'react';
import TableContext from '../context/TableContext';

export interface MeasureCellProps {
  columnKey: React.Key;
  onColumnResize: (key: React.Key, width: number) => void;
}

export default function MeasureCell({ columnKey, onColumnResize }: MeasureCellProps) {
  const cellRef = React.useRef<HTMLTableCellElement>();
  const { resizeLimtMap } = useContext(TableContext, ['resizeLimtMap']);

  React.useEffect(() => {
    const cell = cellRef.current;
    if (cell instanceof HTMLElement) {
      const limtWidth = resizeLimtMap.has(columnKey) ? resizeLimtMap.get(columnKey) : 0;
      if (!isNaN(limtWidth) && limtWidth !== 0) {
        onColumnResize(columnKey, limtWidth);
        cell.style.minWidth = `${limtWidth}px`;
      } else {
        onColumnResize(columnKey, cell.offsetWidth);
      }
    }
  }, [resizeLimtMap, columnKey]);

  return (
    <ResizeObserver data={columnKey}>
      <td ref={cellRef} style={{ padding: 0, border: 0, height: 0 }}>
        <div style={{ height: 0, overflow: 'hidden' }}>&nbsp;</div>
      </td>
    </ResizeObserver>
  );
}
