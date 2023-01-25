import ResizeObserver from 'rc-resize-observer';
import * as React from 'react';
import ResizeContext from '../context/ResizeContext';
import MeasureCell from './MeasureCell';

export interface MeasureCellProps {
  prefixCls: string;
  onColumnResize: (key: React.Key, width: number) => void;
  columnsKey: React.Key[];
}

export default function MeasureRow({ prefixCls, columnsKey, onColumnResize }: MeasureCellProps) {
  const { resizeLimtMap } = React.useContext(ResizeContext);
  return (
    <tr
      aria-hidden="true"
      className={`${prefixCls}-measure-row`}
      style={{ height: 0, fontSize: 0 }}
    >
      <ResizeObserver.Collection
        onBatchResize={infoList => {
          infoList.forEach(({ data: columnKey, size }) => {
            const limtWidth = resizeLimtMap.has(columnKey) ? resizeLimtMap.get(columnKey) : 0;
            if (limtWidth > size.offsetWidth) {
              onColumnResize(columnKey, limtWidth);
            } else {
              onColumnResize(columnKey, size.offsetWidth);
            }
          });
        }}
      >
        {columnsKey.map(columnKey => (
          <MeasureCell key={columnKey} columnKey={columnKey} onColumnResize={onColumnResize} />
        ))}
      </ResizeObserver.Collection>
    </tr>
  );
}
