import * as React from 'react';
import classNames from 'classnames';
import BodyRow from './BodyRow';
import DataContext from '../context/TableContext';
import { GetRowKey, StickyOffsets, Key, ExpandedRowRender } from '../interface';

export interface BodyProps<RecordType> {
  data: RecordType[];
  rowKey: string | GetRowKey<RecordType>;
  measureColumnWidth: boolean;
  stickyOffsets: StickyOffsets;
  expandedKeys: Set<Key>;
  expandable: boolean;
  expandedRowRender?: ExpandedRowRender<RecordType>;
}

function Body<RecordType>({
  data,
  rowKey,
  measureColumnWidth,
  stickyOffsets,
  expandedKeys,
  expandable,
}: BodyProps<RecordType>) {
  const { prefixCls } = React.useContext(DataContext);

  const getRowKey = React.useMemo<GetRowKey<RecordType>>(() => {
    if (typeof rowKey === 'function') {
      return rowKey;
    }
    return (record: RecordType) => record[rowKey];
  }, [rowKey]);

  return React.useMemo(
    () => (
      <tbody className={classNames(`${prefixCls}-body`)}>
        {(data || []).map((record, index) => {
          const key = getRowKey(record, index);

          return [
            <BodyRow
              measureColumnWidth={measureColumnWidth && index === 0}
              key={key}
              record={record}
              index={index}
              stickyOffsets={stickyOffsets}
              expandable={expandable}
              expanded={expandedKeys.has(key)}
            />,
          ];
        })}
      </tbody>
    ),
    [data, rowKey, prefixCls, measureColumnWidth, stickyOffsets, expandedKeys, expandable],
  );
}

Body.displayName = 'Body';

export default Body;
