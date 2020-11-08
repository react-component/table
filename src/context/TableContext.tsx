import * as React from 'react';
import { ColumnType, GetComponent } from '../interface';
import { FixedInfo } from '../utils/fixUtil';

export interface TableContextProps {
  // Table context
  prefixCls: string;

  getComponent: GetComponent;

  scrollbarSize: number;

  direction: 'ltr' | 'rtl';

  fixedInfoList: FixedInfo[];

  summaryFixedInfoList: FixedInfo[];

  columnsWithScrollbar: ColumnType<unknown>[];

  isSticky: boolean;

  isSummaryShowTop: boolean;

  isSummaryFixed: boolean;
}

const TableContext = React.createContext<TableContextProps>(null);

export default TableContext;
