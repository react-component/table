import * as React from 'react';
import classNames from 'classnames';
import { RenderExpandIconProps, Key, GetRowKey } from '../interface';

export function renderExpandIcon<RecordType>({
  prefixCls,
  record,
  onExpand,
  expanded,
  expandable,
}: RenderExpandIconProps<RecordType>) {
  const expandClassName = `${prefixCls}-row-expand-icon`;

  if (!expandable) {
    return <span className={classNames(expandClassName, `${prefixCls}-row-spaced`)} />;
  }

  const onClick: React.MouseEventHandler<HTMLElement> = event => {
    onExpand(record, event);
    event.stopPropagation();
  };

  return (
    <span
      className={classNames(expandClassName, {
        [`${prefixCls}-row-expanded`]: expanded,
        [`${prefixCls}-row-collapsed`]: !expanded,
      })}
      onClick={onClick}
    />
  );
}

export function findAllChildrenKeys<RecordType>(
  data: RecordType[],
  getRowKey: GetRowKey<RecordType>,
): Key[] {
  const keys: Key[] = [];

  function dig(list: RecordType[]) {
    (list || []).forEach((item, index) => {
      keys.push(getRowKey(item, index));

      dig(((item as unknown) as { children: RecordType[] }).children);
    });
  }

  dig(data);

  return keys;
}
