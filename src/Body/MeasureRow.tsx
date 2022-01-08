import * as React from 'react';
import ResizeObserver from 'rc-resize-observer';
import MeasureCell from './MeasureCell';

export interface MeasureCellProps {
  prefixCls: string;
  onColumnResize: (key: React.Key, width: number) => void;
  columnsKey: React.Key[];
}

export default function MeasureRow({ prefixCls, columnsKey, onColumnResize }: MeasureCellProps) {
  // delay state update while resize continuously, e.g. window resize
  const resizedColumnsRef = React.useRef(new Map());

  const batchOnColumnResize = () => {
    resizedColumnsRef.current.forEach((width, columnKey) => {
      onColumnResize(columnKey, width);
    });
    resizedColumnsRef.current.clear();
  };

  return (
    <tr
      aria-hidden="true"
      className={`${prefixCls}-measure-row`}
      style={{ height: 0, fontSize: 0 }}
    >
      <ResizeObserver.Collection
        onBatchResize={infoList => {
          infoList.forEach(({ data: columnKey, size }) => {
            resizedColumnsRef.current.set(columnKey, size.offsetWidth);
          });
          batchOnColumnResize();
        }}
      >
        {columnsKey.map(columnKey => (
          <MeasureCell key={columnKey} columnKey={columnKey} onColumnResize={onColumnResize} />
        ))}
      </ResizeObserver.Collection>
    </tr>
  );
}
