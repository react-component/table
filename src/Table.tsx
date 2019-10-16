import React from 'react';
import classNames from 'classnames';
import { Key, ColumnType, DefaultRecordType, GetRowKey } from './interface';
import TableContext from './context';
import { convertChildrenToColumn } from './utils/legacyUtil';
import DataList from './DataList';

export interface TableProps<RecordType> {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  data?: RecordType[];
  columns?: ColumnType<RecordType>[];
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

interface TableState<RecordType> {
  columns: ColumnType<RecordType>[];
}

// Using class component since still need support user get DOM node by `findDOMNode`
class Table<RecordType extends object = DefaultRecordType> extends React.Component<
  TableProps<RecordType>,
  TableState<RecordType>
> {
  static defaultProps = {
    data: [],
    useFixedHeader: false,
    rowKey: 'key',
    prefixCls: 'rc-table',
    showHeader: true,
    emptyText: () => 'No Data',
  };

  state: TableState<RecordType> = {
    columns: [],
  };

  static getDerivedStateFromProps(
    nextProps: TableProps<DefaultRecordType>,
    prevState: TableState<DefaultRecordType>,
  ): Partial<TableState<DefaultRecordType>> {
    const newState: Partial<TableState<DefaultRecordType>> = {};

    if ('columns' in nextProps) {
      newState.columns = nextProps.columns || [];
    } else {
      newState.columns = convertChildrenToColumn(nextProps.children);
    }

    return newState;
  }

  render() {
    const { columns } = this.state;
    const { prefixCls, className, style, data, rowKey } = this.props;

    return (
      <TableContext.Provider value={{ columns }}>
        <div className={classNames(prefixCls, className)} style={style}>
          <table>
            <thead />
            <DataList data={data} rowKey={rowKey} />
            <tfoot />
          </table>
        </div>
      </TableContext.Provider>
    );
  }
}

export default Table;
