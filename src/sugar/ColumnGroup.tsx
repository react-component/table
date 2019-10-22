import * as React from 'react';
import { ColumnProps } from './Column';
import { ColumnType } from '../interface';

export interface ColumnGroupProps<RecordType> extends Omit<ColumnType<RecordType>, 'children'> {
  children:
    | React.ReactElement<ColumnProps<RecordType>>
    | React.ReactElement<ColumnProps<RecordType>>[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ColumnGroup<RecordType>(_: ColumnGroupProps<RecordType>) {
  return null;
}

export default ColumnGroup;
