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

import * as React from 'react';
import isVisible from 'rc-util/lib/Dom/isVisible';
import classNames from 'classnames';
import shallowEqual from 'shallowequal';
import warning from 'rc-util/lib/warning';
import ResizeObserver from 'rc-resize-observer';
import getScrollBarSize from 'rc-util/lib/getScrollBarSize';
import ColumnGroup from './sugar/ColumnGroup';
import Column from './sugar/Column';
import FixedHeader from './Header/FixedHeader';
import Header from './Header/Header';
import {
  GetRowKey,
  ColumnsType,
  TableComponents,
  Key,
  DefaultRecordType,
  TriggerEventHandler,
  GetComponentProps,
  ExpandableConfig,
  LegacyExpandableProps,
  GetComponent,
  PanelRender,
  TableLayout,
  ExpandableType,
  RowClassName,
  CustomizeComponent,
  ColumnType,
  CustomizeScrollBody,
  TableSticky,
} from './interface';
import TableContext from './context/TableContext';
import BodyContext from './context/BodyContext';
import Body from './Body';
import useColumns from './hooks/useColumns';
import { useLayoutState, useTimeoutLock } from './hooks/useFrame';
import {
  getPathValue,
  mergeObject,
  validateValue,
  getColumnsKey,
  isPlainObject,
} from './utils/valueUtil';
import ResizeContext from './context/ResizeContext';
import useStickyOffsets from './hooks/useStickyOffsets';
import ColGroup from './ColGroup';
import { getExpandableProps, getDataAndAriaProps } from './utils/legacyUtil';
import Panel from './Panel';
import Footer, { FooterComponents } from './Footer';
import { findAllChildrenKeys, renderExpandIcon } from './utils/expandUtil';
import { getCellFixedInfo } from './utils/fixUtil';
import StickyScrollBar from './stickyScrollBar';
import useSticky from './hooks/useSticky';

// Used for conditions cache
const EMPTY_DATA = [];

// Used for customize scroll
const EMPTY_SCROLL_TARGET = {};

// Used for body content render
const BODY_CONTENT_TYPE = {
  body: 'body',
  summary: 'summary',
};

export const INTERNAL_HOOKS = 'rc-table-internal-hook';

interface MemoTableContentProps {
  children: React.ReactNode;
  pingLeft: boolean;
  pingRight: boolean;
  props: any;
}

type SummaryRender<RecordType> = (data: RecordType[]) => React.ReactNode;

type SummaryPosition = 'top' | 'bottom';

const MemoTableContent = React.memo<MemoTableContentProps>(
  ({ children }) => children as React.ReactElement,

  (prev, next) => {
    if (!shallowEqual(prev.props, next.props)) {
      return false;
    }

    // No additional render when pinged status change.
    // This is not a bug.
    return prev.pingLeft !== next.pingLeft || prev.pingRight !== next.pingRight;
  },
);

export interface TableProps<RecordType = unknown> extends LegacyExpandableProps<RecordType> {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  data?: RecordType[];
  columns?: ColumnsType<RecordType>;
  rowKey?: string | GetRowKey<RecordType>;
  tableLayout?: TableLayout;

  // Fixed Columns
  scroll?: { x?: number | true | string; y?: number | string };

  // Expandable
  /** Config expand rows */
  expandable?: ExpandableConfig<RecordType>;
  indentSize?: number;
  rowClassName?: string | RowClassName<RecordType>;

  // Additional Part
  title?: PanelRender<RecordType>;
  footer?: PanelRender<RecordType>;
  summary?:
    | SummaryRender<RecordType>
    | {
        render: SummaryRender<RecordType>;
        fixed?: boolean;
        position?: SummaryPosition;
      };

  // Customize
  id?: string;
  showHeader?: boolean;
  components?: TableComponents<RecordType>;
  onRow?: GetComponentProps<RecordType>;
  onHeaderRow?: GetComponentProps<ColumnType<RecordType>[]>;
  emptyText?: React.ReactNode | (() => React.ReactNode);

  direction?: 'ltr' | 'rtl';

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
  internalRefs?: {
    body: React.MutableRefObject<HTMLDivElement>;
  };

  sticky?: boolean | TableSticky;
}

function Table<RecordType extends DefaultRecordType>(props: TableProps<RecordType>) {
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

    // Customize
    id,
    showHeader,
    components,
    emptyText,
    onRow,
    onHeaderRow,

    // Internal
    internalHooks,
    transformColumns,
    internalRefs,

    sticky,
  } = props;

  const mergedData = data || EMPTY_DATA;
  const hasData = !!mergedData.length;

  // ===================== Summary ======================
  let summaryRender: SummaryRender<RecordType> = summary as any;
  let summaryFixed: boolean = false;
  let summaryPosition: SummaryPosition = 'bottom';

  if (typeof summary === 'object' && isPlainObject(summary)) {
    summaryRender = summary.render;
    summaryFixed = summary.fixed || summaryFixed;
    summaryPosition = summary.position || summaryPosition;
  }

  // ===================== Effects ======================
  const [scrollbarSize, setScrollbarSize] = React.useState(0);

  React.useEffect(() => {
    setScrollbarSize(getScrollBarSize());
  });

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
  const mergedComponents = React.useMemo(
    () => mergeObject<TableComponents<RecordType>>(components, {}),
    [components],
  );

  const getComponent = React.useCallback<GetComponent>(
    (path, defaultComponent) =>
      getPathValue<CustomizeComponent, TableComponents<RecordType>>(mergedComponents, path) ||
      defaultComponent,
    [mergedComponents],
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

  // ====================== Expand ======================
  const expandableConfig = getExpandableProps(props);

  const {
    expandIcon,
    expandedRowKeys,
    defaultExpandedRowKeys,
    defaultExpandAllRows,
    expandedRowRender,
    onExpand,
    onExpandedRowsChange,
    expandRowByClick,
    rowExpandable,
    expandIconColumnIndex,
    expandedRowClassName,
    childrenColumnName,
    indentSize,
  } = expandableConfig;

  const mergedExpandIcon = expandIcon || renderExpandIcon;
  const mergedChildrenColumnName = childrenColumnName || 'children';
  const expandableType = React.useMemo<ExpandableType>(() => {
    if (expandedRowRender) {
      return 'row';
    }
    /* eslint-disable no-underscore-dangle */
    /**
     * Fix https://github.com/ant-design/ant-design/issues/21154
     * This is a workaround to not to break current behavior.
     * We can remove follow code after final release.
     *
     * To other developer:
     *  Do not use `__PARENT_RENDER_ICON__` in prod since we will remove this when refactor
     */
    if (
      (props.expandable &&
        internalHooks === INTERNAL_HOOKS &&
        (props.expandable as any).__PARENT_RENDER_ICON__) ||
      mergedData.some(
        record => record && typeof record === 'object' && record[mergedChildrenColumnName],
      )
    ) {
      return 'nest';
    }
    /* eslint-enable */
    return false;
  }, [!!expandedRowRender, mergedData]);

  const [innerExpandedKeys, setInnerExpandedKeys] = React.useState<Key[]>(() => {
    if (defaultExpandedRowKeys) {
      return defaultExpandedRowKeys;
    }
    if (defaultExpandAllRows) {
      return findAllChildrenKeys<RecordType>(mergedData, getRowKey, mergedChildrenColumnName);
    }
    return [];
  });
  const mergedExpandedKeys = React.useMemo(
    () => new Set(expandedRowKeys || innerExpandedKeys || []),
    [expandedRowKeys, innerExpandedKeys],
  );

  const onTriggerExpand: TriggerEventHandler<RecordType> = React.useCallback(
    (record: RecordType) => {
      const key = getRowKey(record, mergedData.indexOf(record));

      let newExpandedKeys: Key[];
      const hasKey = mergedExpandedKeys.has(key);
      if (hasKey) {
        mergedExpandedKeys.delete(key);
        newExpandedKeys = [...mergedExpandedKeys];
      } else {
        newExpandedKeys = [...mergedExpandedKeys, key];
      }

      setInnerExpandedKeys(newExpandedKeys);
      if (onExpand) {
        onExpand(!hasKey, record);
      }
      if (onExpandedRowsChange) {
        onExpandedRowsChange(newExpandedKeys);
      }
    },
    [getRowKey, mergedExpandedKeys, mergedData, onExpand, onExpandedRowsChange],
  );

  // ====================== Column ======================
  const [componentWidth, setComponentWidth] = React.useState(0);

  const [columns, flattenColumns] = useColumns(
    {
      ...props,
      ...expandableConfig,
      expandable: !!expandedRowRender,
      expandedKeys: mergedExpandedKeys,
      getRowKey,
      // https://github.com/ant-design/ant-design/issues/23894
      onTriggerExpand,
      expandIcon: mergedExpandIcon,
      expandIconColumnIndex,
      direction,
    },
    internalHooks === INTERNAL_HOOKS ? transformColumns : null,
  );

  const columnContext = React.useMemo(
    () => ({
      columns,
      flattenColumns,
    }),
    [columns, flattenColumns],
  );

  // ====================== Scroll ======================
  const fullTableRef = React.useRef<HTMLDivElement>();
  const scrollHeaderRef = React.useRef<HTMLDivElement>();
  const scrollBodyRef = React.useRef<HTMLDivElement>();
  const scrollSummaryRef = React.useRef<HTMLDivElement>();
  const [pingedLeft, setPingedLeft] = React.useState(false);
  const [pingedRight, setPingedRight] = React.useState(false);
  const [colsWidths, updateColsWidths] = useLayoutState(new Map<React.Key, number>());

  // Convert map to number width
  const colsKeys = getColumnsKey(flattenColumns);
  const pureColWidths = colsKeys.map(columnKey => colsWidths.get(columnKey));
  const colWidths = React.useMemo(() => pureColWidths, [pureColWidths.join('_')]);
  const stickyOffsets = useStickyOffsets(colWidths, flattenColumns.length, direction);
  const fixHeader = scroll && validateValue(scroll.y);
  const horizonScroll = scroll && validateValue(scroll.x);
  const fixColumn = horizonScroll && flattenColumns.some(({ fixed }) => fixed);

  // Sticky
  const stickyRef = React.useRef<{ setScrollLeft: (left: number) => void }>();
  const { isSticky, offsetHeader, offsetScroll, stickyClassName, container } = useSticky(
    sticky,
    prefixCls,
  );

  let scrollXStyle: React.CSSProperties;
  let scrollYStyle: React.CSSProperties;
  let scrollTableStyle: React.CSSProperties;

  if (fixHeader) {
    scrollYStyle = {
      overflowY: 'scroll',
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
      width: scroll.x === true ? 'auto' : scroll.x,
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
      // eslint-disable-next-line no-param-reassign
      target.scrollLeft = scrollLeft;
    }
  }

  const onScroll = ({
    currentTarget,
    scrollLeft,
  }: {
    currentTarget: HTMLElement;
    scrollLeft?: number;
  }) => {
    const mergedScrollLeft = typeof scrollLeft === 'number' ? scrollLeft : currentTarget.scrollLeft;

    const compareTarget = currentTarget || EMPTY_SCROLL_TARGET;
    if (!getScrollTarget() || getScrollTarget() === compareTarget) {
      setScrollTarget(compareTarget);

      forceScroll(mergedScrollLeft, scrollHeaderRef.current);
      forceScroll(mergedScrollLeft, scrollBodyRef.current);
      forceScroll(mergedScrollLeft, scrollSummaryRef.current);
      forceScroll(mergedScrollLeft, stickyRef.current?.setScrollLeft);
    }

    if (currentTarget) {
      const { scrollWidth, clientWidth } = currentTarget;
      setPingedLeft(mergedScrollLeft > 0);
      setPingedRight(mergedScrollLeft < scrollWidth - clientWidth);
    }
  };

  const triggerOnScroll = () => {
    if (scrollBodyRef.current) {
      onScroll({ currentTarget: scrollBodyRef.current } as React.UIEvent<HTMLDivElement>);
    }
  };

  const onFullTableResize = ({ width }) => {
    triggerOnScroll();
    setComponentWidth(fullTableRef.current ? fullTableRef.current.offsetWidth : width);
  };

  // Sync scroll bar when init or `horizonScroll` changed
  React.useEffect(() => triggerOnScroll, []);
  React.useEffect(() => {
    if (horizonScroll) {
      triggerOnScroll();
    }
  }, [horizonScroll]);

  // ================== INTERNAL HOOKS ==================
  React.useEffect(() => {
    if (internalHooks === INTERNAL_HOOKS && internalRefs) {
      internalRefs.body.current = scrollBodyRef.current;
    }
  });

  // ====================== Render ======================
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
      return scroll.x === 'max-content' ? 'auto' : 'fixed';
    }
    if (fixHeader || flattenColumns.some(({ ellipsis }) => ellipsis)) {
      return 'fixed';
    }
    return 'auto';
  }, [fixHeader, fixColumn, flattenColumns, tableLayout]);

  let groupTableNode: React.ReactNode;

  // Header props
  const headerProps = {
    colWidths,
    columCount: flattenColumns.length,
    stickyOffsets,
    onHeaderRow,
    fixHeader,
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
    <Body
      data={mergedData}
      measureColumnWidth={fixHeader || horizonScroll || isSticky}
      expandedKeys={mergedExpandedKeys}
      rowExpandable={rowExpandable}
      getRowKey={getRowKey}
      onRow={onRow}
      emptyNode={emptyNode}
      childrenColumnName={mergedChildrenColumnName}
    />
  );

  const bodyColGroup = (
    <ColGroup colWidths={flattenColumns.map(({ width }) => width)} columns={flattenColumns} />
  );

  const footerTable = summaryRender && <Footer>{summaryRender(mergedData)}</Footer>;
  const customizeScrollBody = getComponent(['body']) as CustomizeScrollBody<RecordType>;

  const isTableFixed = fixHeader || isSticky;

  const isSummaryShowTop = isTableFixed && summaryPosition === 'top';

  const getBodyContent = (type: string, mergeSummary?: boolean) => {
    const ref = type === BODY_CONTENT_TYPE.body ? scrollBodyRef : scrollSummaryRef;
    const tableContent = type === BODY_CONTENT_TYPE.body ? bodyTable : footerTable;

    return (
      <div
        ref={ref}
        style={{
          ...scrollXStyle,
          ...(type === BODY_CONTENT_TYPE.body ? scrollYStyle : {}),
        }}
        onScroll={onScroll}
        className={classNames(`${prefixCls}-${type}`)}
      >
        <TableComponent
          style={{
            ...scrollTableStyle,
            tableLayout: mergedTableLayout,
          }}
        >
          {bodyColGroup}
          {tableContent}
          {mergeSummary && type !== BODY_CONTENT_TYPE.summary && footerTable}
        </TableComponent>
      </div>
    );
  };

  if (
    process.env.NODE_ENV !== 'production' &&
    typeof customizeScrollBody === 'function' &&
    hasData &&
    !fixHeader
  ) {
    warning(false, '`components.body` with render props is only work on `scroll.y`.');
  }

  if (isTableFixed) {
    let bodyContent: React.ReactNode;

    if (typeof customizeScrollBody === 'function') {
      bodyContent = customizeScrollBody(mergedData, {
        scrollbarSize,
        ref: scrollBodyRef,
        onScroll,
      });
      headerProps.colWidths = flattenColumns.map(({ width }, index) => {
        const colWidth = index === columns.length - 1 ? (width as number) - scrollbarSize : width;
        if (typeof colWidth === 'number' && !Number.isNaN(colWidth)) {
          return colWidth;
        }
        warning(
          false,
          'When use `components.body` with render props. Each column should have a fixed value.',
        );

        return 0;
      }) as number[];
    } else {
      bodyContent = summaryFixed ? (
        <>
          {footerTable && isSummaryShowTop && getBodyContent(BODY_CONTENT_TYPE.summary)}
          {getBodyContent(BODY_CONTENT_TYPE.body)}
          {footerTable && !isSummaryShowTop && getBodyContent(BODY_CONTENT_TYPE.summary)}
        </>
      ) : (
        getBodyContent(BODY_CONTENT_TYPE.body, true)
      );
    }

    groupTableNode = (
      <>
        {/* Header Table */}
        {showHeader !== false && (
          <FixedHeader
            noData={!mergedData.length}
            {...headerProps}
            {...columnContext}
            direction={direction}
            // Fixed Props
            offsetHeader={offsetHeader}
            stickyClassName={stickyClassName}
            ref={scrollHeaderRef}
            onScroll={onScroll}
          />
        )}

        {/* Body Table */}
        {bodyContent}

        {isSticky && (
          <StickyScrollBar
            ref={stickyRef}
            offsetScroll={offsetScroll}
            scrollBodyRef={scrollBodyRef}
            onScroll={onScroll}
            container={container}
          />
        )}
      </>
    );
  } else {
    groupTableNode = (
      <div
        style={{
          ...scrollXStyle,
          ...scrollYStyle,
        }}
        className={classNames(`${prefixCls}-content`)}
        onScroll={onScroll}
        ref={scrollBodyRef}
      >
        <TableComponent style={{ ...scrollTableStyle, tableLayout: mergedTableLayout }}>
          {bodyColGroup}
          {showHeader !== false && <Header {...headerProps} {...columnContext} />}
          {bodyTable}
          {footerTable}
        </TableComponent>
      </div>
    );
  }

  const ariaProps = getDataAndAriaProps(props);

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
        [`${prefixCls}-scroll-horizontal`]: horizonScroll,
        [`${prefixCls}-has-fix-left`]: flattenColumns[0] && flattenColumns[0].fixed,
        [`${prefixCls}-has-fix-right`]:
          flattenColumns[flattenColumns.length - 1] &&
          flattenColumns[flattenColumns.length - 1].fixed === 'right',
      })}
      style={style}
      id={id}
      ref={fullTableRef}
      {...ariaProps}
    >
      <MemoTableContent
        pingLeft={pingedLeft}
        pingRight={pingedRight}
        props={{ ...props, stickyOffsets, mergedExpandedKeys }}
      >
        {title && <Panel className={`${prefixCls}-title`}>{title(mergedData)}</Panel>}
        <div className={`${prefixCls}-container`}>{groupTableNode}</div>
        {footer && <Panel className={`${prefixCls}-footer`}>{footer(mergedData)}</Panel>}
      </MemoTableContent>
    </div>
  );

  if (horizonScroll) {
    fullTable = <ResizeObserver onResize={onFullTableResize}>{fullTable}</ResizeObserver>;
  }

  const TableContextValue = React.useMemo(
    () => ({
      prefixCls,
      getComponent,
      scrollbarSize,
      direction,
      fixedInfoList: flattenColumns.map((_, colIndex) =>
        getCellFixedInfo(colIndex, colIndex, flattenColumns, stickyOffsets, direction),
      ),
      isSticky,
      isSummaryShowTop,
    }),
    [
      prefixCls,
      getComponent,
      scrollbarSize,
      direction,
      flattenColumns,
      stickyOffsets,
      direction,
      isSticky,
      isSummaryShowTop,
    ],
  );

  const BodyContextValue = React.useMemo(
    () => ({
      ...columnContext,
      tableLayout: mergedTableLayout,
      rowClassName,
      expandedRowClassName,
      componentWidth,
      fixHeader,
      fixColumn,
      horizonScroll,
      expandIcon: mergedExpandIcon,
      expandableType,
      expandRowByClick,
      expandedRowRender,
      onTriggerExpand,
      expandIconColumnIndex,
      indentSize,
    }),
    [
      columnContext,
      mergedTableLayout,
      rowClassName,
      expandedRowClassName,
      componentWidth,
      fixHeader,
      fixColumn,
      horizonScroll,
      mergedExpandIcon,
      expandableType,
      expandRowByClick,
      expandedRowRender,
      onTriggerExpand,
      expandIconColumnIndex,
      indentSize,
    ],
  );

  const ResizeContextValue = React.useMemo(() => ({ onColumnResize }), [onColumnResize]);

  return (
    <TableContext.Provider value={TableContextValue}>
      <BodyContext.Provider value={BodyContextValue}>
        <ResizeContext.Provider value={ResizeContextValue}>{fullTable}</ResizeContext.Provider>
      </BodyContext.Provider>
    </TableContext.Provider>
  );
}

Table.Column = Column;

Table.ColumnGroup = ColumnGroup;

Table.Summary = FooterComponents;

Table.defaultProps = {
  rowKey: 'key',
  prefixCls: 'rc-table',
  emptyText: () => 'No Data',
};

export default Table;
