import TableContext from '../context/TableContext';
import { useContext } from '@rc-component/context';
import { useEvent } from 'rc-util';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function useCellResize(
  columnKey: React.Key,
  isFixEnd: boolean,
  prefixCls: string,
  isScrollBarPreviousCell?: boolean,
  resizable?: boolean,
  minWidth: number = 0,
) {
  const cellPrefixCls = `${prefixCls}-cell`;

  const {
    direction,
    colsWidths,
    colsKeys,
    colWidths,
    componentWidth,
    fullTableRef,
    scrollbarSize,
    onColumnResizeEnd,
    onResizingChange,
  } = useContext(TableContext, [
    'direction',
    'colWidths',
    'colsKeys',
    'colsWidths',
    'componentWidth',
    'fullTableRef',
    'scrollbarSize',
    'onColumnResizeEnd',
    'onResizingChange',
  ]);
  const [isResizing, setIsResizing] = useState(false);
  const [lineLeft, setLineLeft] = useState(0);
  const lineStartLeftRef = useRef(0);
  const startRealWidth = useRef(0);
  const startPageX = useRef(0);
  const mouseMoveRef = useRef<(event: MouseEvent) => void>(null);
  const mouseUpRef = useRef<(event: MouseEvent) => void>(null);

  const isRtl = direction === 'rtl';
  // inline-end
  const isEndHandle = !isFixEnd;
  // right
  const isRightHandle = isRtl ? isFixEnd : isEndHandle;

  const removeResizeListener = () => {
    document.removeEventListener('mousemove', mouseMoveRef.current);
    document.removeEventListener('mouseup', mouseUpRef.current);
  };

  useEffect(() => removeResizeListener, []);

  const onResize = useEvent((event: MouseEvent, isResizeEnd?: boolean) => {
    const offset = event.pageX - startPageX.current;
    const oldWidth = colsWidths.get(columnKey);
    let newWidth = startRealWidth.current + (isRightHandle ? offset : -offset);

    if (newWidth < minWidth) {
      newWidth = minWidth;
    }
    setLineLeft(
      lineStartLeftRef.current +
        (isRightHandle ? newWidth - startRealWidth.current : startRealWidth.current - newWidth),
    );

    if (isResizeEnd) {
      const totalWidth = colWidths.reduce((total, width) => total + width, 0);
      const smallThanWidth = componentWidth - scrollbarSize - (totalWidth - oldWidth + newWidth);
      // If it is less than the width of the table, the remaining width will be allocated to the column on the right.
      // If there is no column on the right, it will be allocated to the column on the left.
      let increaseWidthColumnKey: React.Key;
      const isDecreaseWidth = oldWidth - newWidth > 0;
      if (smallThanWidth > 0 && isDecreaseWidth) {
        const index = colsKeys.findIndex(key => key === columnKey);
        increaseWidthColumnKey = colsKeys[index + 1] ?? colsKeys[index - 1];
      }

      const columnWidthsMap = new Map(colsWidths);
      columnWidthsMap.set(columnKey, newWidth);
      if (increaseWidthColumnKey) {
        const addWidthColumnNewWidth = colsWidths.get(increaseWidthColumnKey) + smallThanWidth;
        columnWidthsMap.set(increaseWidthColumnKey, addWidthColumnNewWidth);
      }
      const columnWidths = Array.from(columnWidthsMap).map(([key, width]) => ({
        columnKey: key,
        width,
      }));

      onColumnResizeEnd?.({ columnKey, width: newWidth, columnWidths });
    }
  });

  const onResizeEnd = (event: MouseEvent) => {
    setIsResizing(false);
    onResizingChange(false);
    removeResizeListener();
    onResize(event, true);
  };

  const onResizeStart = (event: React.MouseEvent) => {
    removeResizeListener();
    // Prevent selected text
    event.preventDefault();
    const scrollBarOffset = isScrollBarPreviousCell && isEndHandle ? scrollbarSize : 0;
    const left =
      (event.target as HTMLElement).parentElement.getBoundingClientRect()[
        isRightHandle ? 'right' : 'left'
      ] -
      fullTableRef.current.getBoundingClientRect().left +
      (isRtl ? -scrollBarOffset : scrollBarOffset);
    setLineLeft(left);
    lineStartLeftRef.current = left;
    startRealWidth.current = colsWidths.get(columnKey);
    startPageX.current = event.pageX;
    document.addEventListener('mousemove', onResize);
    document.addEventListener('mouseup', onResizeEnd);
    mouseMoveRef.current = onResize;
    mouseUpRef.current = onResizeEnd;
    onResizingChange(true);
    setIsResizing(true);
  };

  const resizeHandleNode = resizable && (
    <>
      <div
        className={`${cellPrefixCls}-resize-handle`}
        style={{
          display: isResizing ? 'none' : undefined,
          ...(isEndHandle
            ? { insetInlineEnd: isScrollBarPreviousCell ? -scrollbarSize : 0 }
            : { insetInlineStart: 0 }),
        }}
        onMouseDown={onResizeStart}
      />
      {isResizing &&
        createPortal(
          <div
            className={`${cellPrefixCls}-resize-line`}
            style={{
              left: lineLeft,
            }}
          />,
          fullTableRef.current,
        )}
    </>
  );

  return resizeHandleNode;
}
