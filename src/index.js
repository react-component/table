import Table from './Table';
import Column from './Column';
import ColumnGroup from './ColumnGroup';
import { INTERNAL_COL_DEFINE } from './utils';

Table.Column = Column;
Table.ColumnGroup = ColumnGroup;

export default Table;
export { Column, ColumnGroup, INTERNAL_COL_DEFINE };
