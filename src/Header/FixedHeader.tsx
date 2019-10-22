import React from 'react';
import getScrollBarSize from 'rc-util/lib/getScrollBarSize';
import Header, { HeaderProps } from './Header';

const scrollbarSize = getScrollBarSize();

export interface FixedHeaderProps<RecordType> extends HeaderProps<RecordType> {
  colWidths: number[];
  columCount: number;
}

function FixedHeader<RecordType>({
  colWidths,
  columCount,
  ...props
}: FixedHeaderProps<RecordType>) {
  return (
    <table style={{ tableLayout: 'fixed' }}>
      <colgroup>
        {colWidths.map((width, index) => {
          const colWidth = index === columCount - 1 ? width + scrollbarSize : width;
          return <col key={index} style={{ width: colWidth, minWidth: colWidth }} />;
        })}
      </colgroup>
      <Header {...props} />
    </table>
  );
}

export default FixedHeader;
