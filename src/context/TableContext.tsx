import { createContext, createImmutable } from '@rc-component/context';
import type {
  ColumnsType,
  ColumnType,
  Direction,
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

const { makeImmutable, responseImmutable, useImmutableMark } = createImmutable();
export { makeImmutable, responseImmutable, useImmutableMark };

export interface TableContextProps<RecordType = any> {
  // Scroll
  scrollX: number | string | true;

  // Table
  prefixCls: string;
  getComponent: GetComponent;
  scrollbarSize: number;
  direction: Direction;
  fixedInfoList: readonly FixedInfo[];
  isSticky: boolean;
  supportSticky: boolean;
  componentWidth: number;
  fixHeader: boolean;
  fixColumn: boolean;
  horizonScroll: boolean;

  // Body
  rowClassName: string | RowClassName<RecordType>;
  expandedRowClassName: RowClassName<RecordType>;
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
  onColumnWidthChange: (columnKey: React.Key, width: number) => void;

  // Row
  hoverStartRow: number;
  hoverEndRow: number;
  onHover: (start: number, end: number) => void;
  rowExpandable: (record: RecordType) => boolean;

  expandedKeys: Set<React.Key>;
  getRowKey: GetRowKey<RecordType>;
  childrenColumnName: string;

  rowHoverable?: boolean;
  fullTableRef: React.MutableRefObject<HTMLDivElement>;
  colsWidths: Map<React.Key, number>;
  colWidths: number[];
  colsKeys: React.Key[];
  onColumnResizeComplete?: (info: {
    columnKey: React.Key;
    width: number;
    columnWidths: { columnKey: React.Key; width: number }[];
  }) => void;
  onResizingChange: (value: boolean) => void;
}

const TableContext = createContext<TableContextProps>();

export default TableContext;
