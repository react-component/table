import * as React from 'react';
import type { GetComponent } from '../interface';
import type { FixedInfo } from '../utils/fixUtil';

export interface TableContextProps {
  // Table context
  prefixCls: string;

  getComponent: GetComponent;

  scrollbarSize: number;

  direction: 'ltr' | 'rtl';

  fixedInfoList: readonly FixedInfo[];

  isSticky: boolean;
}

const TableContext = React.createContext<TableContextProps>(null);

export default TableContext;
