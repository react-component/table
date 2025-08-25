import * as React from 'react';
import type { CellProps } from '../Cell';
import Cell from '../Cell';
import useCellResize from './useCellResize';

interface HeaderCellProps<RecordType> extends CellProps<RecordType> {
  columnKey?: React.Key;
  resizable?: boolean;
  minWidth?: number;
  isScrollBarPreviousCell?: boolean;
}

function HeaderCell<RecordType>({
  columnKey,
  resizable,
  minWidth,
  isScrollBarPreviousCell,
  ...cellProps
}: HeaderCellProps<RecordType>) {
  const resizeHandleNode = useCellResize(
    columnKey,
    typeof cellProps.fixEnd === 'number',
    cellProps.prefixCls,
    isScrollBarPreviousCell,
    resizable,
    minWidth,
  );

  return <Cell {...cellProps} appendNode={resizeHandleNode} />;
}

export default HeaderCell;
