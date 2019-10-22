import { useMemo } from 'react';
import { StickyOffsets } from '../interface';

/**
 * Get sticky column offset width
 */
function useStickyOffsets(colWidths: number[], columCount: number) {
  const stickyOffsets: StickyOffsets = useMemo(() => {
    const leftOffsets: number[] = [];
    const rightOffsets: number[] = [];
    let left = 0;
    let right = 0;

    for (let start = 0; start < columCount; start += 1) {
      // Left offset
      leftOffsets[start] = left;
      left += colWidths[start] || 0;

      // Right offset
      const end = columCount - start - 1;
      rightOffsets[end] = right;
      right += colWidths[end] || 0;
    }

    return {
      left: leftOffsets,
      right: rightOffsets,
    };
  }, [colWidths]);

  return stickyOffsets;
}

export default useStickyOffsets;
