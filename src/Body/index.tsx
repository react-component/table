import React from 'react';
import classNames from 'classnames';
import BodyRow from './BodyRow';
import DataContext from '../context/TableContext';
import { GetRowKey, StickyOffsets } from '../interface';

export interface BodyProps<RecordType> {
  data: RecordType[];
  rowKey: string | GetRowKey<RecordType>;
  measureColumnWidth: boolean;
  stickyOffsets: StickyOffsets;
}

function Body<RecordType>({
  data,
  rowKey,
  measureColumnWidth,
  stickyOffsets,
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

          return (
            <BodyRow
              measureColumnWidth={measureColumnWidth && index === 0}
              key={key}
              record={record}
              index={index}
              stickyOffsets={stickyOffsets}
            />
          );
        })}
      </tbody>
    ),
    [data, rowKey, prefixCls, measureColumnWidth, stickyOffsets],
  );
}

Body.displayName = 'Body';

export default Body;
