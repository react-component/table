import * as React from 'react';
import ResizeObserver from 'rc-resize-observer';
import MeasureCell from './MeasureCell';
import isVisible from 'rc-util/lib/Dom/isVisible';
import type { ColumnType } from '../interface';

export interface MeasureRowProps {
  prefixCls: string;
  onColumnResize: (key: React.Key, width: number) => void;
  columnsKey: React.Key[];
  columns: readonly ColumnType<any>[];
}

export default function MeasureRow({
  prefixCls,
  columnsKey,
  onColumnResize,
  columns,
}: MeasureCellProps) {
  const ref = React.useRef<HTMLTableRowElement>(null);

  return (
    <tr aria-hidden="true" className={`${prefixCls}-measure-row`} style={{ height: 0 }} ref={ref}>
      <ResizeObserver.Collection
        onBatchResize={infoList => {
          if (isVisible(ref.current)) {
            infoList.forEach(({ data: columnKey, size }) => {
              onColumnResize(columnKey, size.offsetWidth);
            });
          }
        }}
      >
        {columnsKey.map(columnKey => {
          const column = columns.find(col => col.key === columnKey);
          return (
            <MeasureCell
              key={columnKey}
              columnKey={columnKey}
              onColumnResize={onColumnResize}
              column={column}
            />
          );
        })}
      </ResizeObserver.Collection>
    </tr>
  );
}
