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
