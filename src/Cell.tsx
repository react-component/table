import React from 'react';
import { DataIndex, ColumnType, RenderedCell } from './interface';
import { getPathValue } from './utils/valueUtil';

function isRenderCell<RecordType>(
  data: React.ReactNode | RenderedCell<RecordType>,
): data is RenderedCell<RecordType> {
  return data && typeof data === 'object' && !React.isValidElement(data);
}

export interface CellProps<RecordType> {
  record: RecordType;
  /** `record` index. Not `column` index. */
  index: number;
  dataIndex: DataIndex;
  render: ColumnType<RecordType>['render'];
  component?: keyof React.ReactHTML;
}

function Cell<RecordType>({
  record,
  index,
  dataIndex,
  render,
  component: Component = 'td',
}: CellProps<RecordType>) {

  const value = getPathValue(record, dataIndex);

  // Customize render node
  let renderNode: React.ReactNode = value;
  if (render) {
    const renderData = render(value, record, index);

    // TODO: Need handle additional props
    if (isRenderCell(renderData)) {
      renderNode = renderData.children;
    } else {
      renderNode = renderData;
    }
  }

  return <Component>{renderNode}</Component>;
}

const MemoCell = React.memo(Cell);
MemoCell.displayName = 'Cell';

export default MemoCell;
