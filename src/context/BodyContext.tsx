import * as React from 'react';
import {
  ColumnType,
  DefaultRecordType,
  ColumnsType,
  TableLayout,
  RenderExpandIcon,
  ExpandableType,
  RowClassName,
  TriggerEventHandler,
  ExpandedRowRender,
} from '../interface';

export interface BodyContextProps<RecordType = DefaultRecordType> {
  rowClassName: string | RowClassName<RecordType>;
  expandedRowClassName: RowClassName<RecordType>;

  columns: ColumnsType<RecordType>;
  flattenColumns: ColumnType<RecordType>[];

  componentWidth: number;
  tableLayout: TableLayout;
  fixHeader: boolean;
  fixColumn: boolean;

  indentSize: number;
  expandableType: ExpandableType;
  expandRowByClick: boolean;
  expandedRowRender: ExpandedRowRender<RecordType>;
  expandIcon: RenderExpandIcon<RecordType>;
  onTriggerExpand: TriggerEventHandler<RecordType>;
  expandIconColumnIndex: number;
}

const BodyContext = React.createContext<BodyContextProps>(null);

export default BodyContext;
