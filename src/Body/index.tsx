import React from 'react';
import classNames from 'classnames';
import BodyRow from './BodyRow';
import DataContext from '../context/TableContext';
import { GetRowKey } from '../interface';

export interface BodyProps<RecordType> {
  data: RecordType[];
  rowKey: string | GetRowKey<RecordType>;
  measureColumnWidth: boolean;
  colWidths: number[];
  columCount: number;
}

function Body<RecordType>({
  data,
  rowKey,
  measureColumnWidth,
  colWidths,
  columCount,
}: BodyProps<RecordType>) {
  const { prefixCls } = React.useContext(DataContext);

  const getRowKey = React.useMemo<GetRowKey<RecordType>>(() => {
    if (typeof rowKey === 'function') {
      return rowKey;
    }
    return (record: RecordType) => record[rowKey];
  }, [rowKey]);

  const stickyOffsets: { left: number[]; rigth: number[] } = React.useMemo(() => {
    if (!measureColumnWidth) {
      return { left: [], right: [] };
    }

    const leftOffsets: number[] = [];
    const rightOffsets: number[] = [];
    let left = 0;
    let right = 0;

    for (let start = 0; start < columCount; start += 1) {
      // Left offset
      leftOffsets[start] = left;
      left += colWidths[start] || 0;

      // Right offset
      const end = columCount - start - 1;
      rightOffsets[end] = right;
      right += colWidths[end] || 0;
    }

    return {
      left: leftOffsets,
      right: rightOffsets,
    };
  }, [colWidths, measureColumnWidth]);

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
