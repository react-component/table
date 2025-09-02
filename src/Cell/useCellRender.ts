import useMemo from '@rc-component/util/lib/hooks/useMemo';
import isEqual from '@rc-component/util/lib/isEqual';
import getValue from '@rc-component/util/lib/utils/get';
import warning from '@rc-component/util/lib/warning';
import * as React from 'react';
import PerfContext from '../context/PerfContext';
import type { CellType, ColumnType, DataIndex, RenderedCell } from '../interface';
import { validateValue } from '../utils/valueUtil';
import { useImmutableMark } from '../context/TableContext';

function isRenderCell<RecordType>(
  data: React.ReactNode | RenderedCell<RecordType>,
): data is RenderedCell<RecordType> {
  return data && typeof data === 'object' && !Array.isArray(data) && !React.isValidElement(data);
}

export default function useCellRender<RecordType>(
  record: RecordType,
  dataIndex: DataIndex<RecordType>,
  renderIndex: number,
  children?: React.ReactNode,
  render?: ColumnType<RecordType>['render'],
  shouldCellUpdate?: ColumnType<RecordType>['shouldCellUpdate'],
) {
  // TODO: Remove this after next major version
  const perfRecord = React.useContext(PerfContext);
  const mark = useImmutableMark();

  // ======================== Render ========================
  const retData = useMemo<[React.ReactNode, CellType<RecordType>] | [React.ReactNode]>(
    () => {
      if (validateValue(children)) {
        return [children];
      }

      const path =
        dataIndex === null || dataIndex === undefined || dataIndex === ''
          ? []
          : Array.isArray(dataIndex)
            ? dataIndex
            : [dataIndex];

      const value: React.ReactNode = getValue(record, path as any);

      // Customize render node
      let returnChildNode = value;
      let returnCellProps: CellType<RecordType> | undefined = undefined;

      if (render) {
        const renderData = render(value, record, renderIndex);

        if (isRenderCell(renderData)) {
          if (process.env.NODE_ENV !== 'production') {
            warning(
              false,
              '`columns.render` return cell props is deprecated with perf issue, please use `onCell` instead.',
            );
          }
          returnChildNode = renderData.children;
          returnCellProps = renderData.props;
          perfRecord.renderWithProps = true;
        } else {
          returnChildNode = renderData;
        }
      }

      return [returnChildNode, returnCellProps];
    },
    [
      // Force update deps
      mark,

      // Normal deps
      record,
      children,
      dataIndex,
      render,
      renderIndex,
    ],
    (prev, next) => {
      if (shouldCellUpdate) {
        const [, prevRecord] = prev;
        const [, nextRecord] = next;
        return shouldCellUpdate(nextRecord, prevRecord);
      }

      // Legacy mode should always update
      if (perfRecord.renderWithProps) {
        return true;
      }

      return !isEqual(prev, next, true);
    },
  );

  return retData;
}
