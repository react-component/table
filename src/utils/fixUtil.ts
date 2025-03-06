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

  console.log('fixStart:', colStart);

  // check if need to add shadow
  const fixedStartShadow =
    fixStart !== null && (!columns[colStart + 1] || !isFixedStart(columns[colStart + 1]));
  const fixedEndShadow =
    fixEnd !== null && (!columns[colEnd - 1] || !isFixedEnd(columns[colEnd - 1]));

  // Calc `zIndex`.
  // first fixed start (start -> end) column `zIndex` should be greater than next column.
  // first fixed end (end -> start) column `zIndex` should be greater than next column.
  // TODO: handle this

  return {
    fixStart,
    fixEnd,
    fixedStartShadow,
    fixedEndShadow,
    isSticky: stickyOffsets.isSticky,
  };
}
