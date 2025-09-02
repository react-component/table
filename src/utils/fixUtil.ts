import type { FixedType, StickyOffsets } from '../interface';

export interface FixedInfo {
  fixStart: number | false;
  fixEnd: number | false;

  isSticky: boolean;

  // Position info(for shadow usage)
  /** `fixed: start` with shadow */
  fixedStartShadow?: boolean;
  /** `fixed: end` with shadow */
  fixedEndShadow?: boolean;

  /** Show the shadow when `scrollLeft` arrive for `fixed: start` */
  offsetFixedStartShadow?: number;
  /** Show the shadow when `scrollLeft` arrive for `fixed: end` */
  offsetFixedEndShadow?: number;

  /** First sticky column `zIndex` will be larger than next */
  zIndex?: number;
  /** First sticky column `zIndex` will be smaller than next */
  zIndexReverse?: number;
}

function isFixedStart(column: { fixed?: FixedType }) {
  return column.fixed === 'start';
}
function isFixedEnd(column: { fixed?: FixedType }) {
  return column.fixed === 'end';
}

export function getCellFixedInfo(
  colStart: number,
  colEnd: number,
  columns: readonly { fixed?: FixedType }[],
  stickyOffsets: StickyOffsets,
): FixedInfo {
  const startColumn = columns[colStart] || {};
  const endColumn = columns[colEnd] || {};

  let fixStart: number = null;
  let fixEnd: number = null;

  if (isFixedStart(startColumn) && isFixedStart(endColumn)) {
    fixStart = stickyOffsets.start[colStart];
  } else if (isFixedEnd(endColumn) && isFixedEnd(startColumn)) {
    fixEnd = stickyOffsets.end[colEnd];
  }

  // check if need to add shadow
  let fixedStartShadow = false;
  let fixedEndShadow = false;

  // Calc `zIndex`.
  // first fixed start (start -> end) column `zIndex` should be greater than next column.
  // first fixed end (end -> start) column `zIndex` should be greater than next column.
  let zIndex = 0;
  let zIndexReverse = 0;

  if (fixStart !== null) {
    fixedStartShadow = !columns[colEnd + 1] || !isFixedStart(columns[colEnd + 1]);
    zIndex = columns.length * 2 - colStart; // Fix start always overlay fix end
    zIndexReverse = columns.length + colStart;
  }
  if (fixEnd !== null) {
    fixedEndShadow = !columns[colStart - 1] || !isFixedEnd(columns[colStart - 1]);
    zIndex = colEnd;
    zIndexReverse = columns.length - colEnd; // Fix end always overlay fix start
  }

  // Check if scrollLeft will show the shadow
  let offsetFixedStartShadow = 0;
  let offsetFixedEndShadow = 0;

  if (fixedStartShadow) {
    for (let i = 0; i < colStart; i += 1) {
      if (!isFixedStart(columns[i])) {
        offsetFixedStartShadow += stickyOffsets.widths[i] || 0;
      }
    }
  }
  if (fixedEndShadow) {
    for (let i = columns.length - 1; i > colEnd; i -= 1) {
      if (!isFixedEnd(columns[i])) {
        offsetFixedEndShadow += stickyOffsets.widths[i] || 0;
      }
    }
  }

  return {
    fixStart,
    fixEnd,
    fixedStartShadow,
    fixedEndShadow,
    offsetFixedStartShadow,
    offsetFixedEndShadow,
    isSticky: stickyOffsets.isSticky,
    zIndex,
    zIndexReverse,
  };
}
