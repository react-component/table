import * as React from 'react';
import BodyRow from './BodyRow';
import TableContext from '../context/TableContext';
import { GetRowKey, StickyOffsets, Key, GetComponentProps } from '../interface';

export interface BodyProps<RecordType> {
  data: RecordType[];
  getRowKey: GetRowKey<RecordType>;
  measureColumnWidth: boolean;
  stickyOffsets: StickyOffsets;
  expandedKeys: Set<Key>;
  onRow: GetComponentProps<RecordType>;
  rowExpandable: (record: RecordType) => boolean;
}

function Body<RecordType>({
  data,
  getRowKey,
  measureColumnWidth,
  stickyOffsets,
  expandedKeys,
  onRow,
  rowExpandable,
}: BodyProps<RecordType>) {
  const { prefixCls, getComponent } = React.useContext(TableContext);

  return React.useMemo(() => {
    const WrapperComponent = getComponent(['body', 'wrapper'], 'tbody');
    const trComponent = getComponent(['body', 'row'], 'tr');
    const tdComponent = getComponent(['body', 'cell'], 'td');

    return (
      <WrapperComponent>
        {data.map((record, index) => {
          const key = getRowKey(record, index);

          return [
            <BodyRow
              key={key}
              record={record}
              recordKey={key}
              index={index}
              measureColumnWidth={measureColumnWidth && index === 0}
              rowComponent={trComponent}
              cellComponent={tdComponent}
              stickyOffsets={stickyOffsets}
              expandedKeys={expandedKeys}
              onRow={onRow}
              getRowKey={getRowKey}
              rowExpandable={rowExpandable}
            />,
          ];
        })}
      </WrapperComponent>
    );
  }, [data, prefixCls, measureColumnWidth, stickyOffsets, expandedKeys, getRowKey, getComponent]);
}

const MemoBody = React.memo(Body);
MemoBody.displayName = 'Body';

export default MemoBody;
