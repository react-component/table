import { responseImmutable, useContext } from '@rc-component/context';
import classNames from 'classnames';
import VirtualList, { type ListProps, type ListRef } from 'rc-virtual-list';
import * as React from 'react';
import TableContext from '../context/TableContext';
import useFlattenRecords, { type FlattenData } from '../hooks/useFlattenRecords';
import type { OnCustomizeScroll } from '../interface';
import BodyLine from './BodyLine';
import StaticContext from './StaticContext';

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
  const extraRender: ListProps<any>['extraRender'] = info => {
    const { start, end } = info;

    // console.log('Extra:', start, end);
    // for (let i = start; i >= 0; i -= 1) {
    //   const prevItem = flattenData[i];
    //   console.log('>>>', prevItem);
    // }

    return null;
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
