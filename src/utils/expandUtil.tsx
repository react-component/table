import * as React from 'react';
import { clsx } from 'clsx';
import type {
  ExpandIconComponent,
  ExpandIconProps,
  RenderExpandIconProps,
  RenderExpandIcon,
  Key,
  GetRowKey,
  ExpandableConfig,
} from '../interface';

export function DefaultExpandIcon<RecordType>({
  prefixCls,
  type,
  onClick,
  expanded,
  expandable,
}: ExpandIconProps<RecordType>) {
  const expandClassName = `${prefixCls}-row-expand-icon`;

  if (!expandable) {
    return <span className={clsx(expandClassName, `${prefixCls}-row-spaced`)} />;
  }

  const className = clsx(expandClassName, {
    [`${prefixCls}-row-expanded`]: expanded,
    [`${prefixCls}-row-collapsed`]: !expanded,
  });

  if (type === 'all') {
    return (
      <button
        type="button"
        aria-expanded={expanded}
        aria-label={expanded ? 'Collapse all rows' : 'Expand all rows'}
        className={className}
        onClick={onClick}
      />
    );
  }

  return <span className={className} onClick={onClick} />;
}

export function renderExpandIcon<RecordType>({
  prefixCls,
  record,
  onExpand,
  expanded,
  expandable,
}: RenderExpandIconProps<RecordType>) {
  const onClick: React.MouseEventHandler<HTMLElement> = event => {
    onExpand(record, event);
    event.stopPropagation();
  };

  return (
    <DefaultExpandIcon
      type="row"
      prefixCls={prefixCls}
      record={record}
      expanded={expanded}
      expandable={!!expandable}
      onClick={onClick}
    />
  );
}

export function renderRowExpandIcon<RecordType>(
  ExpandIcon: ExpandIconComponent<RecordType> | undefined,
  fallbackExpandIcon: RenderExpandIcon<RecordType>,
  props: RenderExpandIconProps<RecordType>,
) {
  if (!ExpandIcon) {
    return fallbackExpandIcon(props);
  }

  const { prefixCls, record, onExpand, expanded, expandable } = props;
  const onClick: React.MouseEventHandler<HTMLElement> = event => {
    onExpand(record, event);
    event.stopPropagation();
  };

  return (
    <ExpandIcon
      type="row"
      prefixCls={prefixCls}
      record={record}
      expanded={expanded}
      expandable={!!expandable}
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
