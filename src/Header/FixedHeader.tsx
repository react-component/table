import * as React from 'react';
import { useMemo } from 'react';
import classNames from 'classnames';
import { fillRef } from 'rc-util/lib/ref';
import Header, { HeaderProps } from './Header';
import ColGroup from '../ColGroup';
import { ColumnsType, ColumnType } from '../interface';
import TableContext from '../context/TableContext';

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
  noData: boolean;
  colWidths: readonly number[];
  columCount: number;
  direction: 'ltr' | 'rtl';
  fixHeader: boolean;
  offsetHeader: number;
  stickyClassName?: string;
  onScroll: (info: { currentTarget: HTMLDivElement; scrollLeft?: number }) => void;
}

const FixedHeader = React.forwardRef<HTMLDivElement, FixedHeaderProps<unknown>>(
  (
    {
      noData,
      columns,
      flattenColumns,
      colWidths,
      columCount,
      stickyOffsets,
      direction,
      fixHeader,
      offsetHeader,
      stickyClassName,
      onScroll,
      ...props
    },
    ref,
  ) => {
    const { prefixCls, scrollbarSize, isSticky } = React.useContext(TableContext);

    const combinationScrollBarSize = isSticky && !fixHeader ? 0 : scrollbarSize;

    // Pass wheel to scroll event
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const setScrollRef = React.useCallback((element: HTMLElement) => {
      fillRef(ref, element);
      fillRef(scrollRef, element);
    }, []);

    React.useEffect(() => {
      function onWheel(e: WheelEvent) {
        const { currentTarget, deltaX } = (e as unknown) as React.WheelEvent<HTMLDivElement>;
        if (deltaX) {
          onScroll({ currentTarget, scrollLeft: currentTarget.scrollLeft + deltaX });
          e.preventDefault();
        }
      }
      scrollRef.current?.addEventListener('wheel', onWheel);

      return () => {
        scrollRef.current?.removeEventListener('wheel', onWheel);
      };
    }, []);

    // Add scrollbar column
    const lastColumn = flattenColumns[flattenColumns.length - 1];
    const ScrollBarColumn: ColumnType<unknown> = {
      fixed: lastColumn ? lastColumn.fixed : null,
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
          direction === 'rtl'
            ? right
            : [...right.map(width => width + combinationScrollBarSize), 0],
        isSticky,
      };
    }, [combinationScrollBarSize, stickyOffsets, isSticky]);

    const mergedColumnWidth = useColumnWidth(colWidths, columCount);

    return (
      <div
        style={{
          overflow: 'hidden',
          ...(isSticky ? { top: offsetHeader } : {}),
        }}
        ref={setScrollRef}
        className={classNames(`${prefixCls}-header`, {
          [stickyClassName]: !!stickyClassName,
        })}
      >
        <table
          style={{
            tableLayout: 'fixed',
            visibility: noData || mergedColumnWidth ? null : 'hidden',
          }}
        >
          <ColGroup
            colWidths={mergedColumnWidth ? [...mergedColumnWidth, combinationScrollBarSize] : []}
            columCount={columCount + 1}
            columns={flattenColumnsWithScrollbar}
          />
          <Header
            {...props}
            stickyOffsets={headerStickyOffsets}
            columns={columnsWithScrollbar}
            flattenColumns={flattenColumnsWithScrollbar}
          />
        </table>
      </div>
    );
  },
);

FixedHeader.displayName = 'FixedHeader';

export default FixedHeader;
