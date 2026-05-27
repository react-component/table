import * as React from 'react';
import ResizeObserver from '@rc-component/resize-observer';
import useLayoutEffect from '@rc-component/util/lib/hooks/useLayoutEffect';
import { cleanMeasureRowAttributes } from '../utils/measureUtil';

export interface MeasureCellProps {
  columnKey: React.Key;
  onColumnResize: (key: React.Key, width: number) => void;
  title?: React.ReactNode;
}

const MeasureCell: React.FC<MeasureCellProps> = props => {
  const { columnKey, onColumnResize, title } = props;

  const cellRef = React.useRef<HTMLTableCellElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (cellRef.current) {
      onColumnResize(columnKey, cellRef.current.offsetWidth);
    }

    if (contentRef.current) {
      cleanMeasureRowAttributes(contentRef.current);
    }
  }, [title, columnKey, onColumnResize]);

  return (
    <ResizeObserver data={columnKey}>
      <td
        ref={cellRef}
        style={{ paddingTop: 0, paddingBottom: 0, borderTop: 0, borderBottom: 0, height: 0 }}
      >
        <div ref={contentRef} style={{ height: 0, overflow: 'hidden', fontWeight: 'bold' }}>
          {title || '\xa0'}
        </div>
      </td>
    </ResizeObserver>
  );
};

export default MeasureCell;
