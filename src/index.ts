import { EXPAND_COLUMN, INTERNAL_HOOKS } from './constant';
import { FooterComponents as Summary } from './Footer';
import StaticTable from './StaticTable';
import Column from './sugar/Column';
import ColumnGroup from './sugar/ColumnGroup';
import type { TableProps } from './Table';
import Table, { genTable } from './Table';
import { INTERNAL_COL_DEFINE } from './utils/legacyUtil';

export {
  genTable,
  Summary,
  Column,
  ColumnGroup,
  INTERNAL_COL_DEFINE,
  EXPAND_COLUMN,
  INTERNAL_HOOKS,
  StaticTable,
};
export type { TableProps };

export default Table;
