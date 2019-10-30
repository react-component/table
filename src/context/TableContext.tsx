import * as React from 'react';
import { DefaultRecordType, GetComponent } from '../interface';

export interface TableContextProps<RecordType = DefaultRecordType> {
  // Table context
  prefixCls: string;
  getComponent: GetComponent;
}

const TableContext = React.createContext<TableContextProps>(null);

export default TableContext;
