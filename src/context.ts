import React from 'react';
import { ColumnType, DefaultRecordType } from './interface';

export interface TableContextProps<RecordType = DefaultRecordType> {
  columns: ColumnType<RecordType>[];
}

const TableContext = React.createContext<TableContextProps>(null);

export default TableContext;
