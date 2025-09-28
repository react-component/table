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
import { clsx } from 'clsx';
import ResizeObserver from '@rc-component/resize-observer';
import { getTargetScrollBarSize } from '@rc-component/util/lib/getScrollBarSize';
import useEvent from '@rc-component/util/lib/hooks/useEvent';
import pickAttrs from '@rc-component/util/lib/pickAttrs';
import getValue from '@rc-component/util/lib/utils/get';
import warning from '@rc-component/util/lib/warning';
import * as React from 'react';
import Body from './Body';
import ColGroup from './ColGroup';
import { EXPAND_COLUMN, INTERNAL_HOOKS } from './constant';
import TableContext, { makeImmutable, type ScrollInfoType } from './context/TableContext';
import type { FixedHeaderProps } from './FixedHolder';
import FixedHolder from './FixedHolder';
import Footer, { FooterComponents } from './Footer';
import type { SummaryProps } from './Footer/Summary';
import Summary from './Footer/Summary';
import Header from './Header/Header';
import useColumns from './hooks/useColumns';
import useExpand from './hooks/useExpand';
import useFixedInfo from './hooks/useFixedInfo';
import { useTimeoutLock } from './hooks/useFrame';
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
import { getColumnsKey, validateValue, validNumberValue } from './utils/valueUtil';
import { getDOM } from '@rc-component/util/lib/Dom/findDOMNode';
import isEqual from '@rc-component/util/lib/isEqual';
import useLayoutEffect from '@rc-component/util/lib/hooks/useLayoutEffect';

export const DEFAULT_PREFIX = 'rc-table';

// Used for conditions cache
const EMPTY_DATA = [];

// Used for customize scroll
const EMPTY_SCROLL_TARGET = {};

export type SemanticName = 'section' | 'title' | 'footer' | 'content';
export type ComponentsSemantic = 'wrapper' | 'cell' | 'row';

export interface TableProps<RecordType = any>
  extends Omit<LegacyExpandableProps<RecordType>, 'showExpandColumn'> {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  classNames?: Partial<Record<SemanticName, string>> & {
    body?: Partial<Record<ComponentsSemantic, string>>;
    header?: Partial<Record<ComponentsSemantic, string>>;
  };
  styles?: Partial<Record<SemanticName, React.CSSProperties>> & {
    body?: Partial<Record<ComponentsSemantic, React.CSSProperties>>;
    header?: Partial<Record<ComponentsSemantic, React.CSSProperties>>;
  };
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
  /**
   * @private Internal usage, may remove by refactor.
   *
   * !!! DO NOT USE IN PRODUCTION ENVIRONMENT !!!
   */
  measureRowRender?: (measureRow: React.ReactNode) => React.ReactNode;
}

function defaultEmpty() {
  return 'No Data';
}

const Table = <RecordType extends DefaultRecordType>(
  tableProps: TableProps<RecordType>,
  ref: React.Ref<Reference>,
) => {
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
    classNames,
    styles,
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

    // Measure Row
    measureRowRender,

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

  const [columns, flattenColumns, flattenScrollX] = useColumns(
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
    () => ({ columns, flattenColumns }),
    [columns, flattenColumns],
  );

  // ======================= Refs =======================
  const fullTableRef = React.useRef<HTMLDivElement>(null);
  const scrollHeaderRef = React.useRef<HTMLDivElement>(null);
  const scrollBodyRef = React.useRef<HTMLDivElement>(null);
  const scrollBodyContainerRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => {
    return {
      nativeElement: fullTableRef.current,
      scrollTo: config => {
        if (scrollBodyRef.current instanceof HTMLElement) {
          // Native scroll
          const { index, top, key, offset } = config;

          if (validNumberValue(top)) {
            // In top mode, offset is ignored
            scrollBodyRef.current?.scrollTo({ top });
          } else {
            const mergedKey = key ?? getRowKey(mergedData[index]);
            const targetElement = scrollBodyRef.current.querySelector(
              `[data-row-key="${mergedKey}"]`,
            );
            if (targetElement) {
              if (!offset) {
                // No offset, use scrollIntoView for default behavior
                targetElement.scrollIntoView();
              } else {
                // With offset, use element's offsetTop + offset
                const elementTop = (targetElement as HTMLElement).offsetTop;
                scrollBodyRef.current.scrollTo({ top: elementTop + offset });
              }
            }
          }
        } else if ((scrollBodyRef.current as any)?.scrollTo) {
          // Pass to proxy
          (scrollBodyRef.current as any).scrollTo(config);
        }
      },
    };
  });

  // ====================== Scroll ======================
  const scrollSummaryRef = React.useRef<HTMLDivElement>(null);
  const [shadowStart, setShadowStart] = React.useState(false);
  const [shadowEnd, setShadowEnd] = React.useState(false);
  const [colsWidths, updateColsWidths] = React.useState(new Map<React.Key, number>());

  // Convert map to number width
  const colsKeys = getColumnsKey(flattenColumns);
  const pureColWidths = colsKeys.map(columnKey => colsWidths.get(columnKey));
  const colWidths = React.useMemo(() => pureColWidths, [pureColWidths.join('_')]);
  const stickyOffsets = useStickyOffsets(colWidths, flattenColumns);
  const fixHeader = scroll && validateValue(scroll.y);
  const horizonScroll = (scroll && validateValue(mergedScrollX)) || Boolean(expandableConfig.fixed);
  const fixColumn = horizonScroll && flattenColumns.some(({ fixed }) => fixed);

  // Sticky
  const stickyRef = React.useRef<{
    setScrollLeft: (left: number) => void;
    checkScrollBarVisible: () => void;
  }>(null);

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
    updateColsWidths(widths => {
      if (widths.get(columnKey) !== width) {
        const newWidths = new Map(widths);
        newWidths.set(columnKey, width);
        return newWidths;
      }
      return widths;
    });
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

  const [scrollInfo, setScrollInfo] = React.useState<ScrollInfoType>([0, 0]);

  const onInternalScroll = useEvent(
    ({ currentTarget, scrollLeft }: { currentTarget: HTMLElement; scrollLeft?: number }) => {
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
          // Should use mergedScrollX in virtual table(useInternalHooks && tailor === true)
          useInternalHooks && tailor && typeof mergedScrollX === 'number'
            ? mergedScrollX
            : measureTarget.scrollWidth;
        const clientWidth = measureTarget.clientWidth;

        const absScrollStart = Math.abs(mergedScrollLeft);
        setScrollInfo(ori => {
          const nextScrollInfo: ScrollInfoType = [absScrollStart, scrollWidth - clientWidth];
          return isEqual(ori, nextScrollInfo) ? ori : nextScrollInfo;
        });

        // There is no space to scroll
        if (scrollWidth === clientWidth) {
          setShadowStart(false);
          setShadowEnd(false);
          return;
        }
        setShadowStart(absScrollStart > 0);
        setShadowEnd(absScrollStart < scrollWidth - clientWidth);
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
        currentTarget: getDOM(scrollBodyRef.current) as HTMLElement,
        scrollLeft: scrollBodyRef.current?.scrollLeft,
      });
    } else {
      setShadowStart(false);
      setShadowEnd(false);
    }
  };

  const onFullTableResize = (offsetWidth?: number) => {
    stickyRef.current?.checkScrollBarVisible();
    let mergedWidth = offsetWidth ?? fullTableRef.current?.offsetWidth ?? 0;
    if (useInternalHooks && getContainerWidth && fullTableRef.current) {
      mergedWidth = getContainerWidth(fullTableRef.current, mergedWidth) || mergedWidth;
    }

    if (mergedWidth !== componentWidth) {
      triggerOnScroll();
      setComponentWidth(mergedWidth);
    }
  };

  // fix https://github.com/ant-design/ant-design/issues/49279
  useLayoutEffect(() => {
    if (horizonScroll) {
      onFullTableResize();
    }
  }, [horizonScroll]);

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

  useLayoutEffect(() => {
    if (!tailor || !useInternalHooks) {
      if (scrollBodyRef.current instanceof Element) {
        setScrollbarSize(getTargetScrollBarSize(scrollBodyRef.current).width);
      } else {
        setScrollbarSize(getTargetScrollBarSize(scrollBodyContainerRef.current).width);
      }
    }
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
  const emptyNode = React.useMemo<React.ReactNode>(() => {
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
          className={`${prefixCls}-body`}
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
      scrollX: mergedScrollX,
      tableLayout: mergedTableLayout,
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
            colGroup={bodyColGroup}
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
            colGroup={bodyColGroup}
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
            direction={direction}
          />
        )}
      </>
    );
  } else {
    // >>>>>> Unique table
    groupTableNode = (
      <div
        style={{ ...scrollXStyle, ...scrollYStyle, ...styles?.content }}
        className={clsx(`${prefixCls}-content`, classNames?.content)}
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

  const tableStyle = {
    ...style,
  };

  // Add css var for sticky header `zIndex` calc
  if (isSticky) {
    tableStyle['--columns-count'] = flattenColumns.length;
  }

  let fullTable = (
    <div
      className={clsx(prefixCls, className, {
        [`${prefixCls}-rtl`]: direction === 'rtl',
        [`${prefixCls}-fix-start-shadow`]: horizonScroll,
        [`${prefixCls}-fix-end-shadow`]: horizonScroll,
        [`${prefixCls}-fix-start-shadow-show`]: horizonScroll && shadowStart,
        [`${prefixCls}-fix-end-shadow-show`]: horizonScroll && shadowEnd,
        [`${prefixCls}-layout-fixed`]: tableLayout === 'fixed',
        [`${prefixCls}-fixed-header`]: fixHeader,
        /** No used but for compatible */
        [`${prefixCls}-fixed-column`]: fixColumn,
        [`${prefixCls}-scroll-horizontal`]: horizonScroll,
        [`${prefixCls}-has-fix-start`]: flattenColumns[0]?.fixed,
        [`${prefixCls}-has-fix-end`]: flattenColumns[flattenColumns.length - 1]?.fixed === 'end',
      })}
      style={tableStyle}
      id={id}
      ref={fullTableRef}
      {...dataProps}
    >
      {title && (
        <Panel className={clsx(`${prefixCls}-title`, classNames?.title)} style={styles?.title}>
          {title(mergedData)}
        </Panel>
      )}
      <div
        ref={scrollBodyContainerRef}
        className={clsx(`${prefixCls}-container`, classNames?.section)}
        style={styles?.section}
      >
        {groupTableNode}
      </div>
      {footer && (
        <Panel className={clsx(`${prefixCls}-footer`, classNames?.footer)} style={styles?.footer}>
          {footer(mergedData)}
        </Panel>
      )}
    </div>
  );

  if (horizonScroll) {
    fullTable = (
      <ResizeObserver onResize={({ offsetWidth }) => onFullTableResize(offsetWidth)}>
        {fullTable}
      </ResizeObserver>
    );
  }

  const fixedInfoList = useFixedInfo(flattenColumns, stickyOffsets);

  const TableContextValue = React.useMemo(
    () => ({
      // Scroll
      scrollX: mergedScrollX,
      scrollInfo,

      classNames,
      styles,

      // Table
      prefixCls,
      getComponent,
      scrollbarSize,
      direction,
      fixedInfoList,
      isSticky,

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
      expandedRowOffset: expandableConfig.expandedRowOffset,
      onTriggerExpand,
      expandIconColumnIndex: expandableConfig.expandIconColumnIndex,
      indentSize: expandableConfig.indentSize,
      allColumnsFixedLeft: flattenColumns.every(col => col.fixed === 'start'),
      emptyNode,

      // Column
      columns,
      flattenColumns,
      onColumnResize,
      colWidths,

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

      // Measure Row
      measureRowRender,
    }),
    [
      // Scroll
      mergedScrollX,
      scrollInfo,
      classNames,
      styles,

      // Table
      prefixCls,
      getComponent,
      scrollbarSize,
      direction,
      fixedInfoList,
      isSticky,

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
      expandableConfig.expandedRowOffset,
      onTriggerExpand,
      expandableConfig.expandIconColumnIndex,
      expandableConfig.indentSize,
      emptyNode,

      // Column
      columns,
      flattenColumns,
      onColumnResize,
      colWidths,

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

      measureRowRender,
    ],
  );

  return <TableContext.Provider value={TableContextValue}>{fullTable}</TableContext.Provider>;
};

export type ForwardGenericTable = (<RecordType extends DefaultRecordType = any>(
  props: TableProps<RecordType> & React.RefAttributes<Reference>,
) => React.ReactElement<any>) & { displayName?: string };

const RefTable = React.forwardRef(Table) as ForwardGenericTable;

if (process.env.NODE_ENV !== 'production') {
  RefTable.displayName = 'Table';
}

export const genTable = (shouldTriggerRender?: CompareProps<ForwardGenericTable>) => {
  return makeImmutable(RefTable, shouldTriggerRender);
};

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
