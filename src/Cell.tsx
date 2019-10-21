import React from 'react';
import { DataIndex, ColumnType, RenderedCell } from './interface';
import { getPathValue } from './utils/valueUtil';

function isRenderCell<RecordType>(
  data: React.ReactNode | RenderedCell<RecordType>,
): data is RenderedCell<RecordType> {
  return data && typeof data === 'object' && !React.isValidElement(data);
}

export interface CellProps<RecordType> {
  record?: RecordType;
  /** `record` index. Not `column` index. */
  index?: number;
  dataIndex?: DataIndex;
  render?: ColumnType<RecordType>['render'];
  component?: keyof React.ReactHTML;
  children?: React.ReactNode;
  colSpan?: number;
  rowSpan?: number;

  // Fixed
  fixedTop?: number | false;
  fixLeft?: boolean;
  fixRight?: boolean;
}

function Cell<RecordType>({
  record,
  index,
  dataIndex,
  render,
  children,
  component: Component = 'td',
  colSpan,
  rowSpan,
  fixedTop,
  fixLeft,
  fixRight,
}: CellProps<RecordType>): React.ReactElement {
  if (colSpan === 0) {
    return null;
  }

  // ==================== Child Node ====================
  let childNode: React.ReactNode;
  if (children) {
    childNode = children;
  } else {
    const value = getPathValue(record, dataIndex);

    // Customize render node
    childNode = value;
    if (render) {
      const renderData = render(value, record, index);

      // TODO: Need handle additional props
      if (isRenderCell(renderData)) {
        childNode = renderData.children;
      } else {
        childNode = renderData;
      }
    }
  }

  // ====================== Fixed =======================
  const fixedStyle: React.CSSProperties = {};
  if (typeof fixedTop === 'number') {
    fixedStyle.position = 'sticky';
    fixedStyle.top = fixedTop;
    fixedStyle.zIndex = 2;
  }
  if (fixLeft) {
    fixedStyle.position = 'sticky';
    fixedStyle.left = 0;
  }
  if (fixRight) {
    fixedStyle.position = 'sticky';
    fixedStyle.right = 0;
  }

  return (
    <Component colSpan={colSpan} rowSpan={rowSpan} style={fixedStyle}>
      {childNode}
    </Component>
  );
}

const MemoCell = React.memo(Cell);
MemoCell.displayName = 'Cell';

export default MemoCell;
