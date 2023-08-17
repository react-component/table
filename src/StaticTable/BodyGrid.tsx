import { useContext } from '@rc-component/context';
import classNames from 'classnames';
import VirtualList from 'rc-virtual-list';
import * as React from 'react';
import TableContext from '../context/TableContext';
import useFlattenRecords, { FlattenData } from '../hooks/useFlattenRecords';
import BodyLine from './BodyLine';
import StaticContext from './StaticContext';

export interface GridProps<RecordType = any> {
  data: RecordType[];
}

const Grid = React.forwardRef((props: GridProps, ref: any) => {
  const { data } = props;

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

  // ========================== Render ==========================
  const tblPrefixCls = `${prefixCls}-tbody`;

  return (
    <div ref={ref}>
      <VirtualList<FlattenData<any>>
        className={classNames(tblPrefixCls, `${tblPrefixCls}-virtual`)}
        height={scrollY}
        itemHeight={24}
        data={flattenData}
        itemKey={getRowKey}
        scrollWidth={scrollX}
      >
        {(item, index, itemProps) => {
          const rowKey = getRowKey(item, index);
          return <BodyLine data={item} rowKey={rowKey} index={index} {...itemProps} />;
        }}
      </VirtualList>
    </div>
  );
});

export default Grid;
