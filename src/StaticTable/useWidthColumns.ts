import * as React from 'react';
import type { ColumnsType } from '../interface';

function parseColWidth(totalWidth: number, width: string | number = '') {
  if (typeof width === 'number') {
    return width;
  }

  if (width.endsWith('%')) {
    return (totalWidth * parseFloat(width)) / 100;
  }
  return null;
}

export default function useWidthColumns<RecordType>(
  columns: ColumnsType<RecordType>,
  scrollX?: number,
) {
  const filledWidthColumns = React.useMemo(() => {
    if (typeof scrollX === 'number') {
      let totalWidth = 0;
      let missWidthCount = 0;

      // Statistic width
      const calculateWidth = (cols: ColumnsType<RecordType>) => {
        cols.forEach((col: any) => {
          if (col.width) {
            const colWidth = parseColWidth(scrollX, col.width);
            if (colWidth) {
              totalWidth += colWidth;
            }
            return;
          }

          // Dig children
          if (col.children?.length) {
            calculateWidth(col.children);
          } else {
            missWidthCount += 1;
          }
        });
      };

      calculateWidth(columns);

      // Fill width
      let restWidth = scrollX - totalWidth;
      let restCount = missWidthCount;
      const avgWidth = restWidth / missWidthCount;

      const fillWidth = (cols: ColumnsType<RecordType>) =>
        cols.map((col: any) => {
          const clone = { ...col };

          const colWidth = parseColWidth(scrollX, clone.width);
          const hasChildren = col.children?.length;

          if (hasChildren) {
            clone.children = fillWidth(col.children);
          }

          if (colWidth) {
            clone.width = colWidth;
          } else if (!hasChildren) {
            const colAvgWidth = Math.floor(avgWidth);

            clone.width = restCount === 1 ? restWidth : colAvgWidth;

            restWidth -= colAvgWidth;
            restCount -= 1;
          }

          return clone;
        });

      return fillWidth(columns);
    }

    return columns;
  }, [columns, scrollX]);

  return filledWidthColumns;
}
