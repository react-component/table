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
  ]);

  const { flattenColumns, expandableType, expandedKeys, childrenColumnName, onTriggerExpand } =
    context;

  const columnsKey = getColumnsKey(flattenColumns);

  // Only when row is not expandable and `children` exist in record
  const nestExpandable = expandableType === 'nest';

  const expanded = expandedKeys && expandedKeys.has(rowKey);

  const hasNestChildren = childrenColumnName && record && record[childrenColumnName];

  const onInternalTriggerExpand = useEvent(onTriggerExpand);

  return {
    ...context,
    columnsKey,
    nestExpandable,
    expanded,
    hasNestChildren,
    record,
    onTriggerExpand: onInternalTriggerExpand,
  };
}
