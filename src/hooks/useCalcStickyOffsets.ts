import * as React from 'react';
import { StickyOffsets, TableDirection } from '../interface';

interface ICalcStickyOffsets {
  stickyOffsets: StickyOffsets;
  combinationScrollBarSize: number;
  direction: TableDirection;
  isSticky: boolean;
}

export default function useCalcStickyOffsets({
  stickyOffsets,
  combinationScrollBarSize,
  direction,
  isSticky,
}: ICalcStickyOffsets): StickyOffsets {
  const headerStickyOffsets = React.useMemo(() => {
    const { right, left } = stickyOffsets;
    return {
      ...stickyOffsets,
      left:
        direction === 'rtl' ? [...left.map(width => width + combinationScrollBarSize), 0] : left,
      right:
        direction === 'rtl' ? right : [...right.map(width => width + combinationScrollBarSize), 0],
      isSticky,
    };
  }, [combinationScrollBarSize, stickyOffsets, isSticky]);

  return headerStickyOffsets;
}
