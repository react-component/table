import React from 'react';
import { ColumnType, DefaultRecordType } from './interface';

export interface TableContextProps {
  columns: ColumnType<DefaultRecordType>[];
}

const TableContext = React.createContext<TableContextProps>(null);

export default TableContext;
