import * as React from 'react';
import { ColumnType } from './interface';
import { INTERNAL_COL_DEFINE } from './utils/legacyUtil';

export interface ColGroupProps<RecordType> {
  colWidths: (number | string)[];
  columns?: ColumnType<RecordType>[];
  columCount?: number;
}

function ColGroup<RecordType>({ colWidths, columns, columCount }: ColGroupProps<RecordType>) {
  const cols: React.ReactElement[] = [];
  const len = columCount || columns.length;

  for (let i = 0; i < len; i += 1) {
    const width = colWidths[i];
    const column = columns && columns[i];
    const additionalProps = column && column[INTERNAL_COL_DEFINE];
    cols.push(<col key={i} style={{ width, minWidth: width }} {...additionalProps} />);
  }

  return <colgroup>{cols}</colgroup>;
}

export default ColGroup;
