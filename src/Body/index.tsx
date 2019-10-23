import * as React from 'react';
import BodyRow from './BodyRow';
import DataContext from '../context/TableContext';
import {
  GetRowKey,
  StickyOffsets,
  Key,
  ExpandedRowRender,
  GetComponentProps,
  TriggerEventHandler,
} from '../interface';
import useIndexMemo from '../hooks/useIndexMemo';

export interface BodyProps<RecordType> {
  data: RecordType[];
  rowKey: string | GetRowKey<RecordType>;
  measureColumnWidth: boolean;
  stickyOffsets: StickyOffsets;
  expandedKeys: Set<Key>;
  expandable: boolean;
  expandedRowRender: ExpandedRowRender<RecordType>;
  onTriggerExpand: TriggerEventHandler<RecordType>;
  onRow: GetComponentProps<RecordType>;
}

function Body<RecordType>({
  data,
  rowKey,
  measureColumnWidth,
  stickyOffsets,
  expandedKeys,
  expandable,
  expandedRowRender,
  onTriggerExpand,
  onRow,
}: BodyProps<RecordType>) {
  const mergedData = data || [];
  const { prefixCls, getRowKey } = React.useContext(DataContext);

  const indexMemo = useIndexMemo(mergedData.length);

  return React.useMemo(
    () => (
      <tbody>
        {mergedData.map((record, index) => {
          const key = getRowKey(record, index);

          let additionalProps: React.HTMLAttributes<HTMLElement> = {};
          if (onRow) {
            additionalProps = onRow(record, index);
          }

          if (onTriggerExpand) {
            additionalProps = indexMemo(
              index,
              (): React.HTMLAttributes<HTMLElement> => {
                const { onClick } = additionalProps;

                return {
                  ...additionalProps,
                  onClick: (event, ...restArgs) => {
                    onTriggerExpand(record, event);

                    if (onClick) {
                      onClick(event, ...restArgs);
                    }
                  },
                };
              },
              [additionalProps.onClick, onTriggerExpand],
            );
          }

          return [
            <BodyRow
              measureColumnWidth={measureColumnWidth && index === 0}
              key={key}
              record={record}
              index={index}
              stickyOffsets={stickyOffsets}
              expandable={expandable}
              expanded={expandedKeys.has(key)}
              expandedRowRender={expandedRowRender}
              additionalProps={additionalProps}
            />,
          ];
        })}
      </tbody>
    ),
    [
      data,
      rowKey,
      prefixCls,
      measureColumnWidth,
      stickyOffsets,
      expandedKeys,
      expandable,
      onTriggerExpand,
      getRowKey,
    ],
  );
}

Body.displayName = 'Body';

export default Body;
