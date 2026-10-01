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
      const cell = cells[index];
      if (cell) {
        onColumnResize(columnKey, (cell as HTMLTableCellElement).offsetWidth);
      }
    });
  });

  // Serialize with separators: ['a_b', 'c'] and ['a', 'b_c'] are different
  // column sets and must re-measure even though they join to the same string.
  const columnsKeyStr = JSON.stringify(columnsKey);

  useLayoutEffect(() => {
    measureColumns();
    // measureColumns is a stable useEvent handle; only the column set re-runs it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnsKeyStr]);

  const measureRow = (
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
