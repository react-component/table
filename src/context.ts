import React from 'react';
import { ColumnType, DefaultRecordType, ColumnsType } from './interface';

export interface TableContextProps<RecordType = DefaultRecordType> {
  columns: ColumnsType<RecordType>;
  flattenColumns: ColumnType<RecordType>[];
}

const TableContext = React.createContext<TableContextProps>(null);

export default TableContext;
