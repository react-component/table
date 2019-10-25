import * as React from 'react';
import BodyRow from './BodyRow';
import TableContext from '../context/TableContext';
import {
  GetRowKey,
  StickyOffsets,
  Key,
  ExpandedRowRender,
  GetComponentProps,
  TriggerEventHandler,
} from '../interface';

export interface BodyProps<RecordType> {
  data: RecordType[];
  rowKey: string | GetRowKey<RecordType>;
  measureColumnWidth: boolean;
  stickyOffsets: StickyOffsets;
  expandedKeys: Set<Key>;
  expandedRowRender: ExpandedRowRender<RecordType>;
  onTriggerExpand: TriggerEventHandler<RecordType>;
  onRow: GetComponentProps<RecordType>;
  rowExpandable: (record: RecordType) => boolean;
}

function Body<RecordType>({
  data,
  rowKey,
  measureColumnWidth,
  stickyOffsets,
  expandedKeys,
  expandedRowRender,
  onTriggerExpand,
  onRow,
  rowExpandable,
}: BodyProps<RecordType>) {
  const { prefixCls, getRowKey, getComponent } = React.useContext(TableContext);

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
              onTriggerExpand={onTriggerExpand}
              rowComponent={trComponent}
              cellComponent={tdComponent}
              stickyOffsets={stickyOffsets}
              expandedKeys={expandedKeys}
              expandedRowRender={expandedRowRender}
              onRow={onRow}
              rowExpandable={rowExpandable}
            />,
          ];
        })}
      </WrapperComponent>
    );
  }, [
    data,
    rowKey,
    prefixCls,
    measureColumnWidth,
    stickyOffsets,
    expandedKeys,
    onTriggerExpand,
    getRowKey,
    getComponent,
    expandedRowRender,
  ]);
}

Body.displayName = 'Body';

export default Body;
