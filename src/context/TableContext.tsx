import { createContext, createImmutable } from '@rc-component/context';
import type {
  ColumnsType,
  ColumnType,
  Direction,
  ExpandableConfig,
  ExpandableType,
  ExpandedRowRender,
  GetComponent,
  GetComponentProps,
  GetRowKey,
  RenderExpandIcon,
  RowClassName,
  TableLayout,
  TriggerEventHandler,
} from '../interface';
import type { FixedInfo } from '../utils/fixUtil';
import type { TableProps } from '../Table';

const { makeImmutable, responseImmutable, useImmutableMark } = createImmutable();
export { makeImmutable, responseImmutable, useImmutableMark };

export type ScrollInfoType = [scrollLeft: number, scrollRange: number];

export interface TableContextProps<RecordType = any> {
  // Scroll
  scrollX: number | string | true;
  classNames?: TableProps['classNames'];
  styles?: TableProps['styles'];

  // Table
  prefixCls: string;
  getComponent: GetComponent;
  scrollbarSize: number;
  direction: Direction;
  fixedInfoList: readonly FixedInfo[];
  isSticky: boolean;
  componentWidth: number;
  fixHeader: boolean;
  fixColumn: boolean;
  horizonScroll: boolean;
  scrollInfo: ScrollInfoType;

  // Body
  rowClassName: string | RowClassName<RecordType>;
  expandedRowClassName: string | RowClassName<RecordType>;
  onRow?: GetComponentProps<RecordType>;
  emptyNode?: React.ReactNode;

  tableLayout: TableLayout;

  indentSize: number;
  expandableType: ExpandableType;
  expandRowByClick: boolean;
  expandedRowRender: ExpandedRowRender<RecordType>;
  expandIcon: RenderExpandIcon<RecordType>;
  onTriggerExpand: TriggerEventHandler<RecordType>;
  expandIconColumnIndex: number;
  allColumnsFixedLeft: boolean;

  // Column
  columns: ColumnsType<RecordType>;
  flattenColumns: readonly ColumnType<RecordType>[];
  onColumnResize: (columnKey: React.Key, width: number) => void;
  colWidths: number[];

  // Row
  hoverStartRow: number;
  hoverEndRow: number;
  onHover: (start: number, end: number) => void;
  rowExpandable: (record: RecordType) => boolean;

  expandedKeys: Set<React.Key>;
  getRowKey: GetRowKey<RecordType>;
  childrenColumnName: string;

  rowHoverable?: boolean;

  expandedRowOffset: ExpandableConfig<RecordType>['expandedRowOffset'];

  // Measure Row
  measureRowRender?: (measureRow: React.ReactNode) => React.ReactNode;
}

const TableContext = createContext<TableContextProps>();

export default TableContext;
