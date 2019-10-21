import React from 'react';
import classNames from 'classnames';
import ColumnGroup from './sugar/ColumnGroup';
import Column from './sugar/Column';
import Header from './Header';
import { GetRowKey, ColumnsType } from './interface';
import TableContext from './context';
import Body from './Body';
import useColumns from './hooks/useColumns';

export interface TableProps<RecordType> {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  data?: RecordType[];
  columns?: ColumnsType<RecordType>;
  rowKey?: string | GetRowKey<RecordType>;

  // Fixed
  useFixedHeader?: boolean;
  scroll?: { x?: number | true | string; y?: number };

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

  // components?: TableComponents;
  // tableLayout?: 'fixed';
}

function Table<RecordType>(props: TableProps<RecordType>) {
  const { prefixCls, className, style, data, rowKey, scroll } = props;

  const [columns, flattenColumns] = useColumns(props);

  // ========================= Fixed =========================
  const fixedLeft = React.useState(false);
  const fixedTop = React.useState(false);

  const scrollX: boolean = scroll && 'x' in scroll;
  const scrollY: boolean = scroll && 'y' in scroll;

  const scrollStyle: React.CSSProperties = {
    overflowX: scrollX ? 'auto' : null,
    overflowY: scrollY ? 'auto' : null,
    maxHeight: scrollY ? scroll.y : null,
  };

  if (scrollX || scrollY) {
    scrollStyle.position = 'relative';
  }

  const onScroll: React.UIEventHandler<HTMLDivElement> = ({ currentTarget }) => {
    const { scrollLeft, scrollTop } = currentTarget;
    console.log('=>', scrollLeft, scrollTop);
  };

  return (
    <TableContext.Provider value={{ columns, flattenColumns, prefixCls }}>
      <div
        className={classNames(prefixCls, className)}
        style={{
          ...style,
          ...scrollStyle,
        }}
        onScroll={onScroll}
      >
        <table>
          <Header fixHeader={scrollY} />
          <Body data={data} rowKey={rowKey} />
          <tfoot />
        </table>
      </div>
    </TableContext.Provider>
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
