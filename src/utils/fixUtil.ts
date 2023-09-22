import type {
  ColumnGroupType,
  ColumnType,
  Direction,
  FixedType,
  StickyOffsets,
} from '../interface';

export interface FixedInfo {
  fixLeft: number | false;
  fixRight: number | false;
  lastFixLeft: boolean;
  firstFixRight: boolean;

  // For Rtl Direction
  lastFixRight: boolean;
  firstFixLeft: boolean;

  isSticky: boolean;
}

function hasColumnChildren<RecordType>(
  column: ColumnType<RecordType> | ColumnGroupType<RecordType>,
): boolean {
  // no children only
  if (!(column as ColumnGroupType<RecordType>)?.children) {
    return true;
  }
  if (
    (column as ColumnGroupType<RecordType>)?.children &&
    (column as ColumnGroupType<RecordType>)?.children.length > 0
  ) {
    return (column as ColumnGroupType<RecordType>)?.children.some(children =>
      hasColumnChildren(children),
    );
  }
}

export function getCellFixedInfo<RecordType = any>(
  colStart: number,
  colEnd: number,
  columns: readonly { fixed?: FixedType }[],
  stickyOffsets: StickyOffsets,
  direction: Direction,
  curColumns?: ColumnType<RecordType> | ColumnGroupType<RecordType>,
): FixedInfo {
  const startColumn = columns[colStart] || {};
  const endColumn = columns[colEnd] || {};

  let fixLeft: number;
  let fixRight: number;

  // RTL layout calculation logic processing
  if (startColumn.fixed === 'left' || endColumn.fixed === 'left') {
    fixLeft = stickyOffsets.left[direction === 'rtl' ? colEnd : colStart];
  } else if (endColumn.fixed === 'right' || startColumn.fixed === 'right') {
    fixRight = stickyOffsets.right[direction === 'rtl' ? colStart : colEnd];
  }

  let lastFixLeft: boolean = false;
  let firstFixRight: boolean = false;

  let lastFixRight: boolean = false;
  let firstFixLeft: boolean = false;

  const nextColumn = columns[colEnd + 1];
  const prevColumn = columns[colStart - 1];

  // iff all children of a cell have exactly one child, then onlyChildren is true
  const hasChildren = hasColumnChildren(curColumns);

  // no children only
  const canLastFix = !(curColumns as ColumnGroupType<RecordType>)?.children || hasChildren;

  if (direction === 'rtl') {
    if (fixLeft !== undefined) {
      const prevFixLeft = prevColumn && prevColumn.fixed === 'left';
      firstFixLeft = !prevFixLeft && canLastFix;
    } else if (fixRight !== undefined) {
      const nextFixRight = nextColumn && nextColumn.fixed === 'right';
      lastFixRight = !nextFixRight && canLastFix;
    }
  } else if (fixLeft !== undefined) {
    const nextFixLeft = nextColumn && nextColumn.fixed === 'left';
    lastFixLeft = !nextFixLeft && canLastFix;
  } else if (fixRight !== undefined) {
    const prevFixRight = prevColumn && prevColumn.fixed === 'right';
    firstFixRight = !prevFixRight && canLastFix;
  }

  return {
    fixLeft,
    fixRight,
    lastFixLeft,
    firstFixRight,
    lastFixRight,
    firstFixLeft,
    isSticky: stickyOffsets.isSticky,
  };
}
