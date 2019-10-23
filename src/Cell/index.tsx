import * as React from 'react';
import classNames from 'classnames';
import { DataIndex, ColumnType, RenderedCell, CustomizeComponent } from '../interface';
import { getPathValue } from '../utils/valueUtil';

function isRenderCell<RecordType>(
  data: React.ReactNode | RenderedCell<RecordType>,
): data is RenderedCell<RecordType> {
  return data && typeof data === 'object' && !React.isValidElement(data);
}

export interface CellProps<RecordType> {
  prefixCls?: string;
  record?: RecordType;
  /** `record` index. Not `column` index. */
  index?: number;
  dataIndex?: DataIndex;
  render?: ColumnType<RecordType>['render'];
  component?: CustomizeComponent;
  children?: React.ReactNode;
  colSpan?: number;
  rowSpan?: number;
  ellipsis?: boolean;

  // Fixed
  fixLeft?: number | false;
  fixRight?: number | false;
  lastFixLeft?: boolean;
  firstFixRight?: boolean;

  // Additional props
  additionalProps?: React.HTMLAttributes<HTMLElement>;
}

function Cell<RecordType>(
  {
    prefixCls,
    record,
    index,
    dataIndex,
    render,
    children,
    component: Component = 'td',
    colSpan,
    rowSpan,
    fixLeft,
    fixRight,
    lastFixLeft,
    firstFixRight,
    additionalProps = {},
    ellipsis,
  }: CellProps<RecordType>,
  ref: any,
): React.ReactElement {
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
  const isFixLeft = typeof fixLeft === 'number';
  const isFixRight = typeof fixRight === 'number';

  if (isFixLeft) {
    fixedStyle.position = 'sticky';
    fixedStyle.left = fixLeft as number;
  }
  if (isFixRight) {
    fixedStyle.position = 'sticky';
    fixedStyle.right = fixRight as number;
  }

  const cellPrefixCls = `${prefixCls}-cell`;

  const componentProps = {
    ...additionalProps,
    colSpan,
    rowSpan,
    className: classNames(
      cellPrefixCls,
      {
        [`${cellPrefixCls}-fix-left`]: isFixLeft,
        [`${cellPrefixCls}-fix-left-last`]: lastFixLeft,
        [`${cellPrefixCls}-fix-right`]: isFixRight,
        [`${cellPrefixCls}-fix-right-first`]: firstFixRight,
        [`${cellPrefixCls}-ellipsis`]: ellipsis,
      },
      additionalProps.className,
    ),
    style: { ...additionalProps.style, ...fixedStyle },
    ref,
  };

  return (
    <Component {...componentProps} data-ellipsis={ellipsis}>
      {childNode}
    </Component>
  );
}

const RefCell = React.forwardRef(Cell);

const MemoCell = React.memo(RefCell);
MemoCell.displayName = 'Cell';

export default MemoCell;
