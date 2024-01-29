import { useMemo } from 'react';
import type { ColumnType, Direction, StickyOffsets } from '../interface';

/**
 * Get sticky column offset width
 */
function useStickyOffsets<RecordType>(
  colWidths: number[],
  flattenColumns: readonly ColumnType<RecordType>[],
  direction: Direction,
) {
  const stickyOffsets: StickyOffsets = useMemo(() => {
    const columnCount = flattenColumns.length;

    const leftOffsets: number[] = [];
    const rightOffsets: number[] = [];
    let left = 0;
    let right = 0;

    for (let start = 0; start < columnCount; start += 1) {
      if (direction === 'rtl') {
        // Left offset
        rightOffsets[start] = right;
        right += colWidths[start] || 0;

        // Right offset
        const end = columnCount - start - 1;
        leftOffsets[end] = left;
        left += colWidths[end] || 0;
      } else {
        // Left offset
        leftOffsets[start] = left;
        left += colWidths[start] || 0;

        // Right offset
        const end = columnCount - start - 1;
        rightOffsets[end] = right;
        right += colWidths[end] || 0;
      }
    }

    return {
      left: leftOffsets,
      right: rightOffsets,
    };
  }, [colWidths, flattenColumns, direction]);

  return stickyOffsets;
}

export default useStickyOffsets;
