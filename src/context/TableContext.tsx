import { createContext } from '@rc-component/context';
import type {
  ColumnsType,
  ColumnType,
  ExpandableType,
  ExpandedRowRender,
  GetComponent,
  RenderExpandIcon,
  RowClassName,
  TableLayout,
  TriggerEventHandler,
} from '../interface';
import type { FixedInfo } from '../utils/fixUtil';

export interface TableContextProps<RecordType = any> {
  // Table
  prefixCls: string;
  getComponent: GetComponent;
  scrollbarSize: number;
  direction: 'ltr' | 'rtl';
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

  // Row
  hoverStartRow: number;
  hoverEndRow: number;
  onHover: (start: number, end: number) => void;
}

const TableContext = createContext<TableContextProps>();

export default TableContext;
