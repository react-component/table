import * as React from 'react';
import { RenderExpandIconProps, Key, GetRowKey } from '../interface';

export function renderExpandIcon<RecordType>({
  record,
  onExpand,
  expanded,
  expandable,
}: RenderExpandIconProps<RecordType>) {
  if (!expandable) {
    return null;
  }

  const onClick: React.MouseEventHandler<HTMLElement> = event => {
    onExpand(record, event);
    event.stopPropagation();
  };

  return (
    <button type="button" onClick={onClick}>
      {expanded ? '-' : '+'}
    </button>
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
