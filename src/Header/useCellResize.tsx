import TableContext from '../context/TableContext';
import { useContext } from '@rc-component/context';
import { useEvent } from 'rc-util';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function useCellResize(
  columnKey: React.Key,
  isFixLeft: boolean,
  isFixRight: boolean,
  cellPrefixCls: string,
  resizable?: boolean,
  minWidth: number = 0,
) {
  const {
    direction,
    colsWidths,
    colsKeys,
    colWidths,
    componentWidth,
    fullTableRef,
    scrollbarSize,
    onColumnResizeComplete,
    onResizingChange,
  } = useContext(TableContext, [
    'direction',
    'colWidths',
    'colsKeys',
    'colsWidths',
    'componentWidth',
    'fullTableRef',
    'scrollbarSize',
    'onColumnResizeComplete',
    'onResizingChange',
  ]);
  const [isResizing, setIsResizing] = useState(false);
  const [lineLeft, setLineLeft] = useState(0);
  const lineStartLeftRef = useRef(0);
  const startRealWidth = useRef(0);
  const startPageX = useRef(0);
  const mouseMoveRef = useRef<(event: MouseEvent) => void>(null);
  const mouseUpRef = useRef<(event: MouseEvent) => void>(null);

  // handle position
  const isRightHandle = direction === 'rtl' ? isFixLeft : !isFixRight;

  const removeResizeListener = () => {
    document.body.removeEventListener('mousemove', mouseMoveRef.current);
    document.body.removeEventListener('mouseup', mouseUpRef.current);
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
      let addWidthColumnKey: React.Key;
      const isDecreasingWidth = oldWidth - newWidth > 0;
      if (smallThanWidth > 0 && isDecreasingWidth) {
        const index = colsKeys.findIndex(key => key === columnKey);
        addWidthColumnKey = colsKeys[index + 1] ?? colsKeys[index - 1];
      }

      const columnWidthsMap = new Map(colsWidths);
      columnWidthsMap.set(columnKey, newWidth);
      if (addWidthColumnKey) {
        const addWidthColumnNewWidth = colsWidths.get(addWidthColumnKey) + smallThanWidth;
        columnWidthsMap.set(addWidthColumnKey, addWidthColumnNewWidth);
      }
      const columnWidths = Array.from(columnWidthsMap).map(([key, width]) => ({
        columnKey: key,
        width,
      }));
      onColumnResizeComplete?.({ columnKey, width: newWidth, columnWidths });
    }
  });

  const onResizeEnd = (event: MouseEvent) => {
    setIsResizing(false);
    onResizingChange(false);
    removeResizeListener();
    onResize(event, true);
  };

  const onResizeStart = (event: React.MouseEvent) => {
    // Block selected text
    event.preventDefault();
    const left =
      (event.target as HTMLElement).parentElement.getBoundingClientRect()[
        isRightHandle ? 'right' : 'left'
      ] - fullTableRef.current.getBoundingClientRect().left;
    setLineLeft(left);
    lineStartLeftRef.current = left;
    startRealWidth.current = colsWidths.get(columnKey);
    startPageX.current = event.pageX;
    document.body.addEventListener('mousemove', onResize);
    document.body.addEventListener('mouseup', onResizeEnd);
    mouseMoveRef.current = onResize;
    mouseUpRef.current = onResizeEnd;
    onResizingChange(true);
    setIsResizing(true);
  };

  const resizeHandleNode = resizable && (
    <>
      <div
        className={`${cellPrefixCls}-resize-handle`}
        style={{ display: isResizing ? 'none' : undefined }}
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
