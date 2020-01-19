import * as React from 'react';
import ResizeObserver from 'rc-resize-observer';
import BodyRow from './BodyRow';
import TableContext from '../context/TableContext';
import { GetRowKey, StickyOffsets, Key, GetComponentProps } from '../interface';
import ExpandedRow from './ExpandedRow';
import BodyContext from '../context/BodyContext';
import { getColumnsKey } from '../utils/valueUtil';
import ResizeContext from '../context/ResizeContext';

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
  const { onColumnResize } = React.useContext(ResizeContext);
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
            rowKey={key}
            record={record}
            recordKey={key}
            index={index}
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

    const columnsKey = getColumnsKey(flattenColumns);

    return (
      <WrapperComponent className={`${prefixCls}-tbody`}>
        {/* Measure body column width with additional hidden col */}
        {measureColumnWidth && (
          <tr aria-hidden="true" className={`${prefixCls}-measure-row`}>
            {columnsKey.map(columnKey => (
              <ResizeObserver
                key={columnKey}
                onResize={({ width }) => {
                  onColumnResize(columnKey, width);
                }}
              >
                <td style={{ padding: 0, border: 0, height: 0 }} />
              </ResizeObserver>
            ))}
          </tr>
        )}

        {rows}
      </WrapperComponent>
    );
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
