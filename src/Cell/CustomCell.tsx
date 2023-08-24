import useMemo from 'rc-util/lib/hooks/useMemo';
import isEqual from 'rc-util/lib/isEqual';
import React from 'react';
import type { ColumnType } from '../interface';

const CustomCell = (props: {
  children?: React.ReactNode;
  shouldCellUpdate?: ColumnType<any>['shouldCellUpdate'];
  record?: any;
}) => {
  const { children, shouldCellUpdate, record } = props;

  const dom = useMemo(
    () => children,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [children, record],
    (prev, next) => {
      if (shouldCellUpdate) {
        const [, prevRecord] = prev;
        const [, nextRecord] = next;
        return shouldCellUpdate(nextRecord, prevRecord);
      }
      return !isEqual(prev, next, true);
    },
  );
  return <>{shouldCellUpdate ? dom : children}</>;
};

export default CustomCell;
