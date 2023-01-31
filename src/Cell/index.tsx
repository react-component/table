import { useContext } from '@rc-component/context';
import classNames from 'classnames';
import * as React from 'react';
import TableContext from '../context/TableContext';
import devRenderTimes from '../hooks/useRenderTimes';
import type {
  AlignType,
  CellEllipsisType,
  ColumnType,
  CustomizeComponent,
  DataIndex,
  DefaultRecordType,
  ScopeType,
} from '../interface';
import { getHeaderCellNodeWidth } from '../utils/valueUtil';
import useCellRender from './useCellRender';
import useHoverState from './useHoverState';

export interface CellProps<RecordType extends DefaultRecordType> {
  prefixCls?: string;
  className?: string;
  record?: RecordType;
  /** `column` index is the real show rowIndex */
  index?: number;
  /** the index of the record. For the render(value, record, renderIndex) */
  renderIndex?: number;
  dataIndex?: DataIndex;
  render?: ColumnType<RecordType>['render'];
  component?: CustomizeComponent;
  children?: React.ReactNode;
  colSpan?: number;
  rowSpan?: number;
  scope?: ScopeType;
  ellipsis?: CellEllipsisType;
  align?: AlignType;
  columnKey?: React.Key;

  shouldCellUpdate?: (record: RecordType, prevRecord: RecordType) => boolean;

  // Fixed
  fixLeft?: number | false;
  fixRight?: number | false;
  firstFixLeft?: boolean;
  lastFixLeft?: boolean;
  firstFixRight?: boolean;
  lastFixRight?: boolean;
  allColsFixedLeft?: boolean;

  // ====================== Private Props ======================
  /** @private Used for `expandable` with nest tree */
  appendNode?: React.ReactNode;
  additionalProps?: React.TdHTMLAttributes<HTMLTableCellElement>;

  rowType?: 'header' | 'body' | 'footer';

  isSticky?: boolean;
}

const getTitleFromCellRenderChildren = ({
  ellipsis,
  rowType,
  children,
}: Pick<CellProps<any>, 'ellipsis' | 'rowType' | 'children'>) => {
  let title: string;
  const ellipsisConfig: CellEllipsisType = ellipsis === true ? { showTitle: true } : ellipsis;
  if (ellipsisConfig && (ellipsisConfig.showTitle || rowType === 'header')) {
    if (typeof children === 'string' || typeof children === 'number') {
      title = children.toString();
    } else if (React.isValidElement(children) && typeof children.props.children === 'string') {
      title = children.props.children;
    }
  }
  return title;
};

function Cell<RecordType>(props: CellProps<RecordType>) {
  if (process.env.NODE_ENV !== 'production') {
    devRenderTimes(props);
  }

  const {
    component: Component,
    children,
    ellipsis,
    scope,

    // Style
    prefixCls,
    className,
    align,

    // Value
    record,
    render,
    dataIndex,
    renderIndex,
    shouldCellUpdate,

    // Row
    index,
    rowType,

    // Span
    colSpan,
    rowSpan,

    // Fixed
    fixLeft,
    fixRight,
    firstFixLeft,
    lastFixLeft,
    firstFixRight,
    lastFixRight,

    // Private
    appendNode,
    additionalProps = {},
    isSticky,
    columnKey,
  } = props;

  const cellPrefixCls = `${prefixCls}-cell`;
  const { supportSticky, allColumnsFixedLeft, setResizeLimt, columns } = useContext(TableContext, [
    'supportSticky',
    'allColumnsFixedLeft',
    'setResizeLimt',
    'columns',
  ]);
  const cellBaseRef = React.useRef(null);

  // ====================== Value =======================
  const [childNode, legacyCellProps] = useCellRender(
    record,
    dataIndex,
    renderIndex,
    children,
    render,
    shouldCellUpdate,
  );

  // Fix the title breaking caused by resize on sticky mode
  React.useEffect(() => {
    const node: HTMLElement | null = (cellBaseRef as React.MutableRefObject<any>)?.current;
    if (node instanceof HTMLElement && node?.localName === 'th' && isSticky) {
      const w = getHeaderCellNodeWidth(node);
      if (!isNaN(w)) {
        const target = columns.find(colum => colum.key === columnKey) as ColumnType<RecordType>;
        setResizeLimt(columnKey, (target?.width as number) ?? w);
      }
    }
  }, [cellBaseRef, appendNode, childNode, columns, columnKey]);

  // ====================== Fixed =======================
  const fixedStyle: React.CSSProperties = {};
  const isFixLeft = typeof fixLeft === 'number' && supportSticky;
  const isFixRight = typeof fixRight === 'number' && supportSticky;

  if (isFixLeft) {
    fixedStyle.position = 'sticky';
    fixedStyle.left = fixLeft as number;
  }
  if (isFixRight) {
    fixedStyle.position = 'sticky';

    fixedStyle.right = fixRight as number;
  }

  // ================ RowSpan & ColSpan =================
  const mergedColSpan = legacyCellProps?.colSpan ?? colSpan ?? additionalProps.colSpan ?? 1;
  const mergedRowSpan = legacyCellProps?.rowSpan ?? rowSpan ?? additionalProps.rowSpan ?? 1;

  // ====================== Hover =======================
  const [hovering, onHover] = useHoverState(index, mergedRowSpan);

  const onMouseEnter: React.MouseEventHandler<HTMLTableCellElement> = event => {
    if (record) {
      onHover(index, index + mergedRowSpan - 1);
    }

    additionalProps?.onMouseEnter?.(event);
  };

  const onMouseLeave: React.MouseEventHandler<HTMLTableCellElement> = event => {
    if (record) {
      onHover(-1, -1);
    }

    additionalProps?.onMouseLeave?.(event);
  };

  // ====================== Render ======================
  if (mergedColSpan === 0 || mergedRowSpan === 0) {
    return null;
  }

  // >>>>> Title
  const title =
    additionalProps.title ??
    getTitleFromCellRenderChildren({
      rowType,
      ellipsis,
      children: childNode,
    });

  // >>>>> ClassName
  const mergedClassName = classNames(
    cellPrefixCls,
    className,
    {
      [`${cellPrefixCls}-fix-left`]: isFixLeft && supportSticky,
      [`${cellPrefixCls}-fix-left-first`]: firstFixLeft && supportSticky,
      [`${cellPrefixCls}-fix-left-last`]: lastFixLeft && supportSticky,
      [`${cellPrefixCls}-fix-left-all`]: lastFixLeft && allColumnsFixedLeft && supportSticky,
      [`${cellPrefixCls}-fix-right`]: isFixRight && supportSticky,
      [`${cellPrefixCls}-fix-right-first`]: firstFixRight && supportSticky,
      [`${cellPrefixCls}-fix-right-last`]: lastFixRight && supportSticky,
      [`${cellPrefixCls}-ellipsis`]: ellipsis,
      [`${cellPrefixCls}-with-append`]: appendNode,
      [`${cellPrefixCls}-fix-sticky`]: (isFixLeft || isFixRight) && isSticky && supportSticky,
      [`${cellPrefixCls}-row-hover`]: !legacyCellProps && hovering,
    },
    additionalProps.className,
    legacyCellProps?.className,
  );

  // >>>>> Style
  const alignStyle: React.CSSProperties = {};
  if (align) {
    alignStyle.textAlign = align;
  }

  const mergedStyle = {
    ...additionalProps.style,
    ...alignStyle,
    ...fixedStyle,
    ...legacyCellProps?.style,
  };

  // >>>>> Children Node
  let mergedChildNode = childNode;

  // Not crash if final `childNode` is not validate ReactNode
  if (
    typeof mergedChildNode === 'object' &&
    !Array.isArray(mergedChildNode) &&
    !React.isValidElement(mergedChildNode)
  ) {
    mergedChildNode = null;
  }

  if (ellipsis && (lastFixLeft || firstFixRight)) {
    mergedChildNode = <span className={`${cellPrefixCls}-content`}>{mergedChildNode}</span>;
  }

  return (
    <Component
      {...legacyCellProps}
      {...additionalProps}
      className={mergedClassName}
      style={mergedStyle}
      ref={cellBaseRef}
      // A11y
      title={title}
      scope={scope}
      // Hover
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      //Span
      colSpan={mergedColSpan !== 1 ? mergedColSpan : null}
      rowSpan={mergedRowSpan !== 1 ? mergedRowSpan : null}
    >
      {appendNode}
      {mergedChildNode}
    </Component>
  );
}

export default React.memo(Cell);
