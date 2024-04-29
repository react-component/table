import { useContext } from '@rc-component/context';
import classNames from 'classnames';
import VirtualList, { type ListProps, type ListRef } from 'rc-virtual-list';
import * as React from 'react';
import Cell from '../Cell';
import TableContext, { responseImmutable } from '../context/TableContext';
import useFlattenRecords, { type FlattenData } from '../hooks/useFlattenRecords';
import type { ColumnType, OnCustomizeScroll, ScrollConfig } from '../interface';
import BodyLine from './BodyLine';
import { GridContext, StaticContext } from './context';

export interface GridProps<RecordType = any> {
  data: RecordType[];
  onScroll: OnCustomizeScroll;
}

export interface GridRef {
  scrollLeft: number;
  scrollTo?: (scrollConfig: ScrollConfig) => void;
}

const Grid = React.forwardRef<GridRef, GridProps>((props, ref) => {
  const { data, onScroll } = props;

  const {
    flattenColumns,
    onColumnResize,
    getRowKey,
    expandedKeys,
    prefixCls,
    childrenColumnName,
    emptyNode,
    scrollX,
    componentWidth,
  } = useContext(TableContext, [
    'flattenColumns',
    'onColumnResize',
    'getRowKey',
    'prefixCls',
    'expandedKeys',
    'childrenColumnName',
    'emptyNode',
    'scrollX',
    'componentWidth',
  ]);
  const {
    sticky,
    scrollY,
    listItemHeight,
    horizontalVirtual,
    getComponent,
    onScroll: onTablePropScroll,
  } = useContext(StaticContext);

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

  const [scrollLeft, setScrollLeft] = React.useState(0);

  React.useEffect(() => {
    columnsWidth.forEach(([key, width]) => {
      onColumnResize(key, width);
    });
  }, [columnsWidth]);

  // =========================== Ref ============================
  React.useImperativeHandle(ref, () => {
    const obj = {
      scrollTo: (config: ScrollConfig) => {
        listRef.current?.scrollTo(config);
      },
    } as unknown as GridRef;

    Object.defineProperty(obj, 'scrollLeft', {
      get: () => listRef.current?.getScrollInfo().x || 0,

      set: (value: number) => {
        if (horizontalVirtual) {
          const max = (scrollX as number) - componentWidth;
          let left = Math.max(value, 0);
          left = Math.min(left, max);
          setScrollLeft(left);
        }
        listRef.current?.scrollTo({
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

    // Do nothing if no data
    if (end < 0) {
      return null;
    }

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

    // Collect the line who has rowSpan
    const spanLines: number[] = [];

    for (let i = startIndex; i <= endIndex; i += 1) {
      const item = flattenData[i];

      // This code will never reach, just incase
      if (!item) {
        continue;
      }

      if (flattenColumns.some(column => getRowSpan(column, i) > 1)) {
        spanLines.push(i);
      }
    }

    // Patch extra line on the page
    const nodes: React.ReactElement[] = spanLines.map(index => {
      const item = flattenData[index];

      const rowKey = getRowKey(item.record, index);

      const getHeight = (rowSpan: number) => {
        const endItemIndex = index + rowSpan - 1;
        const endItemKey = getRowKey(flattenData[endItemIndex].record, endItemIndex);

        const sizeInfo = getSize(rowKey, endItemKey);
        return sizeInfo.bottom - sizeInfo.top;
      };

      const sizeInfo = getSize(rowKey);

      return (
        <BodyLine
          key={index}
          data={item}
          rowKey={rowKey}
          index={index}
          style={{
            top: -offsetY + sizeInfo.top,
          }}
          extra
          getHeight={getHeight}
          scrollLeft={scrollLeft}
        />
      );
    });

    return nodes;
  };

  // ========================= Context ==========================
  const gridContext = React.useMemo(() => ({ columnsOffset }), [columnsOffset]);

  // ========================== Render ==========================
  const tblPrefixCls = `${prefixCls}-tbody`;

  // default 'div' in rc-virtual-list
  const wrapperComponent = getComponent(['body', 'wrapper']);
  const RowComponent = getComponent(['body', 'row'], 'div');
  const cellComponent = getComponent(['body', 'cell'], 'div');

  let bodyContent: React.ReactNode;
  if (flattenData.length) {
    // ========================== Sticky Scroll Bar ==========================
    const horizontalScrollBarStyle: React.CSSProperties = {};
    if (sticky) {
      horizontalScrollBarStyle.position = 'sticky';
      horizontalScrollBarStyle.bottom = 0;
      if (typeof sticky === 'object' && sticky.offsetScroll) {
        horizontalScrollBarStyle.bottom = sticky.offsetScroll;
      }
    }

    bodyContent = (
      <VirtualList<FlattenData<any>>
        fullHeight={false}
        ref={listRef}
        prefixCls={`${tblPrefixCls}-virtual`}
        styles={{ horizontalScrollBar: horizontalScrollBarStyle }}
        className={tblPrefixCls}
        height={scrollY}
        itemHeight={listItemHeight || 24}
        data={flattenData}
        itemKey={item => getRowKey(item.record)}
        component={wrapperComponent}
        scrollWidth={scrollX as number}
        onVirtualScroll={({ x }) => {
          if (horizontalVirtual) {
            setScrollLeft(x);
          }
          onScroll({
            scrollLeft: x,
          });
        }}
        onScroll={onTablePropScroll}
        extraRender={extraRender}
      >
        {(item, index, itemProps) => {
          const rowKey = getRowKey(item.record, index);
          return (
            <BodyLine
              data={item}
              rowKey={rowKey}
              index={index}
              scrollLeft={scrollLeft}
              {...itemProps}
            />
          );
        }}
      </VirtualList>
    );
  } else {
    bodyContent = (
      <RowComponent className={classNames(`${prefixCls}-placeholder`)}>
        <Cell component={cellComponent} prefixCls={prefixCls}>
          {emptyNode}
        </Cell>
      </RowComponent>
    );
  }

  return <GridContext.Provider value={gridContext}>{bodyContent}</GridContext.Provider>;
});

const ResponseGrid = responseImmutable(Grid);

if (process.env.NODE_ENV !== 'production') {
  ResponseGrid.displayName = 'ResponseGrid';
}

export default ResponseGrid;
