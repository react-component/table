import React from 'react';
import toArray from 'rc-util/lib/Children/toArray';
import { ColumnType } from '../interface';

// TODO: handle nest column
export function convertChildrenToColumn<RecordType>(
  children: React.ReactNode,
): ColumnType<RecordType>[] {
  return toArray(children).map(({ key, props }) => ({
    key,
    ...props,
  }));
}
