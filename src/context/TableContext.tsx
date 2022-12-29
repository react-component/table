import { createContext } from '@rc-component/context';
import type { GetComponent } from '../interface';
import type { FixedInfo } from '../utils/fixUtil';

export interface TableContextProps {
  // Table
  prefixCls: string;

  getComponent: GetComponent;

  scrollbarSize: number;

  direction: 'ltr' | 'rtl';

  fixedInfoList: readonly FixedInfo[];

  isSticky: boolean;

  // Column
  onColumnResize: (columnKey: React.Key, width: number) => void;

  // Row
  hoverStartRow: number;
  hoverEndRow: number;
  onHover: (start: number, end: number) => void;
}

const TableContext = createContext<TableContextProps>();

export default TableContext;
