import warning from 'rc-util/lib/warning';
import type { ExpandableConfig, LegacyExpandableProps } from '../interface';

export const INTERNAL_COL_DEFINE = 'RC_TABLE_INTERNAL_COL_DEFINE';

export function getExpandableProps<RecordType>(
  props: LegacyExpandableProps<RecordType> & {
    expandable?: ExpandableConfig<RecordType>;
  },
): ExpandableConfig<RecordType> {
  const { expandable, ...legacyExpandableConfig } = props;

  if ('expandable' in props) {
    return {
      ...legacyExpandableConfig,
      ...expandable,
    };
  }

  if (
    process.env.NODE_ENV !== 'production' &&
    [
      'indentSize',
      'expandedRowKeys',
      'defaultExpandedRowKeys',
      'defaultExpandAllRows',
      'expandedRowRender',
      'expandRowByClick',
      'expandIcon',
      'onExpand',
      'onExpandedRowsChange',
      'expandedRowClassName',
      'expandIconColumnIndex',
    ].some(prop => prop in props)
  ) {
    warning(false, 'expanded related props have been moved into `expandable`.');
  }

  return legacyExpandableConfig;
}
