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
  let fixedStartShadow: boolean;
  let fixedEndShadow: boolean;

  // Calc `zIndex`.
  // first fixed start (start -> end) column `zIndex` should be greater than next column.
  // first fixed end (end -> start) column `zIndex` should be greater than next column.
  let zIndex = 0;

  if (fixStart !== null) {
    fixedStartShadow = !columns[colEnd + 1] || !isFixedStart(columns[colEnd + 1]);
    zIndex = columns.length * 2 - colStart; // Fix start always overlay fix end
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
