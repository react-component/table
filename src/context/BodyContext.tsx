import { createContext } from '../ContextSelector';
import type {
  ColumnsType,
  ColumnType,
  DefaultRecordType,
  ExpandableType,
  ExpandedRowRender,
  RenderExpandIcon,
  RowClassName,
  TableLayout,
  TriggerEventHandler,
} from '../interface';

export interface BodyContextProps<RecordType = DefaultRecordType> {
  rowClassName: string | RowClassName<RecordType>;
  expandedRowClassName: RowClassName<RecordType>;

  columns: ColumnsType<RecordType>;
  flattenColumns: readonly ColumnType<RecordType>[];

  tableLayout: TableLayout;

  indentSize: number;
  expandableType: ExpandableType;
  expandRowByClick: boolean;
  expandedRowRender: ExpandedRowRender<RecordType>;
  expandIcon: RenderExpandIcon<RecordType>;
  onTriggerExpand: TriggerEventHandler<RecordType>;
  expandIconColumnIndex: number;
  allColumnsFixedLeft: boolean;
}

// const BodyContext = React.createContext<BodyContextProps>(null);
const BodyContext = createContext<BodyContextProps>();

export default BodyContext;
