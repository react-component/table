import { useContext } from '@rc-component/context';
import type { TableContextProps } from '../context/TableContext';
import TableContext from '../context/TableContext';
import { getColumnsKey } from '../utils/valueUtil';
import { useEvent } from 'rc-util';

export default function useRowInfo<RecordType>(
  record: RecordType,
  rowKey: React.Key,
  recordIndex: number,
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
  | 'onRow'
> & {
  columnsKey: React.Key[];
  nestExpandable: boolean;
  expanded: boolean;
  hasNestChildren: boolean;
  record: RecordType;
  rowSupportExpand: boolean;
  expandable: boolean;
  rowProps: React.HTMLAttributes<any> & React.TdHTMLAttributes<any>;
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
    'onRow',
  ]);

  const {
    flattenColumns,
    expandableType,
    expandedKeys,
    childrenColumnName,
    onTriggerExpand,
    rowExpandable,
    onRow,
    expandRowByClick,
  } = context;

  // ======================= Expandable =======================
  // Only when row is not expandable and `children` exist in record
  const nestExpandable = expandableType === 'nest';

  const rowSupportExpand = expandableType === 'row' && (!rowExpandable || rowExpandable(record));
  const mergedExpandable = rowSupportExpand || nestExpandable;

  const expanded = expandedKeys && expandedKeys.has(rowKey);

  const hasNestChildren = childrenColumnName && record && record[childrenColumnName];

  const onInternalTriggerExpand = useEvent(onTriggerExpand);

  // ========================= onRow ==========================
  const rowProps = onRow?.(record, recordIndex);
  const onRowClick = rowProps?.onClick;

  const onClick: React.MouseEventHandler<HTMLElement> = (event, ...args) => {
    if (expandRowByClick && mergedExpandable) {
      onTriggerExpand(record, event);
    }

    onRowClick?.(event, ...args);
  };

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
    rowSupportExpand,
    expandable: mergedExpandable,
    rowProps: {
      ...rowProps,
      onClick,
    },
  };
}
