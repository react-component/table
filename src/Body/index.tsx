import * as React from 'react';
import ResizeObserver from 'rc-resize-observer';
import BodyRow from './BodyRow';
import TableContext from '../context/TableContext';
import { GetRowKey, Key, GetComponentProps } from '../interface';
import ExpandedRow from './ExpandedRow';
import BodyContext from '../context/BodyContext';
import { getColumnsKey } from '../utils/valueUtil';
import ResizeContext from '../context/ResizeContext';

export interface BodyProps<RecordType> {
  data: RecordType[];
  getRowKey: GetRowKey<RecordType>;
  measureColumnWidth: boolean;
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
  expandedKeys,
  onRow,
  rowExpandable,
  emptyNode,
  childrenColumnName,
}: BodyProps<RecordType>) {
  const { onColumnResize } = React.useContext(ResizeContext);
  const { prefixCls, getComponent } = React.useContext(TableContext);
  const { fixHeader, horizonScroll, flattenColumns, componentWidth } = React.useContext(
    BodyContext,
  );

  return React.useMemo(() => {
    const WrapperComponent = getComponent(['body', 'wrapper'], 'tbody');
    const trComponent = getComponent(['body', 'row'], 'tr');
    const tdComponent = getComponent(['body', 'cell'], 'td');

    let rows: React.ReactNode;
    if (data.length) {
      rows = data.map((record, index) => {
        const key = getRowKey(record, index);

        return (
          <BodyRow
            key={key}
            rowKey={key}
            record={record}
            recordKey={key}
            index={index}
            rowComponent={trComponent}
            cellComponent={tdComponent}
            expandedKeys={expandedKeys}
            onRow={onRow}
            getRowKey={getRowKey}
            rowExpandable={rowExpandable}
            childrenColumnName={childrenColumnName}
          />
        );
      });
    } else {
      rows = (
        <ExpandedRow
          expanded
          className={`${prefixCls}-placeholder`}
          prefixCls={prefixCls}
          fixHeader={fixHeader}
          fixColumn={horizonScroll}
          horizonScroll={horizonScroll}
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
          <tr aria-hidden="true" className={`${prefixCls}-measure-row`} style={{ height: 0 }}>
            {columnsKey.map(columnKey => (
              <ResizeObserver
                key={columnKey}
                onResize={({ offsetWidth }) => {
                  onColumnResize(columnKey, offsetWidth);
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
    onRow,
    measureColumnWidth,
    expandedKeys,
    getRowKey,
    getComponent,
    componentWidth,
    emptyNode,
    flattenColumns,
  ]);
}

const MemoBody = React.memo(Body);
MemoBody.displayName = 'Body';

export default MemoBody;
