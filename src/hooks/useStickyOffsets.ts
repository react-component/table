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

    const getOffsets = (startIndex: number, endIndex: number, offset: number) => {
      const offsets: number[] = [];
      let total = 0;

      for (let i = startIndex; i !== endIndex; i += offset) {
        offsets.push(total);

        if (flattenColumns[i].fixed) {
          total += colWidths[i] || 0;
        }
      }

      return offsets;
    };

    const startOffsets = getOffsets(0, columnCount, 1);
    const endOffsets = getOffsets(columnCount - 1, -1, -1).reverse();

    return direction === 'rtl'
      ? {
          left: endOffsets,
          right: startOffsets,
        }
      : {
          left: startOffsets,
          right: endOffsets,
        };
  }, [colWidths, flattenColumns, direction]);

  return stickyOffsets;
}

export default useStickyOffsets;
