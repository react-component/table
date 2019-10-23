/**
 * TODO:
 *  rowKey should not provide index as second param
 *
 * Removed:
 *  - expandIconAsCell
 */

import * as React from 'react';
import classNames from 'classnames';
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
  ExpandedRowRender,
  Key,
  DefaultRecordType,
  TriggerEventHandler,
} from './interface';
import DataContext from './context/TableContext';
import Body from './Body';
import useColumns from './hooks/useColumns';
import useFrameState from './hooks/useFrameState';
import { getPathValue } from './utils/valueUtil';
import ResizeContext from './context/ResizeContext';
import useStickyOffsets from './hooks/useStickyOffsets';

const scrollbarSize = getScrollBarSize();

export interface TableProps<RecordType extends DefaultRecordType> {
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
  expandedRowKeys?: Key[];
  defaultExpandedRowKeys?: Key[];
  expandedRowRender?: ExpandedRowRender<RecordType>;
  onExpand?: (expanded: boolean, record: RecordType) => void;
  onExpandedRowsChange?: (expandedKeys: Key[]) => void;

  // TODO: Handle this
  // Customize
  components?: TableComponents;

  // expandIconAsCell?: boolean;
  // expandedRowClassName?: (record: RecordType, index: number, indent: number) => string;
  // defaultExpandAllRows?: boolean;
  // expandIconColumnIndex?: number;
  // expandIcon?: RenderExpandIcon<RecordType>;
  // childrenColumnName?: string;
  // indentSize?: number;
  // columnManager: ColumnManager;
  // store: TableStore;

  // getRowKey: GetRowKey<RecordType>;

  // columns?: ColumnType[];
  // bodyStyle?: React.CSSProperties;

  // rowClassName?: string | ((record: RecordType, index: number, indent: number) => string);
  // onRow?: GetComponentProps<RecordType>;
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

    // Expand
    expandedRowKeys,
    defaultExpandedRowKeys,
    expandedRowRender,
    onExpand,
    onExpandedRowsChange,
  } = props;

  // ==================== Customize =====================
  function getComponent(path: string[], defaultComponent: CustomizeComponent): CustomizeComponent {
    return getPathValue(components, path) || defaultComponent;
  }

  const getRowKey = React.useMemo<GetRowKey<RecordType>>(() => {
    if (typeof rowKey === 'function') {
      return rowKey;
    }
    return (record: RecordType) => record[rowKey];
  }, [rowKey]);

  // ====================== Expand ======================
  const [innerExpandedKeys, setInnerExpandedKeys] = React.useState(defaultExpandedRowKeys);
  const mergedExpandedKeys = new Set(expandedRowKeys || innerExpandedKeys || []);

  const expandable: boolean = !!expandedRowRender;

  const onTriggerExpand: TriggerEventHandler<RecordType> = (record: RecordType) => {
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
  };

  // ====================== Column ======================
  const [columns, flattenColumns] = useColumns({
    ...props,
    expandable,
    expandedKeys: mergedExpandedKeys,
    getRowKey,
    onTriggerExpand,
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
  const [colWidths, updateColWidths] = useFrameState<number[]>([]);
  const stickyOffsets = useStickyOffsets(colWidths, flattenColumns.length);

  const fixHeader = scroll && 'y' in scroll;
  const fixColumn = scroll && 'x' in scroll;

  let scrollXStyle: React.CSSProperties;
  let scrollYStyle: React.CSSProperties;

  if (fixHeader) {
    scrollYStyle = {
      overflowY: 'scroll',
      maxHeight: scroll.y,
    };
  }
  if (fixColumn) {
    scrollXStyle = { overflowX: 'auto' };
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
          <table>{bodyTable}</table>
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
        <table>
          <Header {...headerProps} {...columnContext} />
          {bodyTable}
        </table>
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
