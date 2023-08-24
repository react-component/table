import useMemo from 'rc-util/lib/hooks/useMemo';
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
    (prev, next) => shouldCellUpdate?.(prev, next),
  );
  console.log('shouldCellUpdate', shouldCellUpdate);
  return <>{shouldCellUpdate ? dom : children}</>;
};

export default CustomCell;
