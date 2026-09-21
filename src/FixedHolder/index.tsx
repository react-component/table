import { useContext } from '@rc-component/context';
import { clsx } from 'clsx';
import { fillRef } from '@rc-component/util';
import * as React from 'react';
import { useMemo } from 'react';
import ColGroup from '../ColGroup';
import TableContext from '../context/TableContext';
import type { HeaderProps } from '../Header/Header';
import devRenderTimes from '../hooks/useRenderTimes';
import type { ColumnsType, ColumnType, Direction, TableLayout } from '../interface';

function useColumnWidth(colWidths: readonly number[], columCount: number) {
  return useMemo(() => {
    const cloneColumns: number[] = [];
    for (let i = 0; i < columCount; i += 1) {
      const val = colWidths[i];
      if (val !== undefined) {
        cloneColumns[i] = val;
      } else {
        return null;
      }
    }
    return cloneColumns;
  }, [colWidths.join('_'), columCount]);
}

export interface FixedHeaderProps<RecordType> extends HeaderProps<RecordType> {
  className: string;
  style?: React.CSSProperties;
  maxContentScroll: boolean;
  colWidths: readonly number[];
  columCount: number;
  direction: Direction;
  fixHeader: boolean;
  stickyTopOffset?: number;
  stickyBottomOffset?: number;
  stickyClassName?: string;
  scrollX?: number | string | true;
  tableLayout?: TableLayout;
  onScroll: (info: { currentTarget: HTMLDivElement; scrollLeft?: number }) => void;
  children: (info: HeaderProps<RecordType>) => React.ReactNode;
}

const FixedHolder = React.forwardRef<HTMLDivElement, FixedHeaderProps<any>>((props, ref) => {
  if (process.env.NODE_ENV !== 'production') {
    devRenderTimes(props);
  }

  const {
    className,
    style,
    columns,
    flattenColumns,
    colWidths,
    columCount,
    stickyOffsets,
    direction,
    fixHeader,
    stickyTopOffset,
    stickyBottomOffset,
    stickyClassName,
    scrollX,
    tableLayout = 'fixed',
    onScroll,
    maxContentScroll,
    children,
    ...restProps
  } = props;

  const { prefixCls, scrollbarSize, isSticky, getComponent } = useContext(TableContext, [
    'prefixCls',
    'scrollbarSize',
    'isSticky',
    'getComponent',
  ]);

  const TableComponent = getComponent(['header', 'table'], 'table');

  const combinationScrollBarSize = isSticky && !fixHeader ? 0 : scrollbarSize;
  const hasScrollbarColumn = combinationScrollBarSize > 0;
  const scrollbarAdjustedWidth =
    hasScrollbarColumn && scrollX == null
      ? `calc(100% - ${combinationScrollBarSize}px)`
      : undefined;

  // Pass wheel to scroll event
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const setScrollRef = React.useCallback((element: HTMLElement) => {
    fillRef(ref, element);
    fillRef(scrollRef, element);
  }, []);

  React.useEffect(() => {
    function onWheel(e: WheelEvent) {
      const { currentTarget, deltaX } = e as unknown as React.WheelEvent<HTMLDivElement>;
      if (deltaX) {
        const { scrollLeft, scrollWidth, clientWidth } = currentTarget;
        const maxScrollWidth = scrollWidth - clientWidth;
        let nextScroll = scrollLeft + deltaX;

        if (direction === 'rtl') {
          nextScroll = Math.max(-maxScrollWidth, nextScroll);
          nextScroll = Math.min(0, nextScroll);
        } else {
          nextScroll = Math.min(maxScrollWidth, nextScroll);
          nextScroll = Math.max(0, nextScroll);
        }

        onScroll({
          currentTarget,
          scrollLeft: nextScroll,
        });
        e.preventDefault();
      }
    }

    const scrollEle = scrollRef.current;
    scrollEle?.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      scrollEle?.removeEventListener('wheel', onWheel);
    };
  }, []);

  // Add scrollbar column
  const lastColumn = flattenColumns[flattenColumns.length - 1];
  const ScrollBarColumn: ColumnType<unknown> & { scrollbar: true } = {
    fixed: lastColumn ? lastColumn.fixed : null,
    scrollbar: true,
    onHeaderCell: () => ({
      className: `${prefixCls}-cell-scrollbar`,
    }),
  };

  const columnsWithScrollbar = useMemo<ColumnsType<unknown>>(
    () => (hasScrollbarColumn ? [...columns, ScrollBarColumn] : columns),
    [hasScrollbarColumn, columns],
  );

  const flattenColumnsWithScrollbar = useMemo(
    () => (hasScrollbarColumn ? [...flattenColumns, ScrollBarColumn] : flattenColumns),
    [hasScrollbarColumn, flattenColumns],
  );

  // Calculate the sticky offsets
  const headerStickyOffsets = useMemo(() => {
    const { start, end } = stickyOffsets;
    return {
      ...stickyOffsets,
      // left:
      //   direction === 'rtl' ? [...left.map(width => width + combinationScrollBarSize), 0] : left,
      // right:
      //   direction === 'rtl' ? right : [...right.map(width => width + combinationScrollBarSize), 0],
      start: start,
      end: [...end.map(width => width + combinationScrollBarSize), 0],
      isSticky,
    };
  }, [combinationScrollBarSize, stickyOffsets, isSticky]);

  const mergedColumnWidth = useColumnWidth(colWidths, columCount);

  const noMeasuredColumnWidth =
    !mergedColumnWidth ||
    mergedColumnWidth.length !== columCount ||
    mergedColumnWidth.every(width => !width);
  const baseColumnWidths = noMeasuredColumnWidth
    ? flattenColumns.map(({ width }) => width)
    : mergedColumnWidth;
  const headerColumnWidths = hasScrollbarColumn
    ? [...baseColumnWidths, combinationScrollBarSize]
    : baseColumnWidths;
  const headerColumns = hasScrollbarColumn ? flattenColumnsWithScrollbar : flattenColumns;

  return (
    <div
      style={{
        overflow: 'hidden',
        ...(isSticky ? { top: stickyTopOffset, bottom: stickyBottomOffset } : {}),
        ...style,
      }}
      ref={setScrollRef}
      className={clsx(className, {
        [stickyClassName]: !!stickyClassName,
      })}
    >
      <TableComponent
        style={{
          tableLayout,
          minWidth: scrollbarAdjustedWidth || '100%',
          // https://github.com/ant-design/ant-design/issues/54894
          width: scrollX ?? scrollbarAdjustedWidth,
        }}
      >
        <ColGroup
          colWidths={headerColumnWidths}
          columCount={headerColumns.length}
          columns={headerColumns}
        />
        {children({
          ...restProps,
          stickyOffsets: headerStickyOffsets,
          columns: columnsWithScrollbar,
          flattenColumns: flattenColumnsWithScrollbar,
        })}
      </TableComponent>
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') {
  FixedHolder.displayName = 'FixedHolder';
}

/** Return a table in div as fixed element which contains sticky info */
// export default responseImmutable(FixedHolder);
export default React.memo(FixedHolder);
