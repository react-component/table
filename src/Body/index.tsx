import * as React from 'react';
import BodyContext from '../context/BodyContext';
import HoverContext from '../context/HoverContext';
import type { PerfRecord } from '../context/PerfContext';
import PerfContext from '../context/PerfContext';
import ResizeContext from '../context/ResizeContext';
import TableContext from '../context/TableContext';
import { useContextSelector } from '../ContextSelector';
import useFlattenRecords from '../hooks/useFlattenRecords';
import type { GetComponentProps, GetRowKey, Key } from '../interface';
import { getColumnsKey } from '../utils/valueUtil';
import BodyRow from './BodyRow';
import ExpandedRow from './ExpandedRow';
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
  const onColumnResize = useContextSelector(ResizeContext, 'onColumnResize');
  const { prefixCls, getComponent } = useContextSelector(TableContext, [
    'prefixCls',
    'getComponent',
  ]);
  const flattenColumns = useContextSelector(BodyContext, 'flattenColumns');

  const flattenData: { record: RecordType; indent: number; index: number }[] =
    useFlattenRecords<RecordType>(data, childrenColumnName, expandedKeys, getRowKey);

  // =================== Performance ====================
  const perfRef = React.useRef<PerfRecord>({
    renderWithProps: false,
  });

  // ====================== Hover =======================
  const [startRow, setStartRow] = React.useState(-1);
  const [endRow, setEndRow] = React.useState(-1);

  const onHover = React.useCallback((start: number, end: number) => {
    setStartRow(start);
    setEndRow(end);
  }, []);

  // ====================== Render ======================
  const bodyNode = React.useMemo(() => {
    const WrapperComponent = getComponent(['body', 'wrapper'], 'tbody');
    const trComponent = getComponent(['body', 'row'], 'tr');
    const tdComponent = getComponent(['body', 'cell'], 'td');
    const thComponent = getComponent(['body', 'cell'], 'th');

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
            index={idx}
            renderIndex={renderIndex}
            rowComponent={trComponent}
            cellComponent={tdComponent}
            thComponent={thComponent}
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
          isEmpty
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
          <MeasureRow
            prefixCls={prefixCls}
            columnsKey={columnsKey}
            onColumnResize={onColumnResize}
          />
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
    emptyNode,
    flattenColumns,
    childrenColumnName,
    onColumnResize,
    rowExpandable,
    flattenData,
  ]);

  return (
    <PerfContext.Provider value={perfRef.current}>
      <HoverContext.Provider value={{ startRow, endRow, onHover }}>
        {bodyNode}
      </HoverContext.Provider>
    </PerfContext.Provider>
  );
}

const MemoBody = React.memo(Body);
MemoBody.displayName = 'Body';

export default MemoBody;
