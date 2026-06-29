import { useMemo } from 'react';
import type { ColumnType, StickyOffsets } from '../interface';

/**
 * Get sticky column offset width
 * @param colWidths - Column widths array
 * @param flattenColumns - Flattened columns
 * @param rowContext - Optional row context for dynamic colSpan calculation
 */
function useStickyOffsets<RecordType>(
  colWidths: number[],
  flattenColumns: readonly ColumnType<RecordType>[],
  rowContext?: { record: RecordType; rowIndex: number },
) {
  const stickyOffsets = useMemo<StickyOffsets>(() => {
    const columnCount = flattenColumns.length;

    const getOffsets = (startIndex: number, endIndex: number, offset: number) => {
      const offsets: number[] = [];
      let total = 0;

      for (let i = startIndex; i !== endIndex; i += offset) {
        const column = flattenColumns[i];

        offsets.push(total);

        let colSpan = 1;
        if (rowContext) {
          const cellProps = column.onCell?.(rowContext.record, rowContext.rowIndex) || {};
          colSpan = cellProps.colSpan ?? 1;
        }

        if (column.fixed && colSpan !== 0) {
          total += colWidths[i] || 0;
        }
      }

      return offsets;
    };

    const startOffsets = getOffsets(0, columnCount, 1);
    const endOffsets = getOffsets(columnCount - 1, -1, -1).reverse();

    return {
      start: startOffsets,
      end: endOffsets,
      widths: colWidths,
    };
  }, [colWidths, flattenColumns, rowContext]);

  return stickyOffsets;
}

export default useStickyOffsets;
