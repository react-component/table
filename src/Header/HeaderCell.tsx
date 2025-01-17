import * as React from 'react';
import type { CellProps } from '../Cell';
import Cell from '../Cell';
import useCellResize from './useCellResize';

interface HeaderCellProps<RecordType> extends CellProps<RecordType> {
  isFixLeft: boolean;
  isFixRight: boolean;
  columnKey?: React.Key;
  resizable?: boolean;
  minWidth?: number;
}

function HeaderCell<RecordType>({
  isFixLeft,
  isFixRight,
  columnKey,
  resizable,
  minWidth,
  ...cellProps
}: HeaderCellProps<RecordType>) {
  const { prefixCls } = cellProps;

  const cellPrefixCls = `${prefixCls}-cell`;

  const resizeHandleNode = useCellResize(
    columnKey,
    isFixLeft,
    isFixRight,
    cellPrefixCls,
    resizable,
    minWidth,
  );

  return <Cell {...cellProps} appendNode={resizeHandleNode} />;
}

export default HeaderCell;
