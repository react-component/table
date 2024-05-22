import type { getCellProps } from '../Body/BodyRow';
import TableContext from '../context/TableContext';
import { useContext } from '@rc-component/context';
import { useMemo } from 'react';

function generateRange(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, index) => index + start);
}

export default function useHorizontalVirtual(
  cellPropsCollections: ReturnType<typeof getCellProps>[],
  offsetX: number,
) {
  const { flattenColumns, componentWidth } = useContext(TableContext, [
    'flattenColumns',
    'componentWidth',
  ]);

  const pureCellColSpanCollections = cellPropsCollections.map(
    cell => cell.additionalCellProps.colSpan ?? 1,
  );
  const cellColSpanCollections = useMemo(
    () => pureCellColSpanCollections,
    [pureCellColSpanCollections.join('_')],
  );

  const startIndex = useMemo(() => {
    let virtualStartIndex = flattenColumns.findIndex(col => col.fixed !== 'left');
    let tempOffsetX = offsetX;
    for (let i = virtualStartIndex; i < flattenColumns.length; i++) {
      const colSpan = cellColSpanCollections[i];
      const width = flattenColumns
        .slice(i, i + colSpan)
        .reduce((total, col) => total + (col.width as number), 0);
      tempOffsetX = tempOffsetX - width;
      virtualStartIndex = i;
      if (tempOffsetX < 0) {
        break;
      }
    }
    return virtualStartIndex;
  }, [flattenColumns, offsetX, cellColSpanCollections]);

  const virtualOffset = useMemo(
    () =>
      flattenColumns
        .slice(0, startIndex)
        .reduce(
          (total, cur, colIndex) =>
            flattenColumns[colIndex].fixed === 'left' ? total : total + (cur.width as number),
          0,
        ),
    [flattenColumns, startIndex],
  );

  const endIndex = useMemo(() => {
    let virtualEndIndex = startIndex;

    let availableWidth = flattenColumns.reduce((total, col) => {
      if (!!col.fixed) {
        return total - (col.width as number);
      }
      return total;
    }, componentWidth);

    //  计算当前这个右边部分的距离
    const firstRightWidth =
      (flattenColumns[startIndex].width as number) - (offsetX - virtualOffset);

    for (let i = startIndex; i < flattenColumns.length; i++) {
      if (i === startIndex) {
        availableWidth = availableWidth - firstRightWidth;
      } else {
        availableWidth = availableWidth - (flattenColumns[i].width as number);
      }
      virtualEndIndex = i;
      if (availableWidth <= 0) {
        break;
      }
    }
    return virtualEndIndex;
  }, [componentWidth, flattenColumns, offsetX, virtualOffset, startIndex]);

  const showColumnIndexes = useMemo(() => {
    const fixedLeftIndexes = [];
    const fixedRightIndexes = [];
    flattenColumns.forEach((col, index) => {
      if (col.fixed === 'left') {
        fixedLeftIndexes.push(index);
      }
      if (col.fixed === 'right') {
        fixedRightIndexes.push(index);
      }
    });

    return [...fixedLeftIndexes, ...generateRange(startIndex, endIndex), ...fixedRightIndexes];
  }, [endIndex, flattenColumns, startIndex]);

  return [startIndex, virtualOffset, showColumnIndexes] as const;
}
