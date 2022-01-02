import { useMemo } from 'react';
import type { StickyOffsets } from '../interface';

/**
 * Get sticky column offset width
 */
function useStickyOffsets(colWidths: number[], columnCount: number, direction: 'ltr' | 'rtl') {
  const stickyOffsets: StickyOffsets = useMemo(() => {
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
  }, [colWidths, columnCount, direction]);

  return stickyOffsets;
}

export default useStickyOffsets;
