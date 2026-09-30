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

  // Read every cell width in one synchronous pass. rc-table renders the
  // measure row only with a fixed table layout (fixHeader, horizontal scroll
  // or sticky), where a column width can only change when the row itself
  // resizes or the column set changes, so one row-level observer plus a
  // re-measure on column changes observes everything a per-cell
  // ResizeObserver would, without one forced layout read per column (#1507).
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

  const columnsKeyStr = columnsKey.join('_');

  useLayoutEffect(() => {
    measureColumns();
    // measureColumns is a stable useEvent handle; only the column set re-runs it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnsKeyStr]);

  const measureRow = (
    <ResizeObserver onResize={measureColumns}>
      <tr aria-hidden="true" className={`${prefixCls}-measure-row`} style={{ height: 0 }} ref={ref}>
        {columnsKey.map(columnKey => {
          const column = columns.find(col => col.key === columnKey);
          const rawTitle = column?.title;
          const titleForMeasure = React.isValidElement<React.RefAttributes<any>>(rawTitle)
            ? React.cloneElement(rawTitle, { ref: null })
            : rawTitle;
          return <MeasureCell key={columnKey} title={titleForMeasure} />;
        })}
      </tr>
    </ResizeObserver>
  );

  return typeof measureRowRender === 'function' ? measureRowRender(measureRow) : measureRow;
};

export default MeasureRow;
