import * as React from 'react';
import ResizeObserver from '@rc-component/resize-observer';
import MeasureCell from './MeasureCell';
import isVisible from '@rc-component/util/lib/Dom/isVisible';
import { useContext } from '@rc-component/context';
import TableContext from '../context/TableContext';
import type { ColumnType } from '../interface';

export interface MeasureRowProps {
  prefixCls: string;
  onColumnWidthChange: (key: React.Key, width: number) => void;
  columnsKey: React.Key[];
  columns: readonly ColumnType<any>[];
}

const MeasureRow: React.FC<MeasureRowProps> = (props) => {

  const { prefixCls, columnsKey, onColumnWidthChange, columns } = props;
  
  const ref = React.useRef<HTMLTableRowElement>(null);

  const { measureRowRender } = useContext(TableContext, ['measureRowRender']);

  const measureRow = (
    <tr aria-hidden="true" className={`${prefixCls}-measure-row`} style={{ height: 0 }} ref={ref}>
      <ResizeObserver.Collection
        onBatchResize={infoList => {
          if (isVisible(ref.current)) {
            infoList.forEach(({ data: columnKey, size }) => {
              onColumnWidthChange(columnKey, size.offsetWidth);
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
              onColumnWidthChange={onColumnWidthChange}
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
