import { useContext } from '@rc-component/context';
import classNames from 'classnames';
import { fillRef } from 'rc-util/lib/ref';
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
  noData: boolean;
  colWidths: readonly number[];
  columCount: number;
  direction: Direction;
  fixHeader: boolean;
  stickyTopOffset?: number;
  stickyBottomOffset?: number;
  stickyClassName?: string;
  scrollTableStyle?: React.CSSProperties;
  tableLayout?: TableLayout;
  onScroll: (info: { currentTarget: HTMLDivElement; scrollLeft?: number }) => void;
  children: (info: HeaderProps<RecordType>) => React.ReactNode;
  colGroup?: React.ReactNode;
}

const FixedHolder = React.forwardRef<HTMLDivElement, FixedHeaderProps<any>>((props, ref) => {
  if (process.env.NODE_ENV !== 'production') {
    devRenderTimes(props);
  }

  const {
    className,
    noData,
    columns,
    flattenColumns,
    colWidths,
    colGroup,
    columCount,
    stickyOffsets,
    direction,
    fixHeader,
    stickyTopOffset,
    stickyBottomOffset,
    stickyClassName,
    scrollTableStyle,
    tableLayout = 'fixed',
    onScroll,
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
        onScroll({ currentTarget, scrollLeft: currentTarget.scrollLeft + deltaX });
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
    () => (combinationScrollBarSize ? [...columns, ScrollBarColumn] : columns),
    [combinationScrollBarSize, columns],
  );

  const flattenColumnsWithScrollbar = useMemo(
    () => (combinationScrollBarSize ? [...flattenColumns, ScrollBarColumn] : flattenColumns),
    [combinationScrollBarSize, flattenColumns],
  );

  // Calculate the sticky offsets
  const headerStickyOffsets = useMemo(() => {
    const { right, left } = stickyOffsets;
    return {
      ...stickyOffsets,
      left:
        direction === 'rtl' ? [...left.map(width => width + combinationScrollBarSize), 0] : left,
      right:
        direction === 'rtl' ? right : [...right.map(width => width + combinationScrollBarSize), 0],
      isSticky,
    };
  }, [combinationScrollBarSize, stickyOffsets, isSticky]);

  const mergedColumnWidth = useColumnWidth(colWidths, columCount);

  const colGroupNode = useMemo(() => {
    // use original ColGroup if no data or no calculated column width, otherwise use calculated column width
    if (noData || !mergedColumnWidth) {
      return colGroup;
    }
    return (
      <ColGroup
        colWidths={[...mergedColumnWidth, combinationScrollBarSize]}
        columCount={columCount + 1}
        columns={flattenColumnsWithScrollbar}
      />
    );
  }, [noData, mergedColumnWidth, colGroup, combinationScrollBarSize, columCount, flattenColumnsWithScrollbar]);

  return (
    <div
      style={{
        overflow: 'hidden',
        ...(isSticky ? { top: stickyTopOffset, bottom: stickyBottomOffset } : {}),
      }}
      ref={setScrollRef}
      className={classNames(className, {
        [stickyClassName]: !!stickyClassName,
      })}
    >
      <TableComponent
        style={{
          tableLayout,
          visibility: noData || mergedColumnWidth ? null : 'hidden',
          ...scrollTableStyle,
        }}
      >
        {colGroupNode}
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
