import React from 'react';
import BodyRow from './BodyRow';
import { GetRowKey } from './interface';

export interface DataListProps<RecordType> {
  data: RecordType[];
  rowKey: string | GetRowKey<RecordType>;
}

function DataList<RecordType>({ data, rowKey }: DataListProps<RecordType>) {
  const getRowKey = React.useMemo<GetRowKey<RecordType>>(() => {
    if (typeof rowKey === 'function') {
      return rowKey;
    }
    return (record: RecordType) => record[rowKey];
  }, [rowKey]);

  return (
    <tbody>
      {(data || []).map((record, index) => {
        const key = getRowKey(record, index);

        return <BodyRow key={key} record={record} index={index} />;
      })}
    </tbody>
  );
}

export default DataList;
