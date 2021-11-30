import * as React from 'react';
import TableContext from '../context/TableContext';
import type { GetRowKey, Key, GetComponentProps } from '../interface';
import ExpandedRow from './ExpandedRow';
import BodyContext from '../context/BodyContext';
import { getColumnsKey } from '../utils/valueUtil';
import ResizeContext from '../context/ResizeContext';
import BodyRow from './BodyRow';
import useFlattenRecords from '../hooks/useFlattenRecords';
import HoverContext from '../context/HoverContext';
import MeasureRow from './MeasureRow';

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
  const [startRow, setStartRow] = React.useState(-1);
  const [endRow, setEndRow] = React.useState(-1);
  const { onColumnResize } = React.useContext(ResizeContext);
  const { prefixCls, getComponent } = React.useContext(TableContext);
  const { flattenColumns } = React.useContext(BodyContext);

  const flattenData: { record: RecordType; indent: number; index: number }[] =
    useFlattenRecords<RecordType>(data, childrenColumnName, expandedKeys, getRowKey);

  const onHover = React.useCallback((start: number, end: number) => {
    setStartRow(start);
    setEndRow(end);
  }, []);

  const hoverContext = React.useMemo(
    () => ({ startRow, endRow, onHover }),
    [onHover, startRow, endRow],
  );

  return React.useMemo(() => {
    const WrapperComponent = getComponent(['body', 'wrapper'], 'tbody');
    const trComponent = getComponent(['body', 'row'], 'tr');
    const tdComponent = getComponent(['body', 'cell'], 'td');

    let rows: React.ReactNode;
    if (data.length) {
      rows = flattenData.map((item, idx) => {
        const { record, indent, index: renderIndex } = item;

        const key = getRowKey(record, idx);

        return (
          <BodyRow
            key={key}
            rowKey={key}
            record={record}
            recordKey={key}
            index={renderIndex}
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
          component={trComponent}
          cellComponent={tdComponent}
          colSpan={flattenColumns.length}
        >
          {emptyNode}
        </ExpandedRow>
      );
    }

    const columnsKey = getColumnsKey(flattenColumns);

    return (
      <HoverContext.Provider value={hoverContext}>
        <WrapperComponent className={`${prefixCls}-tbody`}>
          {/* Measure body column width with additional hidden col */}
          {measureColumnWidth && (
            <MeasureRow
              prefixCls={prefixCls}
              columnsKey={columnsKey}
              onColumnResize={onColumnResize}
            />
          )}

          {rows}
        </WrapperComponent>
      </HoverContext.Provider>
    );
  }, [
    data,
    prefixCls,
    onRow,
    measureColumnWidth,
    expandedKeys,
    getRowKey,
    getComponent,
    emptyNode,
    flattenColumns,
    childrenColumnName,
    onColumnResize,
    rowExpandable,
    flattenData,
    hoverContext,
  ]);
}

const MemoBody = React.memo(Body);
MemoBody.displayName = 'Body';

export default MemoBody;
