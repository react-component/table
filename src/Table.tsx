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
 *  - childrenColumnName
 *
 * Deprecated:
 *  - All expanded props, move into expandable
 */

import * as React from 'react';
import classNames from 'classnames';
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
} from './interface';
import TableContext from './context/TableContext';
import BodyContext from './context/BodyContext';
import Body from './Body';
import useColumns from './hooks/useColumns';
import { useFrameState } from './hooks/useFrame';
import { getPathValue, mergeObject, validateValue, newArr } from './utils/valueUtil';
import ResizeContext from './context/ResizeContext';
import useStickyOffsets from './hooks/useStickyOffsets';
import ColGroup from './ColGroup';
import { getExpandableProps, getDataAndAriaProps } from './utils/legacyUtil';
import Panel from './Panel';
import Footer from './Footer';
import { findAllChildrenKeys, renderExpandIcon } from './utils/expandUtil';

// Used for conditions cache
const EMPTY_DATA = [];
const scrollbarSize = getScrollBarSize();

export interface TableProps<RecordType extends DefaultRecordType>
  extends LegacyExpandableProps<RecordType> {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  data?: RecordType[];
  columns?: ColumnsType<RecordType>;
  rowKey?: string | GetRowKey<RecordType>;
  tableLayout?: TableLayout;

  // Fixed Columns
  scroll?: { x?: number | true | string; y?: number };

  // Expandable
  /** Config expand rows */
  expandable?: ExpandableConfig<RecordType>;
  indentSize?: number;
  rowClassName?: string | RowClassName<RecordType>;

  // Additional Part
  title?: PanelRender<RecordType>;
  footer?: PanelRender<RecordType>;
  summary?: (data: RecordType[]) => React.ReactNode;

  // Customize
  id?: string;
  showHeader?: boolean;
  components?: TableComponents;
  onRow?: GetComponentProps<RecordType>;
  onHeaderRow?: GetComponentProps<ColumnType<RecordType>[]>;
  emptyText?: React.ReactNode | (() => React.ReactNode);
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
    indentSize,

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
  } = props;

  const mergedData = data || EMPTY_DATA;
  const hasData = !!mergedData.length;

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
  const mergedComponents = React.useMemo(() => mergeObject<TableComponents>(components, {}), [
    components,
  ]);

  const getComponent = React.useCallback<GetComponent>(
    (path, defaultComponent) =>
      getPathValue<CustomizeComponent, TableComponents>(mergedComponents, path) || defaultComponent,
    [mergedComponents],
  );

  const getRowKey = React.useMemo<GetRowKey<RecordType>>(() => {
    if (typeof rowKey === 'function') {
      return rowKey;
    }
    return (record: RecordType) => {
      const key = record[rowKey];

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
  } = expandableConfig;

  const mergedExpandIcon = expandIcon || renderExpandIcon;
  const expandableType = React.useMemo<ExpandableType>(() => {
    if (expandedRowRender) {
      return 'row';
    }
    if (mergedData.some(record => 'children' in record)) {
      return 'nest';
    }
    return false;
  }, [!!expandedRowRender, mergedData]);

  const [innerExpandedKeys, setInnerExpandedKeys] = React.useState<Key[]>(() => {
    if (defaultExpandedRowKeys) {
      return defaultExpandedRowKeys;
    }
    if (defaultExpandAllRows) {
      return findAllChildrenKeys<RecordType>(mergedData, getRowKey);
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

  const [columns, flattenColumns] = useColumns({
    ...props,
    ...expandableConfig,
    expandable: !!expandedRowRender,
    expandedKeys: mergedExpandedKeys,
    getRowKey,
    onTriggerExpand,
    expandIcon: mergedExpandIcon,
    expandIconColumnIndex,
  });

  const columnContext = {
    columns,
    flattenColumns,
  };

  // ====================== Scroll ======================
  const scrollHeaderRef = React.useRef<HTMLDivElement>();
  const scrollBodyRef = React.useRef<HTMLDivElement>();
  const [pingedLeft, setPingedLeft] = React.useState(false);
  const [pingedRight, setPingedRight] = React.useState(false);
  const [colWidths, updateColWidths] = useFrameState<number[]>(newArr(flattenColumns.length));
  const stickyOffsets = useStickyOffsets(colWidths, flattenColumns.length);

  const fixHeader = hasData && scroll && validateValue(scroll.y);
  const fixColumn = scroll && validateValue(scroll.x);

  let scrollXStyle: React.CSSProperties;
  let scrollYStyle: React.CSSProperties;
  let scrollTableStyle: React.CSSProperties;

  if (fixHeader) {
    scrollYStyle = {
      overflowY: 'scroll',
      maxHeight: scroll.y,
    };
  }
  if (fixColumn) {
    scrollXStyle = { overflowX: 'scroll' };
    scrollTableStyle = {
      width: scroll.x === true ? 'max-content' : scroll.x,
      minWidth: '100%',
    };
  }

  function onColumnResize(colIndex: number, width: number) {
    updateColWidths((widths: number[]) => {
      const newWidth = widths.slice(0, flattenColumns.length);
      newWidth[colIndex] = width;
      return newWidth;
    });
  }

  function forceScroll(scrollLeft: number, target: HTMLDivElement) {
    /* eslint-disable no-param-reassign */
    if (target && target.scrollLeft !== scrollLeft) {
      target.scrollLeft = scrollLeft;
    }
    /* eslint-enable */
  }

  const onScroll: React.UIEventHandler<HTMLDivElement> = ({ currentTarget }) => {
    const { scrollLeft, scrollWidth, clientWidth } = currentTarget;
    forceScroll(scrollLeft, scrollHeaderRef.current);
    forceScroll(scrollLeft, scrollBodyRef.current);

    setPingedLeft(scrollLeft > 0);
    setPingedRight(scrollLeft < scrollWidth - clientWidth);
  };

  const triggerOnScroll = () => {
    if (scrollBodyRef.current) {
      onScroll({ currentTarget: scrollBodyRef.current } as React.UIEvent<HTMLDivElement>);
    }
  };

  const onFullTableResize = ({ width }) => {
    triggerOnScroll();
    setComponentWidth(width);
  };

  // Sync scroll bar when init or `fixColumn` changed
  React.useEffect(() => triggerOnScroll, []);
  React.useEffect(() => {
    if (fixColumn) {
      triggerOnScroll();
    }
  }, [fixColumn]);

  // ====================== Render ======================
  const TableComponent = getComponent(['table'], 'table');

  // Table layout
  const mergedTableLayout = React.useMemo<TableLayout>(() => {
    if (tableLayout) {
      return tableLayout;
    }

    if (fixHeader || fixColumn || flattenColumns.some(({ ellipsis }) => ellipsis)) {
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
      measureColumnWidth={fixHeader || fixColumn}
      stickyOffsets={stickyOffsets}
      expandedKeys={mergedExpandedKeys}
      rowExpandable={rowExpandable}
      getRowKey={getRowKey}
      onRow={onRow}
      emptyNode={emptyNode}
    />
  );

  const bodyColGroup = (
    <ColGroup colWidths={flattenColumns.map(({ width }) => width)} columns={flattenColumns} />
  );

  const footerTable = summary && <Footer>{summary(mergedData)}</Footer>;

  if (fixHeader) {
    groupTableNode = (
      <>
        {showHeader !== false && (
          <div
            style={{
              ...scrollXStyle,
              marginBottom: fixColumn ? -scrollbarSize : null,
            }}
            onScroll={onScroll}
            ref={scrollHeaderRef}
            className={classNames(`${prefixCls}-header`)}
          >
            <FixedHeader {...headerProps} {...columnContext} />
          </div>
        )}
        <div
          style={{
            ...scrollXStyle,
            ...scrollYStyle,
          }}
          onScroll={onScroll}
          ref={scrollBodyRef}
          className={classNames(`${prefixCls}-body`)}
        >
          <TableComponent
            style={{
              ...scrollTableStyle,
              tableLayout: mergedTableLayout,
            }}
          >
            {bodyColGroup}
            {bodyTable}
            {footerTable}
          </TableComponent>
        </div>
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
          {showHeader !== false && (
            <Header
              {...headerProps}
              {...columnContext}
              measureColumnWidth={!hasData && fixColumn}
            />
          )}
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
        [`${prefixCls}-ping-left`]: pingedLeft,
        [`${prefixCls}-ping-right`]: pingedRight,
        [`${prefixCls}-layout-fixed`]: tableLayout === 'fixed',
        [`${prefixCls}-fixed-header`]: fixHeader,
        [`${prefixCls}-fixed-column`]: fixColumn,
      })}
      style={style}
      id={id}
      {...ariaProps}
    >
      {title && <Panel className={`${prefixCls}-title`}>{title(mergedData)}</Panel>}
      {groupTableNode}
      {footer && <Panel className={`${prefixCls}-footer`}>{footer(mergedData)}</Panel>}
    </div>
  );

  if (fixColumn) {
    fullTable = <ResizeObserver onResize={onFullTableResize}>{fullTable}</ResizeObserver>;
  }

  return (
    <TableContext.Provider
      value={{
        prefixCls,
        getComponent,
      }}
    >
      <BodyContext.Provider
        value={{
          ...columnContext,
          tableLayout: mergedTableLayout,
          rowClassName,
          expandedRowClassName,
          componentWidth,
          fixHeader,
          fixColumn,
          expandIcon: mergedExpandIcon,
          expandableType,
          expandRowByClick,
          expandedRowRender,
          onTriggerExpand,
          indentSize,
        }}
      >
        <ResizeContext.Provider value={{ onColumnResize }}>{fullTable}</ResizeContext.Provider>
      </BodyContext.Provider>
    </TableContext.Provider>
  );
}

Table.Column = Column;

Table.ColumnGroup = ColumnGroup;

Table.defaultProps = {
  rowKey: 'key',
  prefixCls: 'rc-table',
  emptyText: () => 'No Data',
};

export default Table;
