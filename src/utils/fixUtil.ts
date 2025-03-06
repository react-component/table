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

  zIndex?: number;

  /** Get the scroll position of the scrollbar at
   * which the current `fixed: start` needs to display a shadow */
  stickyStart?: number;
  /** Get the scroll position of the scrollbar at
   * which the current `fixed: end` needs to display a shadow */
  stickyEnd?: number;
}

function isFixedStart(column: { fixed?: FixedType }) {
  return column.fixed === 'left' || column.fixed === 'start';
}
function isFixedEnd(column: { fixed?: FixedType }) {
  return column.fixed === 'right' || column.fixed === 'end';
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

  if (isFixedStart(startColumn)) {
    fixStart = stickyOffsets.start[colStart];
  } else if (isFixedEnd(endColumn)) {
    fixEnd = stickyOffsets.end[colEnd];
  }

  // check if need to add shadow
  let fixedStartShadow: boolean;
  let fixedEndShadow: boolean;

  // Calc `zIndex`.
  // first fixed start (start -> end) column `zIndex` should be greater than next column.
  // first fixed end (end -> start) column `zIndex` should be greater than next column.
  let zIndex = 0;

  if (fixStart !== null) {
    fixedStartShadow = !columns[colEnd + 1] || !isFixedStart(columns[colEnd + 1]);
    zIndex = columns.length - colStart;
  }
  if (fixEnd !== null) {
    fixedEndShadow = !columns[colStart - 1] || !isFixedEnd(columns[colStart - 1]);
    zIndex = colEnd;
  }

  return {
    fixStart,
    fixEnd,
    fixedStartShadow,
    fixedEndShadow,
    isSticky: stickyOffsets.isSticky,
    zIndex,
  };
}
