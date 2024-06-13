/**
 * Feature:
 *  - fixed not need to set width
 *  - support `rowExpandable` to config row expand logic
 *  - add `summary` to support `() => ReactNode`
 *
 * Update:
 *  - `dataIndex` is `array[]` now
 *  - `expandable` wrap all the expand related props
 *
 * Removed:
 *  - expandIconAsCell
 *  - useFixedHeader
 *  - rowRef
 *  - columns[number].onCellClick
 *  - onRowClick
 *  - onRowDoubleClick
 *  - onRowMouseEnter
 *  - onRowMouseLeave
 *  - getBodyWrapper
 *  - bodyStyle
 *
 * Deprecated:
 *  - All expanded props, move into expandable
 */

import type { CompareProps } from '@rc-component/context/lib/Immutable';
import classNames from 'classnames';
import ResizeObserver from 'rc-resize-observer';
import isVisible from 'rc-util/lib/Dom/isVisible';
import { isStyleSupport } from 'rc-util/lib/Dom/styleChecker';
import { getTargetScrollBarSize } from 'rc-util/lib/getScrollBarSize';
import useEvent from 'rc-util/lib/hooks/useEvent';
import pickAttrs from 'rc-util/lib/pickAttrs';
import getValue from 'rc-util/lib/utils/get';
import warning from 'rc-util/lib/warning';
import * as React from 'react';
import Body from './Body';
import ColGroup from './ColGroup';
import { EXPAND_COLUMN, INTERNAL_HOOKS } from './constant';
import TableContext, { makeImmutable } from './context/TableContext';
import type { FixedHeaderProps } from './FixedHolder';
import FixedHolder from './FixedHolder';
import Footer, { FooterComponents } from './Footer';
import type { SummaryProps } from './Footer/Summary';
import Summary from './Footer/Summary';
import Header from './Header/Header';
import useColumns from './hooks/useColumns';
import useExpand from './hooks/useExpand';
import useFixedInfo from './hooks/useFixedInfo';
import { useLayoutState, useTimeoutLock } from './hooks/useFrame';
import useHover from './hooks/useHover';
import useSticky from './hooks/useSticky';
import useStickyOffsets from './hooks/useStickyOffsets';
import type {
  ColumnsType,
  ColumnType,
  CustomizeScrollBody,
  DefaultRecordType,
  Direction,
  ExpandableConfig,
  GetComponent,
  GetComponentProps,
  GetRowKey,
  LegacyExpandableProps,
  PanelRender,
  Reference,
  RowClassName,
  TableComponents,
  TableLayout,
  TableSticky,
} from './interface';
import Panel from './Panel';
import StickyScrollBar from './stickyScrollBar';
import Column from './sugar/Column';
import ColumnGroup from './sugar/ColumnGroup';
import { getColumnsKey, validateValue } from './utils/valueUtil';

export const DEFAULT_PREFIX = 'rc-table';

// Used for conditions cache
const EMPTY_DATA = [];

// Used for customize scroll
const EMPTY_SCROLL_TARGET = {};

export interface TableProps<RecordType = any>
  extends Omit<LegacyExpandableProps<RecordType>, 'showExpandColumn'> {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  data?: readonly RecordType[];
  columns?: ColumnsType<RecordType>;
  rowKey?: string | keyof RecordType | GetRowKey<RecordType>;
  tableLayout?: TableLayout;

  // Fixed Columns
  scroll?: { x?: number | true | string; y?: number | string };

  // Expandable
  /** Config expand rows */
  expandable?: ExpandableConfig<RecordType>;
  indentSize?: number;
  rowClassName?: string | RowClassName<RecordType>;

  // Additional Part
  footer?: PanelRender<RecordType>;
  summary?: (data: readonly RecordType[]) => React.ReactNode;
  caption?: React.ReactNode;

  // Customize
  id?: string;
  showHeader?: boolean;
  components?: TableComponents<RecordType>;
  onRow?: GetComponentProps<RecordType>;
  onHeaderRow?: GetComponentProps<readonly ColumnType<RecordType>[]>;
  emptyText?: React.ReactNode | (() => React.ReactNode);

  direction?: Direction;

  sticky?: boolean | TableSticky;

  rowHoverable?: boolean;

  // Events
  onScroll?: React.UIEventHandler<HTMLDivElement>;

  // =================================== Internal ===================================
  /**
   * @private Internal usage, may remove by refactor. Should always use `columns` instead.
   *
   * !!! DO NOT USE IN PRODUCTION ENVIRONMENT !!!
   */
  internalHooks?: string;

  /**
   * @private Internal usage, may remove by refactor. Should always use `columns` instead.
   *
   * !!! DO NOT USE IN PRODUCTION ENVIRONMENT !!!
   */
  // Used for antd table transform column with additional column
  transformColumns?: (columns: ColumnsType<RecordType>) => ColumnsType<RecordType>;

  /**
   * @private Internal usage, may remove by refactor.
   *
   * !!! DO NOT USE IN PRODUCTION ENVIRONMENT !!!
   */
  // Force trade scrollbar as 0 size.
  // Force column to be average width if not set
  tailor?: boolean;

  /**
   * @private Internal usage, may remove by refactor.
   *
   * !!! DO NOT USE IN PRODUCTION ENVIRONMENT !!!
   */
  // Pass the way to get real width. e.g. exclude the border width
  getContainerWidth?: (ele: HTMLElement, width: number) => number;

  /**
   * @private Internal usage, may remove by refactor.
   *
   * !!! DO NOT USE IN PRODUCTION ENVIRONMENT !!!
   */
  internalRefs?: {
    body: React.MutableRefObject<HTMLDivElement>;
  };
}

function defaultEmpty() {
  return 'No Data';
}

function Table<RecordType extends DefaultRecordType>(
  tableProps: TableProps<RecordType>,
  ref: React.Ref<Reference>,
) {
  const props = {
    rowKey: 'key',
    prefixCls: DEFAULT_PREFIX,
    emptyText: defaultEmpty,
    ...tableProps,
  };

  const {
    prefixCls,
    className,
    rowClassName,
    style,
    data,
    rowKey,
    scroll,
    tableLayout,
    direction,

    // Additional Part
    title,
    footer,
    summary,
    caption,

    // Customize
    id,
    showHeader,
    components,
    emptyText,
    onRow,
    onHeaderRow,

    // Events
    onScroll,

    // Internal
    internalHooks,
    transformColumns,
    internalRefs,
    tailor,
    getContainerWidth,

    sticky,
    rowHoverable = true,
  } = props;

  const mergedData = data || EMPTY_DATA;
  const hasData = !!mergedData.length;

  const useInternalHooks = internalHooks === INTERNAL_HOOKS;

  // ===================== Warning ======================
  if (process.env.NODE_ENV !== 'production') {
    [
      'onRowClick',
      'onRowDoubleClick',
      'onRowContextMenu',
      'onRowMouseEnter',
      'onRowMouseLeave',
    ].forEach(name => {
      warning(props[name] === undefined, `\`${name}\` is removed, please use \`onRow\` instead.`);
    });

    warning(
      !('getBodyWrapper' in props),
      '`getBodyWrapper` is deprecated, please use custom `components` instead.',
    );
  }

  // ==================== Customize =====================
  const getComponent = React.useCallback<GetComponent>(
    (path, defaultComponent) => getValue(components, path) || defaultComponent,
    [components],
  );

  const getRowKey = React.useMemo<GetRowKey<RecordType>>(() => {
    if (typeof rowKey === 'function') {
      return rowKey;
    }
    return (record: RecordType) => {
      const key = record && record[rowKey];

      if (process.env.NODE_ENV !== 'production') {
        warning(
          key !== undefined,
          'Each record in table should have a unique `key` prop, or set `rowKey` to an unique primary key.',
        );
      }

      return key;
    };
  }, [rowKey]);

  const customizeScrollBody = getComponent(['body']) as CustomizeScrollBody<RecordType>;

  // ====================== Hover =======================
  const [startRow, endRow, onHover] = useHover();

  // ====================== Expand ======================
  const [
    expandableConfig,
    expandableType,
    mergedExpandedKeys,
    mergedExpandIcon,
    mergedChildrenColumnName,
    onTriggerExpand,
  ] = useExpand(props, mergedData, getRowKey);

  // ====================== Column ======================
  const scrollX = scroll?.x;
  const [componentWidth, setComponentWidth] = React.useState(0);

  const [columns, flattenColumns, flattenScrollX, hasGapFixed] = useColumns(
    {
      ...props,
      ...expandableConfig,
      expandable: !!expandableConfig.expandedRowRender,
      columnTitle: expandableConfig.columnTitle,
      expandedKeys: mergedExpandedKeys,
      getRowKey,
      // https://github.com/ant-design/ant-design/issues/23894
      onTriggerExpand,
      expandIcon: mergedExpandIcon,
      expandIconColumnIndex: expandableConfig.expandIconColumnIndex,
      direction,
      scrollWidth: useInternalHooks && tailor && typeof scrollX === 'number' ? scrollX : null,
      clientWidth: componentWidth,
    },
    useInternalHooks ? transformColumns : null,
  );
  const mergedScrollX = flattenScrollX ?? scrollX;

  const columnContext = React.useMemo(
    () => ({
      columns,
      flattenColumns,
    }),
    [columns, flattenColumns],
  );

  // ======================= Refs =======================
  const fullTableRef = React.useRef<HTMLDivElement>();
  const scrollHeaderRef = React.useRef<HTMLDivElement>();
  const scrollBodyRef = React.useRef<HTMLDivElement>();
  const scrollBodyContainerRef = React.useRef<HTMLDivElement>();

  React.useImperativeHandle(ref, () => {
    return {
      nativeElement: fullTableRef.current,
      scrollTo: config => {
        if (scrollBodyRef.current instanceof HTMLElement) {
          // Native scroll
          const { index, top, key } = config;

          if (top) {
            scrollBodyRef.current?.scrollTo({
              top,
            });
          } else {
            const mergedKey = key ?? getRowKey(mergedData[index]);
            scrollBodyRef.current.querySelector(`[data-row-key="${mergedKey}"]`)?.scrollIntoView();
          }
        } else if ((scrollBodyRef.current as any)?.scrollTo) {
          // Pass to proxy
          (scrollBodyRef.current as any).scrollTo(config);
        }
      },
    };
  });

  // ====================== Scroll ======================
  const scrollSummaryRef = React.useRef<HTMLDivElement>();
  const [pingedLeft, setPingedLeft] = React.useState(false);
  const [pingedRight, setPingedRight] = React.useState(false);
  const [colsWidths, updateColsWidths] = useLayoutState(new Map<React.Key, number>());

  // Convert map to number width
  const colsKeys = getColumnsKey(flattenColumns);
  const pureColWidths = colsKeys.map(columnKey => colsWidths.get(columnKey));
  const colWidths = React.useMemo(() => pureColWidths, [pureColWidths.join('_')]);
  const stickyOffsets = useStickyOffsets(colWidths, flattenColumns, direction);
  const fixHeader = scroll && validateValue(scroll.y);
  const horizonScroll = (scroll && validateValue(mergedScrollX)) || Boolean(expandableConfig.fixed);
  const fixColumn = horizonScroll && flattenColumns.some(({ fixed }) => fixed);

  // Sticky
  const stickyRef = React.useRef<{
    setScrollLeft: (left: number) => void;
    checkScrollBarVisible: () => void;
  }>();
  const { isSticky, offsetHeader, offsetSummary, offsetScroll, stickyClassName, container } =
    useSticky(sticky, prefixCls);

  // Footer (Fix footer must fixed header)
  const summaryNode = React.useMemo(() => summary?.(mergedData), [summary, mergedData]);
  const fixFooter =
    (fixHeader || isSticky) &&
    React.isValidElement(summaryNode) &&
    summaryNode.type === Summary &&
    (summaryNode.props as SummaryProps).fixed;

  // Scroll
  let scrollXStyle: React.CSSProperties;
  let scrollYStyle: React.CSSProperties;
  let scrollTableStyle: React.CSSProperties;

  if (fixHeader) {
    scrollYStyle = {
      overflowY: hasData ? 'scroll' : 'auto',
      maxHeight: scroll.y,
    };
  }

  if (horizonScroll) {
    scrollXStyle = { overflowX: 'auto' };
    // When no vertical scrollbar, should hide it
    // https://github.com/ant-design/ant-design/pull/20705
    // https://github.com/ant-design/ant-design/issues/21879
    if (!fixHeader) {
      scrollYStyle = { overflowY: 'hidden' };
    }
    scrollTableStyle = {
      width: mergedScrollX === true ? 'auto' : mergedScrollX,
      minWidth: '100%',
    };
  }

  const onColumnResize = React.useCallback((columnKey: React.Key, width: number) => {
    if (isVisible(fullTableRef.current)) {
      updateColsWidths(widths => {
        if (widths.get(columnKey) !== width) {
          const newWidths = new Map(widths);
          newWidths.set(columnKey, width);
          return newWidths;
        }
        return widths;
      });
    }
  }, []);

  const [setScrollTarget, getScrollTarget] = useTimeoutLock(null);

  function forceScroll(scrollLeft: number, target: HTMLDivElement | ((left: number) => void)) {
    if (!target) {
      return;
    }
    if (typeof target === 'function') {
      target(scrollLeft);
    } else if (target.scrollLeft !== scrollLeft) {
      target.scrollLeft = scrollLeft;

      // Delay to force scroll position if not sync
      // ref: https://github.com/ant-design/ant-design/issues/37179
      if (target.scrollLeft !== scrollLeft) {
        setTimeout(() => {
          target.scrollLeft = scrollLeft;
        }, 0);
      }
    }
  }

  const onInternalScroll = useEvent(
    ({ currentTarget, scrollLeft }: { currentTarget: HTMLElement; scrollLeft?: number }) => {
      const isRTL = direction === 'rtl';
      const mergedScrollLeft =
        typeof scrollLeft === 'number' ? scrollLeft : currentTarget.scrollLeft;

      const compareTarget = currentTarget || EMPTY_SCROLL_TARGET;
      if (!getScrollTarget() || getScrollTarget() === compareTarget) {
        setScrollTarget(compareTarget);

        forceScroll(mergedScrollLeft, scrollHeaderRef.current);
        forceScroll(mergedScrollLeft, scrollBodyRef.current);
        forceScroll(mergedScrollLeft, scrollSummaryRef.current);
        forceScroll(mergedScrollLeft, stickyRef.current?.setScrollLeft);
      }

      const measureTarget = currentTarget || scrollHeaderRef.current;
      if (measureTarget) {
        const scrollWidth =
          typeof mergedScrollX === 'number' ? mergedScrollX : measureTarget.scrollWidth;
        const clientWidth = measureTarget.clientWidth;
        // There is no space to scroll
        if (scrollWidth === clientWidth) {
          setPingedLeft(false);
          setPingedRight(false);
          return;
        }
        if (isRTL) {
          setPingedLeft(-mergedScrollLeft < scrollWidth - clientWidth);
          setPingedRight(-mergedScrollLeft > 0);
        } else {
          setPingedLeft(mergedScrollLeft > 0);
          setPingedRight(mergedScrollLeft < scrollWidth - clientWidth);
        }
      }
    },
  );

  const onBodyScroll = useEvent((e: React.UIEvent<HTMLDivElement>) => {
    onInternalScroll(e);
    onScroll?.(e);
  });

  const triggerOnScroll = () => {
    if (horizonScroll && scrollBodyRef.current) {
      onInternalScroll({
        currentTarget: (scrollBodyRef.current as any).nativeElement || scrollBodyRef.current,
      } as React.UIEvent<HTMLDivElement>);
    } else {
      setPingedLeft(false);
      setPingedRight(false);
    }
  };

  const onFullTableResize = ({ width }) => {
    stickyRef.current?.checkScrollBarVisible();
    let mergedWidth = fullTableRef.current ? fullTableRef.current.offsetWidth : width;
    if (useInternalHooks && getContainerWidth && fullTableRef.current) {
      mergedWidth = getContainerWidth(fullTableRef.current, mergedWidth) || mergedWidth;
    }

    if (mergedWidth !== componentWidth) {
      triggerOnScroll();
      setComponentWidth(mergedWidth);
    }
  };

  // Sync scroll bar when init or `horizonScroll`, `data` and `columns.length` changed
  const mounted = React.useRef(false);
  React.useEffect(() => {
    // onFullTableResize will be trigger once when ResizeObserver is mounted
    // This will reduce one duplicated triggerOnScroll time
    if (mounted.current) {
      triggerOnScroll();
    }
  }, [horizonScroll, data, columns.length]);
  React.useEffect(() => {
    mounted.current = true;
  }, []);

  // ===================== Effects ======================
  const [scrollbarSize, setScrollbarSize] = React.useState(0);
  const [supportSticky, setSupportSticky] = React.useState(true); // Only IE not support, we mark as support first

  React.useEffect(() => {
    if (!tailor || !useInternalHooks) {
      if (scrollBodyRef.current instanceof Element) {
        setScrollbarSize(getTargetScrollBarSize(scrollBodyRef.current).width);
      } else {
        setScrollbarSize(getTargetScrollBarSize(scrollBodyContainerRef.current).width);
      }
    }
    setSupportSticky(isStyleSupport('position', 'sticky'));
  }, []);

  // ================== INTERNAL HOOKS ==================
  React.useEffect(() => {
    if (useInternalHooks && internalRefs) {
      internalRefs.body.current = scrollBodyRef.current;
    }
  });

  // ========================================================================
  // ==                               Render                               ==
  // ========================================================================
  // =================== Render: Func ===================
  const renderFixedHeaderTable = React.useCallback<FixedHeaderProps<RecordType>['children']>(
    fixedHolderPassProps => (
      <>
        <Header {...fixedHolderPassProps} />
        {fixFooter === 'top' && <Footer {...fixedHolderPassProps}>{summaryNode}</Footer>}
      </>
    ),
    [fixFooter, summaryNode],
  );

  const renderFixedFooterTable = React.useCallback<FixedHeaderProps<RecordType>['children']>(
    fixedHolderPassProps => <Footer {...fixedHolderPassProps}>{summaryNode}</Footer>,
    [summaryNode],
  );

  // =================== Render: Node ===================
  const TableComponent = getComponent(['table'], 'table');

  // Table layout
  const mergedTableLayout = React.useMemo<TableLayout>(() => {
    if (tableLayout) {
      return tableLayout;
    }
    // https://github.com/ant-design/ant-design/issues/25227
    // When scroll.x is max-content, no need to fix table layout
    // it's width should stretch out to fit content
    if (fixColumn) {
      return mergedScrollX === 'max-content' ? 'auto' : 'fixed';
    }
    if (fixHeader || isSticky || flattenColumns.some(({ ellipsis }) => ellipsis)) {
      return 'fixed';
    }
    return 'auto';
  }, [fixHeader, fixColumn, flattenColumns, tableLayout, isSticky]);

  let groupTableNode: React.ReactNode;

  // Header props
  const headerProps = {
    colWidths,
    columCount: flattenColumns.length,
    stickyOffsets,
    onHeaderRow,
    fixHeader,
    scroll,
  };

  // Empty
  const emptyNode: React.ReactNode = React.useMemo(() => {
    if (hasData) {
      return null;
    }

    if (typeof emptyText === 'function') {
      return emptyText();
    }
    return emptyText;
  }, [hasData, emptyText]);

  // Body
  const bodyTable = (
    <Body data={mergedData} measureColumnWidth={fixHeader || horizonScroll || isSticky} />
  );

  const bodyColGroup = (
    <ColGroup colWidths={flattenColumns.map(({ width }) => width)} columns={flattenColumns} />
  );

  const captionElement =
    caption !== null && caption !== undefined ? (
      <caption className={`${prefixCls}-caption`}>{caption}</caption>
    ) : undefined;

  const dataProps = pickAttrs(props, { data: true });
  const ariaProps = pickAttrs(props, { aria: true });

  if (fixHeader || isSticky) {
    // >>>>>> Fixed Header
    let bodyContent: React.ReactNode;

    if (typeof customizeScrollBody === 'function') {
      bodyContent = customizeScrollBody(mergedData, {
        scrollbarSize,
        ref: scrollBodyRef,
        onScroll: onInternalScroll,
      });

      headerProps.colWidths = flattenColumns.map(({ width }, index) => {
        const colWidth =
          index === flattenColumns.length - 1 ? (width as number) - scrollbarSize : width;
        if (typeof colWidth === 'number' && !Number.isNaN(colWidth)) {
          return colWidth;
        }

        if (process.env.NODE_ENV !== 'production') {
          warning(
            props.columns.length === 0,
            'When use `components.body` with render props. Each column should have a fixed `width` value.',
          );
        }
        return 0;
      }) as number[];
    } else {
      bodyContent = (
        <div
          style={{
            ...scrollXStyle,
            ...scrollYStyle,
          }}
          onScroll={onBodyScroll}
          ref={scrollBodyRef}
          className={classNames(`${prefixCls}-body`)}
        >
          <TableComponent
            style={{
              ...scrollTableStyle,
              tableLayout: mergedTableLayout,
            }}
            {...ariaProps}
          >
            {captionElement}
            {bodyColGroup}
            {bodyTable}
            {!fixFooter && summaryNode && (
              <Footer stickyOffsets={stickyOffsets} flattenColumns={flattenColumns}>
                {summaryNode}
              </Footer>
            )}
          </TableComponent>
        </div>
      );
    }

    // Fixed holder share the props
    const fixedHolderProps = {
      noData: !mergedData.length,
      maxContentScroll: horizonScroll && mergedScrollX === 'max-content',
      ...headerProps,
      ...columnContext,
      direction,
      stickyClassName,
      onScroll: onInternalScroll,
    };

    groupTableNode = (
      <>
        {/* Header Table */}
        {showHeader !== false && (
          <FixedHolder
            {...fixedHolderProps}
            stickyTopOffset={offsetHeader}
            className={`${prefixCls}-header`}
            ref={scrollHeaderRef}
          >
            {renderFixedHeaderTable}
          </FixedHolder>
        )}

        {/* Body Table */}
        {bodyContent}

        {/* Summary Table */}
        {fixFooter && fixFooter !== 'top' && (
          <FixedHolder
            {...fixedHolderProps}
            stickyBottomOffset={offsetSummary}
            className={`${prefixCls}-summary`}
            ref={scrollSummaryRef}
          >
            {renderFixedFooterTable}
          </FixedHolder>
        )}

        {isSticky && scrollBodyRef.current && scrollBodyRef.current instanceof Element && (
          <StickyScrollBar
            ref={stickyRef}
            offsetScroll={offsetScroll}
            scrollBodyRef={scrollBodyRef}
            onScroll={onInternalScroll}
            container={container}
          />
        )}
      </>
    );
  } else {
    // >>>>>> Unique table
    groupTableNode = (
      <div
        style={{
          ...scrollXStyle,
          ...scrollYStyle,
        }}
        className={classNames(`${prefixCls}-content`)}
        onScroll={onInternalScroll}
        ref={scrollBodyRef}
      >
        <TableComponent
          style={{ ...scrollTableStyle, tableLayout: mergedTableLayout }}
          {...ariaProps}
        >
          {captionElement}
          {bodyColGroup}
          {showHeader !== false && <Header {...headerProps} {...columnContext} />}
          {bodyTable}
          {summaryNode && (
            <Footer stickyOffsets={stickyOffsets} flattenColumns={flattenColumns}>
              {summaryNode}
            </Footer>
          )}
        </TableComponent>
      </div>
    );
  }

  let fullTable = (
    <div
      className={classNames(prefixCls, className, {
        [`${prefixCls}-rtl`]: direction === 'rtl',
        [`${prefixCls}-ping-left`]: pingedLeft,
        [`${prefixCls}-ping-right`]: pingedRight,
        [`${prefixCls}-layout-fixed`]: tableLayout === 'fixed',
        [`${prefixCls}-fixed-header`]: fixHeader,
        /** No used but for compatible */
        [`${prefixCls}-fixed-column`]: fixColumn,
        [`${prefixCls}-fixed-column-gapped`]: fixColumn && hasGapFixed,
        [`${prefixCls}-scroll-horizontal`]: horizonScroll,
        [`${prefixCls}-has-fix-left`]: flattenColumns[0] && flattenColumns[0].fixed,
        [`${prefixCls}-has-fix-right`]:
          flattenColumns[flattenColumns.length - 1] &&
          flattenColumns[flattenColumns.length - 1].fixed === 'right',
      })}
      style={style}
      id={id}
      ref={fullTableRef}
      {...dataProps}
    >
      {title && <Panel className={`${prefixCls}-title`}>{title(mergedData)}</Panel>}
      <div ref={scrollBodyContainerRef} className={`${prefixCls}-container`}>
        {groupTableNode}
      </div>
      {footer && <Panel className={`${prefixCls}-footer`}>{footer(mergedData)}</Panel>}
    </div>
  );

  if (horizonScroll) {
    fullTable = <ResizeObserver onResize={onFullTableResize}>{fullTable}</ResizeObserver>;
  }

  const fixedInfoList = useFixedInfo(flattenColumns, stickyOffsets, direction);

  const TableContextValue = React.useMemo(
    () => ({
      // Scroll
      scrollX: mergedScrollX,

      // Table
      prefixCls,
      getComponent,
      scrollbarSize,
      direction,
      fixedInfoList,
      isSticky,
      supportSticky,

      componentWidth,
      fixHeader,
      fixColumn,
      horizonScroll,

      // Body
      tableLayout: mergedTableLayout,
      rowClassName,
      expandedRowClassName: expandableConfig.expandedRowClassName,
      expandIcon: mergedExpandIcon,
      expandableType,
      expandRowByClick: expandableConfig.expandRowByClick,
      expandedRowRender: expandableConfig.expandedRowRender,
      onTriggerExpand,
      expandIconColumnIndex: expandableConfig.expandIconColumnIndex,
      indentSize: expandableConfig.indentSize,
      allColumnsFixedLeft: flattenColumns.every(col => col.fixed === 'left'),
      emptyNode,

      // Column
      columns,
      flattenColumns,
      onColumnResize,

      // Row
      hoverStartRow: startRow,
      hoverEndRow: endRow,
      onHover,
      rowExpandable: expandableConfig.rowExpandable,
      onRow,

      getRowKey,
      expandedKeys: mergedExpandedKeys,
      childrenColumnName: mergedChildrenColumnName,

      rowHoverable,
    }),
    [
      // Scroll
      mergedScrollX,

      // Table
      prefixCls,
      getComponent,
      scrollbarSize,
      direction,
      fixedInfoList,
      isSticky,
      supportSticky,

      componentWidth,
      fixHeader,
      fixColumn,
      horizonScroll,

      // Body
      mergedTableLayout,
      rowClassName,
      expandableConfig.expandedRowClassName,
      mergedExpandIcon,
      expandableType,
      expandableConfig.expandRowByClick,
      expandableConfig.expandedRowRender,
      onTriggerExpand,
      expandableConfig.expandIconColumnIndex,
      expandableConfig.indentSize,
      emptyNode,

      // Column
      columns,
      flattenColumns,
      onColumnResize,

      // Row
      startRow,
      endRow,
      onHover,
      expandableConfig.rowExpandable,
      onRow,

      getRowKey,
      mergedExpandedKeys,
      mergedChildrenColumnName,

      rowHoverable,
    ],
  );

  return <TableContext.Provider value={TableContextValue}>{fullTable}</TableContext.Provider>;
}

export type ForwardGenericTable = (<RecordType extends DefaultRecordType = any>(
  props: TableProps<RecordType> & React.RefAttributes<Reference>,
) => React.ReactElement) & { displayName?: string };

const RefTable = React.forwardRef(Table) as ForwardGenericTable;

if (process.env.NODE_ENV !== 'production') {
  RefTable.displayName = 'Table';
}

export function genTable(shouldTriggerRender?: CompareProps<typeof Table>) {
  return makeImmutable(RefTable, shouldTriggerRender) as ForwardGenericTable;
}

const ImmutableTable = genTable();
type ImmutableTableType = typeof ImmutableTable & {
  EXPAND_COLUMN: typeof EXPAND_COLUMN;
  INTERNAL_HOOKS: typeof INTERNAL_HOOKS;
  Column: typeof Column;
  ColumnGroup: typeof ColumnGroup;
  Summary: typeof FooterComponents;
};

(ImmutableTable as ImmutableTableType).EXPAND_COLUMN = EXPAND_COLUMN;

(ImmutableTable as ImmutableTableType).INTERNAL_HOOKS = INTERNAL_HOOKS;

(ImmutableTable as ImmutableTableType).Column = Column;

(ImmutableTable as ImmutableTableType).ColumnGroup = ColumnGroup;

(ImmutableTable as ImmutableTableType).Summary = FooterComponents;

export default ImmutableTable as ImmutableTableType;
