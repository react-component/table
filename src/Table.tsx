/**
 * TODO:
 *  rowKey should not provide index as second param
 *
 * Feature:
 * - fixed not need to set width
 * - support `rowExpandable` to config row expand logic
 *
 * Removed:
 *  - expandIconAsCell
 *
 * Deprecated:
 * - All expanded props, move into expandable
 */

import * as React from 'react';
import classNames from 'classnames';
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
  CustomizeComponent,
  Key,
  DefaultRecordType,
  TriggerEventHandler,
  GetComponentProps,
  ExpandableConfig,
  LegacyExpandableProps,
  GetComponent,
} from './interface';
import DataContext from './context/TableContext';
import Body from './Body';
import useColumns from './hooks/useColumns';
import useFrameState from './hooks/useFrameState';
import { getPathValue, mergeObject } from './utils/valueUtil';
import ResizeContext from './context/ResizeContext';
import useStickyOffsets from './hooks/useStickyOffsets';
import ColGroup from './ColGroup';
import { getExpandableProps } from './utils/legacyUtil';
import TDComponent from './Cell/TDComponent';

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

  // Fixed Columns
  scroll?: { x?: number | true | string; y?: number };
  /** @deprecated No need to set this */
  useFixedHeader?: boolean;

  // Expandable
  /** Config expand rows */
  expandable?: ExpandableConfig<RecordType>;

  // TODO: Handle this
  // Customize
  components?: TableComponents;
  onRow?: GetComponentProps<RecordType>;

  // expandedRowClassName?: (record: RecordType, index: number, indent: number) => string;
  // defaultExpandAllRows?: boolean;
  // expandIconColumnIndex?: number;
  // childrenColumnName?: string;
  // indentSize?: number;
  // columnManager: ColumnManager;
  // store: TableStore;

  // getRowKey: GetRowKey<RecordType>;

  // columns?: ColumnType[];
  // bodyStyle?: React.CSSProperties;

  // rowClassName?: string | ((record: RecordType, index: number, indent: number) => string);
  // onHeaderRow?: GetComponentProps<ColumnType[]>;
  // onRowClick?: LegacyFunction<RecordType>;
  // onRowDoubleClick?: LegacyFunction<RecordType>;
  // onRowContextMenu?: LegacyFunction<RecordType>;
  // onRowMouseEnter?: LegacyFunction<RecordType>;
  // onRowMouseLeave?: LegacyFunction<RecordType>;
  // showHeader?: boolean;
  // title?: (data: RecordType[]) => React.ReactNode;
  // id?: string;
  // footer?: (data: RecordType[]) => React.ReactNode;
  // emptyText?: React.ReactNode | (() => React.ReactNode);
  // rowRef?: (record: RecordType, index: number, indent: number) => React.Ref<React.ReactElement>;
  // getBodyWrapper?: (body: React.ReactElement) => React.ReactElement;

  // tableLayout?: 'fixed';
}

function Table<RecordType extends DefaultRecordType>(props: TableProps<RecordType>) {
  const {
    prefixCls,
    className,
    style,
    data = [],
    rowKey,
    scroll,
    components,

    // Customize
    onRow,
  } = props;

  // ==================== Customize =====================
  const mergedComponents = React.useMemo(
    () =>
      mergeObject<TableComponents>(components, {
        body: {
          cell: TDComponent,
        },
      }),
    [components],
  );

  const getComponent = React.useCallback<GetComponent>(
    (path, defaultComponent) => getPathValue(mergedComponents, path) || defaultComponent,
    [mergedComponents],
  );

  const getRowKey = React.useMemo<GetRowKey<RecordType>>(() => {
    if (typeof rowKey === 'function') {
      return rowKey;
    }
    return (record: RecordType) => record[rowKey];
  }, [rowKey]);

  // ====================== Expand ======================
  const expandableConfig = getExpandableProps(props);

  const {
    expandedRowKeys,
    defaultExpandedRowKeys,
    expandedRowRender,
    onExpand,
    onExpandedRowsChange,
    expandRowByClick,
    rowExpandable,
  } = expandableConfig;

  const [innerExpandedKeys, setInnerExpandedKeys] = React.useState(defaultExpandedRowKeys);
  const mergedExpandedKeys = React.useMemo(
    () => new Set(expandedRowKeys || innerExpandedKeys || []),
    [expandedRowKeys, innerExpandedKeys],
  );

  const expandable: boolean = !!expandedRowRender;

  const onTriggerExpand: TriggerEventHandler<RecordType> = React.useCallback(
    (record: RecordType) => {
      const key = getRowKey(record, data.indexOf(record));

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
    [getRowKey, mergedExpandedKeys, data, onExpand, onExpandedRowsChange],
  );

  // ====================== Column ======================
  const [tableWidth, setTableWidth] = React.useState(0);

  const [columns, flattenColumns] = useColumns({
    ...props,
    ...expandableConfig,
    expandable,
    expandedKeys: mergedExpandedKeys,
    getRowKey,
    onTriggerExpand,
    tableWidth,
  });

  const columnContext = {
    columns,
    flattenColumns,
  };

  const onTableResize = ({ width }: { width: number }) => {
    setTableWidth(width);
  };

  // ====================== Scroll ======================
  const scrollHeaderRef = React.useRef<HTMLDivElement>();
  const scrollBodyRef = React.useRef<HTMLDivElement>();
  const [pingedLeft, setPingedLeft] = React.useState(false);
  const [pingedRight, setPingedRight] = React.useState(false);
  const [colWidths, updateColWidths] = useFrameState<number[]>([]);
  const stickyOffsets = useStickyOffsets(colWidths, flattenColumns.length);

  const fixHeader = scroll && 'y' in scroll;
  const fixColumn = scroll && 'x' in scroll;

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
      width: scroll.x === true ? null : scroll.x,
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
    if (target && target.scrollLeft !== scrollLeft) {
      target.scrollLeft = scrollLeft;
    }
  }

  const onScroll: React.UIEventHandler<HTMLDivElement> = ({ currentTarget }) => {
    const { scrollLeft, scrollWidth, clientWidth } = currentTarget;
    forceScroll(scrollLeft, scrollHeaderRef.current);
    forceScroll(scrollLeft, scrollBodyRef.current);

    setPingedLeft(scrollLeft > 0);
    setPingedRight(scrollLeft < scrollWidth - clientWidth);
  };

  React.useEffect(() => {
    if (scrollBodyRef.current) {
      onScroll({ currentTarget: scrollBodyRef.current } as React.UIEvent<HTMLDivElement>);
    }
  }, []);

  // ====================== Render ======================
  let groupTableNode: React.ReactNode;

  const headerProps = {
    colWidths,
    columCount: flattenColumns.length,
    stickyOffsets,
  };

  const bodyTable = (
    <Body
      data={data}
      rowKey={rowKey}
      measureColumnWidth={fixHeader || fixColumn}
      stickyOffsets={stickyOffsets}
      expandedKeys={mergedExpandedKeys}
      expandable={expandable}
      expandedRowRender={expandedRowRender}
      rowExpandable={rowExpandable}
      onTriggerExpand={expandRowByClick ? onTriggerExpand : null}
      onRow={onRow}
    />
  );

  const bodyColGroup = (
    <ColGroup
      colWidths={flattenColumns.map(({ width }) => width)}
      columCount={flattenColumns.length}
    />
  );

  if (fixHeader) {
    groupTableNode = (
      <>
        <div
          style={{
            ...scrollXStyle,
            marginBottom: -scrollbarSize,
          }}
          onScroll={onScroll}
          ref={scrollHeaderRef}
          className={classNames(`${prefixCls}-header`)}
        >
          <FixedHeader {...headerProps} {...columnContext} />
        </div>
        <div
          style={{
            ...scrollXStyle,
            ...scrollYStyle,
          }}
          onScroll={onScroll}
          ref={scrollBodyRef}
          className={classNames(`${prefixCls}-body`)}
        >
          <ResizeObserver onResize={onTableResize}>
            <table style={scrollTableStyle}>
              {bodyColGroup}
              {bodyTable}
            </table>
          </ResizeObserver>
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
      >
        <ResizeObserver onResize={onTableResize}>
          <table style={scrollTableStyle}>
            {bodyColGroup}
            <Header {...headerProps} {...columnContext} />
            {bodyTable}
          </table>
        </ResizeObserver>
      </div>
    );
  }

  return (
    <DataContext.Provider value={{ ...columnContext, prefixCls, getComponent, getRowKey }}>
      <ResizeContext.Provider value={{ onColumnResize }}>
        <div
          className={classNames(prefixCls, className, {
            [`${prefixCls}-ping-left`]: pingedLeft,
            [`${prefixCls}-ping-right`]: pingedRight,
          })}
          style={style}
        >
          {groupTableNode}
        </div>
      </ResizeContext.Provider>
    </DataContext.Provider>
  );
}

Table.Column = Column;

Table.ColumnGroup = ColumnGroup;

Table.defaultProps = {
  data: [],
  useFixedHeader: false,
  rowKey: 'key',
  prefixCls: 'rc-table',
  showHeader: true,
  emptyText: () => 'No Data',
};

export default Table;
