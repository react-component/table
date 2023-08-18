import { responseImmutable, useContext } from '@rc-component/context';
import classNames from 'classnames';
import VirtualList, { type ListProps, type ListRef } from 'rc-virtual-list';
import * as React from 'react';
import TableContext from '../context/TableContext';
import useFlattenRecords, { type FlattenData } from '../hooks/useFlattenRecords';
import type { ColumnType, OnCustomizeScroll } from '../interface';
import BodyLine from './BodyLine';
import { GridContext, StaticContext } from './context';
import { RowSpanVirtualCell } from './VirtualCell';

export interface GridProps<RecordType = any> {
  data: RecordType[];
  onScroll: OnCustomizeScroll;
}

export interface GridRef {
  scrollLeft: number;
}

const Grid = React.forwardRef<GridRef, GridProps>((props, ref) => {
  const { data, onScroll } = props;

  const { flattenColumns, onColumnResize, getRowKey, expandedKeys, prefixCls, childrenColumnName } =
    useContext(TableContext, [
      'flattenColumns',
      'onColumnResize',
      'getRowKey',
      'prefixCls',
      'expandedKeys',
      'childrenColumnName',
    ]);
  const { scrollY, scrollX } = useContext(StaticContext);

  // =========================== Ref ============================
  const listRef = React.useRef<ListRef>();

  // =========================== Data ===========================
  const flattenData = useFlattenRecords(data, childrenColumnName, expandedKeys, getRowKey);

  // ========================== Column ==========================
  const columnsWidth = React.useMemo<[key: React.Key, width: number, total: number][]>(() => {
    let total = 0;
    return flattenColumns.map(({ width, key }) => {
      total += width as number;
      return [key, width as number, total];
    });
  }, [flattenColumns]);

  const columnsOffset = React.useMemo<number[]>(
    () => columnsWidth.map(colWidth => colWidth[2]),
    [columnsWidth],
  );

  React.useEffect(() => {
    columnsWidth.forEach(([key, width]) => {
      onColumnResize(key, width);
    });
  }, [columnsWidth]);

  // =========================== Ref ============================
  React.useImperativeHandle(ref, () => {
    const obj = {} as GridRef;

    Object.defineProperty(obj, 'scrollLeft', {
      get: () => listRef.current.getScrollInfo().x,

      set: (value: number) => {
        listRef.current.scrollTo({
          left: value,
        });
      },
    });

    return obj;
  });

  // ======================= Col/Row Span =======================
  const getRowSpan = (column: ColumnType<any>, index: number): number => {
    const record = flattenData[index]?.record;
    const { onCell } = column;

    if (onCell) {
      const cellProps = onCell(record, index) as React.TdHTMLAttributes<HTMLElement>;
      return cellProps?.rowSpan ?? 1;
    }
    return 1;
  };

  const extraRender: ListProps<any>['extraRender'] = info => {
    const { start, end, getSize, offsetY } = info;

    // Find first rowSpan column
    let firstRowSpanColumns = flattenColumns.filter(
      // rowSpan is 0
      column => getRowSpan(column, start) === 0,
    );

    let startIndex = start;
    for (let i = start; i >= 0; i -= 1) {
      firstRowSpanColumns = firstRowSpanColumns.filter(column => getRowSpan(column, i) === 0);

      if (!firstRowSpanColumns.length) {
        startIndex = i;
        break;
      }
    }

    // Find last rowSpan column
    let lastRowSpanColumns = flattenColumns.filter(
      // rowSpan is not 1
      column => getRowSpan(column, end) !== 1,
    );

    let endIndex = end;
    for (let i = end; i < flattenData.length; i += 1) {
      lastRowSpanColumns = lastRowSpanColumns.filter(column => getRowSpan(column, i) !== 1);

      if (!lastRowSpanColumns.length) {
        endIndex = Math.max(i - 1, end);
        break;
      }
    }

    // Loop create the rowSpan cell
    const nodes: React.ReactElement[] = [];

    for (let i = startIndex; i <= endIndex; i += 1) {
      const item = flattenData[i];
      if (!item) {
        continue;
      }

      const rowKey = getRowKey(item.record, i);

      flattenColumns.forEach((column, colIndex) => {
        const rowSpan = getRowSpan(column, i);

        if (rowSpan > 1) {
          const endItemIndex = i + rowSpan - 1;
          const endItem = flattenData[endItemIndex];
          const endKey = getRowKey(endItem.record, endItemIndex);

          const sizeInfo = getSize(rowKey, endKey);
          const left = columnsOffset[colIndex - 1] || 0;

          nodes.push(
            <RowSpanVirtualCell
              top={-offsetY + sizeInfo.top}
              height={sizeInfo.bottom - sizeInfo.top}
              left={left}
              key={`${i}_${colIndex}`}
              record={item.record}
              rowKey={rowKey}
              column={column}
              colIndex={colIndex}
              index={i}
              indent={0}
              style={{
                ['--sticky-left' as any]: `${left}px`,
              }}
            />,
          );
        }
      });
    }

    return nodes;
  };

  // ========================= Context ==========================
  const gridContext = React.useMemo(() => ({ columnsOffset }), [columnsOffset]);

  // ========================== Render ==========================
  const tblPrefixCls = `${prefixCls}-tbody`;

  return (
    <GridContext.Provider value={gridContext}>
      <div>
        <VirtualList<FlattenData<any>>
          ref={listRef}
          className={classNames(tblPrefixCls, `${tblPrefixCls}-virtual`)}
          height={scrollY}
          itemHeight={24}
          data={flattenData}
          itemKey={item => getRowKey(item.record)}
          scrollWidth={scrollX}
          onVirtualScroll={({ x }) => {
            onScroll({
              scrollLeft: x,
            });
          }}
          extraRender={extraRender}
        >
          {(item, index, itemProps) => {
            const rowKey = getRowKey(item.record, index);
            return <BodyLine data={item} rowKey={rowKey} index={index} {...itemProps} />;
          }}
        </VirtualList>
      </div>
    </GridContext.Provider>
  );
});

const ResponseGrid = responseImmutable(Grid);

if (process.env.NODE_ENV !== 'production') {
  ResponseGrid.displayName = 'ResponseGrid';
}

export default ResponseGrid;
