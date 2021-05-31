import * as React from 'react';
// import BodyRow from './BodyRow';
import TableContext from '../context/TableContext';
import type { GetRowKey, Key, GetComponentProps } from '../interface';
import ExpandedRow from './ExpandedRow';
import BodyContext from '../context/BodyContext';
import { getColumnsKey } from '../utils/valueUtil';
import ResizeContext from '../context/ResizeContext';
import MeasureCell from './MeasureCell';
import NewBodyRow from './NewBodyRow';

export interface BodyProps<RecordType> {
  data: readonly RecordType[];
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
  const { fixHeader, horizonScroll, flattenColumns, componentWidth } =
    React.useContext(BodyContext);

  // 递归 (扁平化树形结构)
  const flatChildren = React.useCallback(
    (record, temp: Record<string, unknown>[], indent: number) => {
      temp.push({
        record,
        indent,
      });

      const key = getRowKey(record);

      const expanded = expandedKeys && expandedKeys.has(key);

      if (
        record &&
        Array.isArray(record[childrenColumnName]) &&
        record[childrenColumnName].length &&
        expanded
      ) {
        for (let i = 0; i < record[childrenColumnName].length; i += 1) {
          flatChildren(record[childrenColumnName][i], temp, indent + 1);
        }
      }
    },
    [expandedKeys, childrenColumnName, getRowKey],
  );

  return React.useMemo(() => {
    const WrapperComponent = getComponent(['body', 'wrapper'], 'tbody');
    const trComponent = getComponent(['body', 'row'], 'tr');
    const tdComponent = getComponent(['body', 'cell'], 'td');

    let rows: React.ReactNode;
    if (data.length) {
      const temp: { record; indent: number }[] = [];

      for (let i = 0; i < data?.length; i += 1) {
        const record = data[i];

        flatChildren(record, temp, 0);
      }

      rows = temp.map((item, index) => {
        const { record, indent } = item;

        const key = getRowKey(record, index);

        return (
          <NewBodyRow
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
            indent={indent}
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
          <tr
            aria-hidden="true"
            className={`${prefixCls}-measure-row`}
            style={{ height: 0, fontSize: 0 }}
          >
            {columnsKey.map(columnKey => (
              <MeasureCell key={columnKey} columnKey={columnKey} onColumnResize={onColumnResize} />
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
    flatChildren,
    childrenColumnName,
    fixHeader,
    horizonScroll,
    onColumnResize,
    rowExpandable,
  ]);
}

const MemoBody = React.memo(Body);
MemoBody.displayName = 'Body';

export default MemoBody;
