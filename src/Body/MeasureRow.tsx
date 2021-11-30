import * as React from 'react';
import ResizeObserver from 'rc-resize-observer';
import { debounce } from 'lodash';
import MeasureCell from './MeasureCell';

export interface MeasureCellProps {
  prefixCls: string;
  onColumnResize: (key: React.Key, width: number) => void;
  columnsKey: React.Key[];
}

export default function MeasureRow({ prefixCls, columnsKey, onColumnResize }: MeasureCellProps) {
  // debounce the continuous resize, e.g. window resize
  const resizedColumnsRef = React.useRef(new Map());
  const onColumnResizeRef = React.useRef(onColumnResize);
  onColumnResizeRef.current = onColumnResize;
  const debounceColumnResize = React.useMemo(
    () =>
      debounce(
        () => {
          resizedColumnsRef.current.forEach((width, columnKey) => {
            onColumnResizeRef.current(columnKey, width);
          });
          resizedColumnsRef.current.clear();
        },
        1200,
        {
          leading: true,
          trailing: true,
        },
      ),
    [],
  );
  React.useEffect(() => {
    return () => {
      debounceColumnResize.cancel();
    };
  }, []);
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
          debounceColumnResize();
        }}
      >
        {columnsKey.map(columnKey => (
          <MeasureCell key={columnKey} columnKey={columnKey} onColumnResize={onColumnResize} />
        ))}
      </ResizeObserver.Collection>
    </tr>
  );
}
