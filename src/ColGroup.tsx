import * as React from 'react';

export interface ColGroupProps {
  colWidths: number[];
  columCount: number;
}

function ColGroup({ colWidths, columCount }: ColGroupProps) {
  const cols: React.ReactElement[] = [];

  for (let i = 0; i < columCount; i += 1) {
    const width = colWidths[i];
    cols.push(<col key={i} style={{ width, minWidth: width }} />);
  }

  return <colgroup>{cols}</colgroup>;
}

export default ColGroup;
