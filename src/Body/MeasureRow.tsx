import * as React from 'react';
import ResizeObserver from '@rc-component/resize-observer';
import MeasureCell from './MeasureCell';
import isVisible from '@rc-component/util/lib/Dom/isVisible';

export interface MeasureCellProps {
  prefixCls: string;
  onColumnResize: (key: React.Key, width: number) => void;
  columnsKey: React.Key[];
}

export default function MeasureRow({ prefixCls, columnsKey, onColumnResize }: MeasureCellProps) {
  const ref = React.useRef<HTMLTableRowElement>(null);

  return (
    <tr
      aria-hidden="true"
      className={`${prefixCls}-measure-row`}
      style={{ height: 0, fontSize: 0 }}
      ref={ref}
    >
      <ResizeObserver.Collection
        onBatchResize={infoList => {
          if (isVisible(ref.current)) {
            infoList.forEach(({ data: columnKey, size }) => {
              onColumnResize(columnKey, size.offsetWidth);
            });
          }
        }}
      >
        {columnsKey.map(columnKey => (
          <MeasureCell key={columnKey} columnKey={columnKey} onColumnResize={onColumnResize} />
        ))}
      </ResizeObserver.Collection>
    </tr>
  );
}
