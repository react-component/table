import * as React from 'react';
import ResizeObserver from '@rc-component/resize-observer';
import { isVisible, useEvent, useLayoutEffect } from '@rc-component/util';
import { useContext } from '@rc-component/context';
import TableContext from '../context/TableContext';
import type { ColumnType } from '../interface';
import MeasureCell from './MeasureCell';

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

  // Read every cell width in one synchronous pass. The reads have no writes
  // between them, so the row costs one layout instead of one per cell, and
  // every onColumnResize call batches into a single state update (#1507).
  // It covers mount and column-set changes; later width changes (a column
  // gaining width while the table keeps its width, auto layout reacting to
  // fonts or content) are reported by the per-cell observers below, which a
  // row-level observer can not see.
  const measureColumns = useEvent(() => {
    const row = ref.current;
    if (!row || !isVisible(row)) {
      return;
    }
    const cells = row.children;
    columnsKey.forEach((columnKey, index) => {
      const cell = cells[index] as HTMLTableCellElement;
      if (cell) {
        // Same width the per-cell observer reports: it hands over the fractional
        // getBoundingClientRect width whenever offsetWidth is that width rounded.
        // A cell that keeps its size never notifies again, so an integer read here
        // would stick, and the rounding error of each column adds up against the
        // header.
        const { width } = cell.getBoundingClientRect();
        const { offsetWidth } = cell;
        onColumnResize(columnKey, offsetWidth === Math.round(width) ? width : offsetWidth);
      }
    });
  });

  // Sorted, so moving the same columns around does not re-measure: the cells keep
  // their keys, every width change that follows a reorder reaches the per-cell
  // observers. Serialized with the type and with separators because ['a_b', 'c']
  // and ['a', 'b_c'] are different column sets that join to the same string, and
  // React.Key also allows bigint, which JSON.stringify refuses to take.
  const columnsKeyStr = JSON.stringify(
    columnsKey.map(columnKey => `${typeof columnKey}:${columnKey}`).sort(),
  );

  useLayoutEffect(() => {
    measureColumns();
    // measureColumns is a stable useEvent handle; only the column set re-runs it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnsKeyStr]);

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
          return <MeasureCell key={columnKey} columnKey={columnKey} title={titleForMeasure} />;
        })}
      </ResizeObserver.Collection>
    </tr>
  );

  return typeof measureRowRender === 'function' ? measureRowRender(measureRow) : measureRow;
};

export default MeasureRow;
