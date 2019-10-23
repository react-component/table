import warning from 'rc-util/lib/warning';
import { ExpandableConfig, LegacyExpandableProps } from '../interface';

export function getExpandableProps<RecordType>(
  props: LegacyExpandableProps<RecordType> & {
    expandable?: ExpandableConfig<RecordType>;
  },
): ExpandableConfig<RecordType> {
  const { expandable, ...legacyExpandableConfig } = props;

  if ('expandable' in props) {
    return expandable;
  }

  if (
    process.env.NODE_ENV !== 'production' &&
    ['expandedRowKeys', 'defaultExpandedRowKeys', 'expandedRowRender'].some(prop => prop in props)
  ) {
    warning(false, 'expanded related props have been moved into `expandable`.');
  }

  return legacyExpandableConfig;
}
