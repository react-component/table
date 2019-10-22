import { StickyOffsets, FixedType } from '../interface';

export interface FixedInfo {
  fixLeft: number | false;
  fixRight: number | false;
  lastFixLeft: boolean;
  firstFixRight: boolean;
}

export function getCellFixedInfo(
  colStart: number,
  colEnd: number,
  columns: { fixed?: FixedType }[],
  stickyOffsets: StickyOffsets,
): FixedInfo {
  const startColumn = columns[colStart] || {};
  const endColumn = columns[colEnd] || {};

  let fixLeft: number;
  let fixRight: number;

  if (startColumn.fixed === 'left') {
    fixLeft = stickyOffsets.left[colStart];
  } else if (endColumn.fixed === 'right') {
    fixRight = stickyOffsets.right[colEnd];
  }

  let lastFixLeft: boolean = false;
  let firstFixRight: boolean = false;
  if (fixLeft !== undefined) {
    const nextColumn = columns[colEnd + 1];
    const nextFixLeft = nextColumn && nextColumn.fixed === 'left';
    lastFixLeft = !nextFixLeft;
  } else if (fixRight !== undefined) {
    const prevColumn = columns[colStart - 1];
    const prevFixRight = prevColumn && prevColumn.fixed === 'right';
    firstFixRight = !prevFixRight;
  }

  return {
    fixLeft,
    fixRight,
    lastFixLeft,
    firstFixRight,
  };
}
