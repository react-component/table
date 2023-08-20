import { useContext } from '@rc-component/context';
import type { TableContextProps } from '../context/TableContext';
import TableContext from '../context/TableContext';
import { getColumnsKey } from '../utils/valueUtil';
import { useEvent } from 'rc-util';

export default function useRowInfo<RecordType>(
  record: RecordType,
  rowKey: React.Key,
): Pick<
  TableContextProps,
  | 'prefixCls'
  | 'fixedInfoList'
  | 'flattenColumns'
  | 'expandableType'
  | 'expandRowByClick'
  | 'onTriggerExpand'
  | 'rowClassName'
  | 'expandedRowClassName'
  | 'indentSize'
  | 'expandIcon'
  | 'expandedRowRender'
  | 'expandIconColumnIndex'
  | 'expandedKeys'
  | 'childrenColumnName'
> & {
  columnsKey: React.Key[];
  nestExpandable: boolean;
  expanded: boolean;
  hasNestChildren: boolean;
  record: RecordType;
  supportExpand: boolean;
  expandable: boolean;
} {
  const context: TableContextProps = useContext(TableContext, [
    'prefixCls',
    'fixedInfoList',
    'flattenColumns',
    'expandableType',
    'expandRowByClick',
    'onTriggerExpand',
    'rowClassName',
    'expandedRowClassName',
    'indentSize',
    'expandIcon',
    'expandedRowRender',
    'expandIconColumnIndex',
    'expandedKeys',
    'childrenColumnName',
    'rowExpandable',
  ]);

  const {
    flattenColumns,
    expandableType,
    expandedKeys,
    childrenColumnName,
    onTriggerExpand,
    rowExpandable,
  } = context;

  // ======================= Expandable =======================
  // Only when row is not expandable and `children` exist in record
  const nestExpandable = expandableType === 'nest';

  const rowSupportExpand = expandableType === 'row' && (!rowExpandable || rowExpandable(record));
  const mergedExpandable = rowSupportExpand || nestExpandable;

  const expanded = expandedKeys && expandedKeys.has(rowKey);

  const hasNestChildren = childrenColumnName && record && record[childrenColumnName];

  const onInternalTriggerExpand = useEvent(onTriggerExpand);

  // ========================= Column =========================
  const columnsKey = getColumnsKey(flattenColumns);

  return {
    ...context,
    columnsKey,
    nestExpandable,
    expanded,
    hasNestChildren,
    record,
    onTriggerExpand: onInternalTriggerExpand,
    supportExpand: rowSupportExpand,
    expandable: mergedExpandable,
  };
}
