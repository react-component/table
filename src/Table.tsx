import React from 'react';
import classNames from 'classnames';
import ResizeObserver from 'rc-resize-observer';
import getScrollBarSize from 'rc-util/lib/getScrollBarSize';
import ColumnGroup from './sugar/ColumnGroup';
import Column from './sugar/Column';
import FixedHeader from './Header/FixedHeader';
import Header from './Header/Header';
import { GetRowKey, ColumnsType, TableComponents, CustomizeComponent } from './interface';
import DataContext from './context/TableContext';
import Body from './Body';
import useColumns from './hooks/useColumns';
import useFrameState from './hooks/useFrameState';
import { getPathValue } from './utils/valueUtil';
import ResizeContext from './context/ResizeContext';
import { useStickyOffsets } from './hooks/useStickyOffsets';

const scrollbarSize = getScrollBarSize();

export interface TableProps<RecordType> {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  data?: RecordType[];
  columns?: ColumnsType<RecordType>;
  rowKey?: string | GetRowKey<RecordType>;

  // Fixed
  scroll?: { x?: number | true | string; y?: number };
  /** @deprecated No need to set this */
  useFixedHeader?: boolean;

  // Customize
  components?: TableComponents;

  // TODO: Handle this
  // expandIconAsCell?: boolean;
  // expandedRowKeys?: Key[];
  // expandedRowClassName?: (record: RecordType, index: number, indent: number) => string;
  // defaultExpandAllRows?: boolean;
  // defaultExpandedRowKeys?: Key[];
  // expandIconColumnIndex?: number;
  // expandedRowRender?: ExpandedRowRender<RecordType>;
  // expandIcon?: RenderExpandIcon<RecordType>;
  // childrenColumnName?: string;
  // indentSize?: number;
  // onExpand?: ExpandEventHandler<RecordType>;
  // onExpandedRowsChange?: (expandedKeys: Key[]) => void;
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

function Table<RecordType>(props: TableProps<RecordType>) {
  const { prefixCls, className, style, data, rowKey, scroll, components } = props;

  const [columns, flattenColumns] = useColumns(props);

  // ==================== Customize =====================
  function getComponent(path: string[], defaultComponent: CustomizeComponent): CustomizeComponent {
    return getPathValue(components, path) || defaultComponent;
  }

  // ====================== Scroll ======================
  const scrollHeaderRef = React.useRef<HTMLDivElement>();
  const scrollBodyRef = React.useRef<HTMLDivElement>();
  const [colWidths, updateColWidths] = useFrameState<number[]>([]);
  const stickyOffsets = useStickyOffsets(colWidths, flattenColumns.length);

  const fixHeader = scroll && 'y' in scroll;
  const fixColumn = scroll && 'x' in scroll;

  let scrollXStyle: React.CSSProperties;
  let scrollYStyle: React.CSSProperties;

  if (fixHeader) {
    scrollYStyle = {
      overflowY: 'auto',
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

  const syncScroll: React.UIEventHandler<HTMLDivElement> = ({ currentTarget }) => {
    const { scrollLeft } = currentTarget;
    forceScroll(scrollLeft, scrollHeaderRef.current);
    forceScroll(scrollLeft, scrollBodyRef.current);
  };

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
          onScroll={syncScroll}
          ref={scrollHeaderRef}
        >
          <FixedHeader {...headerProps} />
        </div>
        <div
          style={{
            ...scrollXStyle,
            ...scrollYStyle,
          }}
          onScroll={syncScroll}
          ref={scrollBodyRef}
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
      >
        <table>
          <Header {...headerProps} />
          {bodyTable}
        </table>
      </div>
    );
  }

  return (
    <DataContext.Provider value={{ columns, flattenColumns, prefixCls, getComponent }}>
      <ResizeContext.Provider value={{ onColumnResize }}>
        <div className={classNames(prefixCls, className)} style={style}>
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
