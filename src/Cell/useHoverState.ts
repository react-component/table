import { useContext } from '@rc-component/context';
import TableContext from '../context/TableContext';
import type { OnHover } from '../hooks/useHover';

/** Check if cell is in hover range */
function inHoverRange(cellStartRow: number, cellRowSpan: number, startRow: number, endRow: number) {
  const cellEndRow = cellStartRow + cellRowSpan - 1;
  return cellStartRow <= endRow && cellEndRow >= startRow;
}

export default function useHoverState(
  rowIndex: number,
  rowSpan: number,
  colIndex: number,
  colSpan: number,
): [hovering: boolean, colHovering: boolean, onRowHover: OnHover, onColHover: OnHover] {
  return useContext(TableContext, ctx => {
    const rowHovering =
      ctx.rowHoverable && inHoverRange(rowIndex, rowSpan || 1, ctx.hoverStartRow, ctx.hoverEndRow);
    const colHovering =
      ctx.colHoverable && inHoverRange(colIndex, colSpan || 1, ctx.hoverStartCol, ctx.hoverEndCol);

    return [rowHovering, colHovering, ctx.onRowHover, ctx.onColHover];
  });
}
