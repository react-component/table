import * as React from 'react';
import { RenderExpandIconProps } from '../interface';

export function renderExpandIcon<RecordType>({
  record,
  onExpand,
  expanded,
  expandable,
}: RenderExpandIconProps<RecordType>) {
  console.log('!!!!', expandable);
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
