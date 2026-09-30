import * as React from 'react';

export interface MeasureCellProps {
  title?: React.ReactNode;
}
/**
 * Measure cell only renders the td used for width measurement.
 * Width reading is batched by MeasureRow (#1507).
 */
const MeasureCell: React.FC<MeasureCellProps> = props => {
  const { title } = props;

  return (
    <td style={{ paddingTop: 0, paddingBottom: 0, borderTop: 0, borderBottom: 0, height: 0 }}>
      <div style={{ height: 0, overflow: 'hidden', fontWeight: 'bold' }}>{title || '\xa0'}</div>
    </td>
  );
};

export default MeasureCell;
