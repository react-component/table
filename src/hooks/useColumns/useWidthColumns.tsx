import * as React from 'react';
import type { ColumnsType } from '../../interface';

function parseColWidth(totalWidth: number, width: string | number = '') {
  if (typeof width === 'number') {
    return width;
  }

  if (width.endsWith('%')) {
    return (totalWidth * parseFloat(width)) / 100;
  }
  return null;
}

/**
 * Fill all column with width
 */
export default function useWidthColumns(flattenColumns: ColumnsType<any>, scrollWidth: number) {
  return React.useMemo<[columns: ColumnsType<any>, realScrollWidth: number]>(() => {
    // Fill width if needed
    if (scrollWidth && scrollWidth > 0) {
      let totalWidth = 0;
      let missWidthCount = 0;

      // collect not given width column
      flattenColumns.forEach((col: any) => {
        const colWidth = parseColWidth(scrollWidth, col.width);

        if (colWidth) {
          totalWidth += colWidth;
        } else {
          missWidthCount += 1;
        }
      });

      // Fill width
      let restWidth = scrollWidth - totalWidth;
      let restCount = missWidthCount;
      const avgWidth = restWidth / missWidthCount;

      let realTotal = 0;

      const filledColumns = flattenColumns.map((col: any) => {
        const clone = {
          ...col,
        };

        const colWidth = parseColWidth(scrollWidth, clone.width);

        if (colWidth) {
          clone.width = colWidth;
        } else {
          const colAvgWidth = Math.floor(avgWidth);

          clone.width = restCount === 1 ? restWidth : colAvgWidth;

          restWidth -= colAvgWidth;
          restCount -= 1;
        }

        realTotal += clone.width;

        return clone;
      });

      return [filledColumns, realTotal];
    }

    return [flattenColumns, scrollWidth];
  }, [flattenColumns, scrollWidth]);
}
