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

  // Only insert col with width & additional props
  // Skip if rest col do not have any useful info
  let mustInsert = false;
  for (let i = len - 1; i >= 0; i -= 1) {
    const width = colWidths[i];
    const column = columns && columns[i];
    const additionalProps = column && column[INTERNAL_COL_DEFINE];

    if (width || additionalProps || mustInsert) {
      cols.unshift(<col key={i} style={{ width, minWidth: width }} {...additionalProps} />);
      mustInsert = true;
    }
  }

  return <colgroup>{cols}</colgroup>;
}

export default ColGroup;
