import { useImmutableMark } from '@rc-component/context';
import getValue from 'rc-util/lib/utils/get';
import warning from 'rc-util/lib/warning';
import * as React from 'react';
import PerfContext from '../context/PerfContext';
import type { CellType, ColumnType, DataIndex, RenderedCell } from '../interface';
import { validateValue } from '../utils/valueUtil';

function isRenderCell<RecordType>(
  data: React.ReactNode | RenderedCell<RecordType>,
): data is RenderedCell<RecordType> {
  return data && typeof data === 'object' && !Array.isArray(data) && !React.isValidElement(data);
}

export default function useCellRender<RecordType>(
  record: RecordType,
  dataIndex: DataIndex,
  renderIndex: number,
  children?: React.ReactNode,
  render?: ColumnType<RecordType>['render'],
) {
  const mark = useImmutableMark();

  // TODO: Remove this after next major version
  const perfRecord = React.useContext(PerfContext);

  return React.useMemo<[React.ReactNode, CellType<RecordType>] | [React.ReactNode]>(() => {
    if (validateValue(children)) {
      return [children];
    }

    const path =
      dataIndex === null || dataIndex === undefined || dataIndex === ''
        ? []
        : Array.isArray(dataIndex)
        ? dataIndex
        : [dataIndex];

    const value: Record<string, unknown> | React.ReactNode = getValue(record, path);

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
  }, [
    // Force update deps
    perfRecord.renderWithProps ? Math.random() : 0,
    perfRecord,
    mark,

    // Normal deps
    children,
    dataIndex,
    record,
    render,
    renderIndex,
  ]);
}
