import * as React from 'react';
import ResizeObserver from '@rc-component/resize-observer';

export interface MeasureCellProps {
  columnKey: React.Key;
  title?: React.ReactNode;
}
/**
 * Measure cell renders the td used for width measurement and reports its
 * size changes to the MeasureRow collection (#1507).
 */
const MeasureCell: React.FC<MeasureCellProps> = props => {
  const { columnKey, title } = props;

  return (
    <ResizeObserver data={columnKey}>
      <td style={{ paddingTop: 0, paddingBottom: 0, borderTop: 0, borderBottom: 0, height: 0 }}>
        <div style={{ height: 0, overflow: 'hidden', fontWeight: 'bold' }}>{title || '\xa0'}</div>
      </td>
    </ResizeObserver>
  );
};

export default MeasureCell;
