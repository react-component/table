import React from 'react';
import classNames from 'classnames';
import ColumnGroup from './sugar/ColumnGroup';
import Column from './sugar/Column';
import Header from './Header';
import { GetRowKey, ColumnsType } from './interface';
import TableContext from './context';
import DataList from './DataList';
import useColumns from './hooks/useColumns';

export interface TableProps<RecordType> {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  data?: RecordType[];
  columns?: ColumnsType<RecordType>;
  rowKey?: string | GetRowKey<RecordType>;

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

  // useFixedHeader?: boolean;
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
  // scroll?: { x?: number | true | string; y?: number };
  // rowRef?: (record: RecordType, index: number, indent: number) => React.Ref<React.ReactElement>;
  // getBodyWrapper?: (body: React.ReactElement) => React.ReactElement;

  // components?: TableComponents;
  // tableLayout?: 'fixed';
}

function Table<RecordType>(props: TableProps<RecordType>) {
  const { prefixCls, className, style, data, rowKey } = props;

  const [columns, flattenColumns] = useColumns(props);

  return (
    <TableContext.Provider value={{ columns, flattenColumns }}>
      <div className={classNames(prefixCls, className)} style={style}>
        <table>
          <Header />
          <DataList data={data} rowKey={rowKey} />
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
