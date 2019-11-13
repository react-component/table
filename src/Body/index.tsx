import * as React from 'react';
import BodyRow from './BodyRow';
import TableContext from '../context/TableContext';
import { GetRowKey, StickyOffsets, Key, GetComponentProps } from '../interface';
import ExpandedRow from './ExpandedRow';
import BodyContext from '../context/BodyContext';

export interface BodyProps<RecordType> {
  data: RecordType[];
  getRowKey: GetRowKey<RecordType>;
  measureColumnWidth: boolean;
  stickyOffsets: StickyOffsets;
  expandedKeys: Set<Key>;
  onRow: GetComponentProps<RecordType>;
  rowExpandable: (record: RecordType) => boolean;
  emptyNode: React.ReactNode;
  childrenColumnName: string;
}

function Body<RecordType>({
  data,
  getRowKey,
  measureColumnWidth,
  stickyOffsets,
  expandedKeys,
  onRow,
  rowExpandable,
  emptyNode,
  childrenColumnName,
}: BodyProps<RecordType>) {
  const { prefixCls, getComponent } = React.useContext(TableContext);
  const { fixHeader, fixColumn, flattenColumns, componentWidth } = React.useContext(BodyContext);

  return React.useMemo(() => {
    const WrapperComponent = getComponent(['body', 'wrapper'], 'tbody');
    const trComponent = getComponent(['body', 'row'], 'tr');
    const tdComponent = getComponent(['body', 'cell'], 'td');

    let rows: React.ReactNode;
    if (data.length) {
      rows = data.map((record, index) => {
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
            childrenColumnName={childrenColumnName}
          />,
        ];
      });
    } else {
      rows = (
        <ExpandedRow
          expanded
          className={`${prefixCls}-placeholder`}
          prefixCls={prefixCls}
          fixHeader={fixHeader}
          fixColumn={fixColumn}
          component={trComponent}
          componentWidth={componentWidth}
          cellComponent={tdComponent}
          colSpan={flattenColumns.length}
        >
          {emptyNode}
        </ExpandedRow>
      );
    }

    return <WrapperComponent className={`${prefixCls}-tbody`}>{rows}</WrapperComponent>;
  }, [
    data,
    prefixCls,
    measureColumnWidth,
    stickyOffsets,
    expandedKeys,
    getRowKey,
    getComponent,
    componentWidth,
  ]);
}

const MemoBody = React.memo(Body);
MemoBody.displayName = 'Body';

export default MemoBody;
