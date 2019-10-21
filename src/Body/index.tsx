import React from 'react';
import classNames from 'classnames';
import BodyRow from './BodyRow';
import DataContext from '../context/DataContext';
import { GetRowKey } from '../interface';

export interface BodyProps<RecordType> {
  data: RecordType[];
  rowKey: string | GetRowKey<RecordType>;
}

function Body<RecordType>({ data, rowKey }: BodyProps<RecordType>) {
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

          return <BodyRow key={key} record={record} index={index} />;
        })}
      </tbody>
    ),
    [data, rowKey, prefixCls],
  );
}

Body.displayName = 'Body';

export default Body;
