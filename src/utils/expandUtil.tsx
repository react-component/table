import * as React from 'react';
import { clsx } from 'clsx';
import type { RenderExpandIconProps, Key, GetRowKey, ExpandableConfig } from '../interface';

export function renderExpandIcon<RecordType>({
  prefixCls,
  record,
  onExpand,
  expanded,
  expandable,
}: RenderExpandIconProps<RecordType>) {
  const expandClassName = `${prefixCls}-row-expand-icon`;

  if (!expandable) {
    return <span className={clsx(expandClassName, `${prefixCls}-row-spaced`)} />;
  }

  const onClick: React.MouseEventHandler<HTMLElement> = event => {
    onExpand(record, event);
    event.stopPropagation();
  };

  return (
    <span
      className={clsx(expandClassName, {
        [`${prefixCls}-row-expanded`]: expanded,
        [`${prefixCls}-row-collapsed`]: !expanded,
      })}
      onClick={onClick}
    />
  );
}

export function findAllChildrenKeys<RecordType>(
  data: readonly RecordType[],
  getRowKey: GetRowKey<RecordType>,
  childrenColumnName: string,
): Key[] {
  const keys: Key[] = [];

  function dig(list: readonly RecordType[]) {
    (list || []).forEach((item, index) => {
      keys.push(getRowKey(item, index));

      dig((item as any)[childrenColumnName]);
    });
  }

  dig(data);

  return keys;
}

export function computedExpandedClassName<RecordType>(
  cls: ExpandableConfig<RecordType>['expandedRowClassName'],
  record: RecordType,
  index: number,
  indent: number,
) {
  if (typeof cls === 'string') {
    return cls;
  }
  if (typeof cls === 'function') {
    return cls(record, index, indent);
  }
  return '';
}
