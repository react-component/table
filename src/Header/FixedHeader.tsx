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
  stickyOffsets,
  ...props
}: FixedHeaderProps<RecordType>) {
  const headerStickyOffsets = React.useMemo(() => {
    const { right } = stickyOffsets;

    return {
      ...stickyOffsets,
      right: right.map((width, index) =>
        index === columCount - 1 ? width : width + scrollbarSize,
      ),
    };
  }, [stickyOffsets]);

  return (
    <table style={{ tableLayout: 'fixed' }}>
      <colgroup>
        {colWidths.map((width, index) => {
          const colWidth = index === columCount - 1 ? width + scrollbarSize : width;
          return <col key={index} style={{ width: colWidth, minWidth: colWidth }} />;
        })}
      </colgroup>
      <Header {...props} stickyOffsets={headerStickyOffsets} />
    </table>
  );
}

export default FixedHeader;
