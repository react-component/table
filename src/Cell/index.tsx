import * as React from 'react';
import classNames from 'classnames';
import {
  DataIndex,
  ColumnType,
  RenderedCell,
  CustomizeComponent,
  CellType,
  DefaultRecordType,
} from '../interface';
import { getPathValue } from '../utils/valueUtil';

function isRenderCell<RecordType>(
  data: React.ReactNode | RenderedCell<RecordType>,
): data is RenderedCell<RecordType> {
  return data && typeof data === 'object' && !React.isValidElement(data);
}

export interface CellProps<RecordType extends DefaultRecordType> {
  prefixCls?: string;
  className?: string;
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

  // Additional
  /** @private Used for `expandable` with nest tree */
  appendNode?: React.ReactNode;
  additionalProps?: React.HTMLAttributes<HTMLElement>;
}

function Cell<RecordType extends DefaultRecordType>(
  {
    prefixCls,
    className,
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
    appendNode,
    additionalProps = {},
    ellipsis,
  }: CellProps<RecordType>,
  ref: React.Ref<any>,
): React.ReactElement {
  // ==================== Child Node ====================
  let cellProps: CellType<RecordType>;
  let childNode: React.ReactNode;

  if (children) {
    childNode = children;
  } else {
    const value = getPathValue<object | React.ReactNode, RecordType>(record, dataIndex);

    // Customize render node
    childNode = value;
    if (render) {
      const renderData = render(value, record, index);

      if (isRenderCell(renderData)) {
        childNode = renderData.children;
        cellProps = renderData.props;
      } else {
        childNode = renderData;
      }
    }
  }

  // Not crash if final `childNode` is not validate ReactNode
  if (typeof childNode === 'object' && !React.isValidElement(childNode)) {
    childNode = null;
  }

  const { colSpan: cellColSpan, rowSpan: cellRowSpan } = cellProps || {};
  const mergedColSpan = cellColSpan !== undefined ? cellColSpan : colSpan;
  const mergedRowSpan = cellRowSpan !== undefined ? cellRowSpan : rowSpan;

  if (mergedColSpan === 0 || mergedRowSpan === 0) {
    return null;
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

  // ====================== Render ======================
  let title: string;
  if (ellipsis) {
    if (typeof childNode === 'string') {
      title = childNode;
    } else if (React.isValidElement(childNode) && typeof childNode.props.children === 'string') {
      title = childNode.props.children;
    }
  }

  const cellPrefixCls = `${prefixCls}-cell`;

  const componentProps = {
    title,
    ...additionalProps,
    colSpan: mergedColSpan,
    rowSpan: mergedRowSpan,
    className: classNames(
      cellPrefixCls,
      className,
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
    <Component {...componentProps}>
      {appendNode}
      {childNode}
    </Component>
  );
}

const RefCell = React.forwardRef(Cell);

const MemoCell = React.memo(RefCell);
MemoCell.displayName = 'Cell';

export default MemoCell;
