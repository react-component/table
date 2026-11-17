import * as React from 'react';
import ResizeObserver from '@rc-component/resize-observer';
import MeasureCell from './MeasureCell';
import { isVisible } from '@rc-component/util';
import { useContext } from '@rc-component/context';
import TableContext from '../context/TableContext';
import type { ColumnType } from '../interface';

export interface MeasureRowProps {
  prefixCls: string;
  onColumnResize: (key: React.Key, width: number) => void;
  columnsKey: React.Key[];
  columns: readonly ColumnType<any>[];
}

const MeasureRow: React.FC<MeasureRowProps> = ({
  prefixCls,
  columnsKey,
  onColumnResize,
  columns,
}) => {
  const ref = React.useRef<HTMLTableRowElement>(null);

  const { measureRowRender } = useContext(TableContext, ['measureRowRender']);

  // inert also covers a title that sets visibility: visible on itself. It is set on the
  // element because React 18 drops a boolean `inert` prop and React 19 reads `inert=""`
  // as false.
  const setRowRef = React.useCallback((row: HTMLTableRowElement | null) => {
    ref.current = row;
    row?.setAttribute('inert', '');
  }, []);

  // The row holds copies of the column titles, which may contain controls such as a
  // select-all checkbox. aria-hidden alone leaves those focusable; visibility: hidden
  // takes them out of the tab order while the row still lays out for measuring.
  const measureRow = (
    <tr
      aria-hidden="true"
      className={`${prefixCls}-measure-row`}
      style={{ height: 0, visibility: 'hidden' }}
      ref={setRowRef}
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
        {columnsKey.map(columnKey => {
          const column = columns.find(col => col.key === columnKey);
          const rawTitle = column?.title;
          const titleForMeasure = React.isValidElement<React.RefAttributes<any>>(rawTitle)
            ? React.cloneElement(rawTitle, { ref: null })
            : rawTitle;
          return (
            <MeasureCell
              key={columnKey}
              columnKey={columnKey}
              onColumnResize={onColumnResize}
              title={titleForMeasure}
            />
          );
        })}
      </ResizeObserver.Collection>
    </tr>
  );

  return typeof measureRowRender === 'function' ? measureRowRender(measureRow) : measureRow;
};

export default MeasureRow;
