import { EXPAND_COLUMN, INTERNAL_HOOKS } from './constant';
import { FooterComponents as Summary } from './Footer';
import type {
  ColumnType,
  ColumnsType,
  DefaultRecordType,
  ExpandableConfig,
  FixedType,
  GetComponentProps,
  GetRowKey,
  Reference,
  RenderedCell,
} from './interface';
import Column from './sugar/Column';
import ColumnGroup from './sugar/ColumnGroup';
import type { TableProps } from './Table';
import Table, { genTable } from './Table';
import { INTERNAL_COL_DEFINE } from './utils/legacyUtil';
import type { VirtualTableProps } from './VirtualTable';
import VirtualTable, { genVirtualTable } from './VirtualTable';
import { convertChildrenToColumns } from './hooks/useColumns';

export {
  genTable,
  convertChildrenToColumns,
  Summary,
  Column,
  ColumnGroup,
  type TableProps,
  INTERNAL_COL_DEFINE,
  EXPAND_COLUMN,
  INTERNAL_HOOKS,
  VirtualTable,
  genVirtualTable,
  type VirtualTableProps,
  type Reference,
  type ColumnType,
  type ColumnsType,
  type DefaultRecordType,
  type ExpandableConfig,
  type FixedType,
  type GetComponentProps,
  type GetRowKey,
  type RenderedCell,
};

export default Table;
