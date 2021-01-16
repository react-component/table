import * as React from 'react';
import { useMemo } from 'react';
import classNames from 'classnames';
import { fillRef } from 'rc-util/lib/ref';
import Header, { HeaderProps } from './Header';
import ColGroup from '../ColGroup';
import { ColumnsType, ColumnType } from '../interface';
import TableContext from '../context/TableContext';
import useScrollBarColumns from '../hooks/useScrollBarColumns';
import useCalcStickyOffsets from '../hooks/useCalcStickyOffsets';

function useColumnWidth(colWidths: number[], columCount: number) {
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
  colWidths: number[];
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
    const { combinationScrollBarSize, columnsWithScrollbar } = useScrollBarColumns<ColumnsType<unknown>>({
      columns,
      prefixCls,
      scrollbarSize,
      isSticky,
      fixHeader,
    });

    const { columnsWithScrollbar: flattenColumnsWithScrollbar } = useScrollBarColumns<
      ColumnType<unknown>[]
    >({
      columns: flattenColumns,
      prefixCls,
      scrollbarSize,
      isSticky,
      fixHeader,
    });

    // Calculate the sticky offsets
    const headerStickyOffsets = useCalcStickyOffsets({
      stickyOffsets,
      combinationScrollBarSize,
      direction,
      isSticky,
    });

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
