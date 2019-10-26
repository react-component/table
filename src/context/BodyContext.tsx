import * as React from 'react';
import {
  ColumnType,
  DefaultRecordType,
  ColumnsType,
  GetRowKey,
  TableLayout,
  RenderExpandIcon,
  ExpandableType,
  RowClassName,
} from '../interface';

export interface BodyContextProps<RecordType = DefaultRecordType> {
  getRowKey: GetRowKey<RecordType>;
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
  expandIcon: RenderExpandIcon<RecordType>;
}

const BodyContext = React.createContext<BodyContextProps>(null);

export default BodyContext;
