import { responseImmutable, useContext } from '@rc-component/context';
import classNames from 'classnames';
import VirtualList, { type ListProps, type ListRef } from 'rc-virtual-list';
import * as React from 'react';
import TableContext from '../context/TableContext';
import useFlattenRecords, { type FlattenData } from '../hooks/useFlattenRecords';
import type { ColumnType, OnCustomizeScroll } from '../interface';
import BodyLine from './BodyLine';
import StaticContext from './StaticContext';
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

  // const context = useContext(TableContext);
  // console.log('=>', context, scrollX, scrollY);

  // =========================== Ref ============================
  const listRef = React.useRef<ListRef>();

  // =========================== Data ===========================
  const flattenData = useFlattenRecords(data, childrenColumnName, expandedKeys, getRowKey);

  // ========================== Column ==========================
  const columnsWidth = React.useMemo<[key: React.Key, width: number][]>(
    () => flattenColumns.map(({ width, key }) => [key, width as number]),
    [flattenColumns],
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
  const getRowSpan = (column: ColumnType<any>, index: number) => {
    const record = flattenData[index]?.record;
    const { onCell } = column;

    if (onCell) {
      const cellProps = onCell(record, index) as React.TdHTMLAttributes<HTMLElement>;
      const rowSpan = cellProps?.rowSpan;
      return rowSpan ?? 1;
    }
    return 1;
  };

  const extraRender: ListProps<any>['extraRender'] = info => {
    const { start, end, getSize } = info;

    // Find first rowSpan column
    const firstRowSpanColumns = flattenColumns.filter(column => getRowSpan(column, start) === 0);

    let startIndex = start;

    for (let i = start; i >= 0; i -= 1) {
      if (firstRowSpanColumns.every(column => getRowSpan(column, i) !== 0)) {
        startIndex = i;
        break;
      }
    }

    // Find last rowSpan column
    const lastRowSpanColumns = flattenColumns.filter(column => {
      const rowSpan = getRowSpan(column, end);
      return rowSpan !== 1;
    });

    let endIndex = end;

    for (let i = end; i < flattenData.length; i += 1) {
      if (lastRowSpanColumns.every(column => getRowSpan(column, i) !== 0)) {
        endIndex = Math.max(i - 1, end);
        break;
      }
    }

    console.log('Range:', start, end, '->', startIndex, endIndex);

    // Loop create the rowSpan cell
    const nodes: React.ReactElement[] = [];

    for (let i = startIndex; i <= endIndex; i += 1) {
      const item = flattenData[i];
      const rowKey = getRowKey(item.record, i);

      flattenColumns.forEach((column, colIndex) => {
        const rowSpan = getRowSpan(column, i);

        if (rowSpan > 1) {
          const endItem = flattenData[i + rowSpan - 1];
          console.log('!!!', i, rowSpan, endItem);
          nodes.push(
            <RowSpanVirtualCell
              key={`${i}_${colIndex}`}
              record={item.record}
              rowKey={rowKey}
              column={column}
              colIndex={colIndex}
              index={i}
              indent={0}
            />,
          );
        }
      });
    }

    return nodes;
  };

  // ========================== Render ==========================
  const tblPrefixCls = `${prefixCls}-tbody`;

  return (
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
  );
});

const ResponseGrid = responseImmutable(Grid);

if (process.env.NODE_ENV !== 'production') {
  ResponseGrid.displayName = 'ResponseGrid';
}

export default ResponseGrid;
