import { responseImmutable, useContext } from '@rc-component/context';
import * as React from 'react';
import type { PerfRecord } from '../context/PerfContext';
import PerfContext from '../context/PerfContext';
import TableContext from '../context/TableContext';
import useFlattenRecords from '../hooks/useFlattenRecords';
import devRenderTimes from '../hooks/useRenderTimes';
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

function Body<RecordType>(props: BodyProps<RecordType>) {
  if (process.env.NODE_ENV !== 'production') {
    devRenderTimes(props);
  }

  const {
    data,
    getRowKey,
    measureColumnWidth,
    expandedKeys,
    onRow,
    rowExpandable,
    emptyNode,
    childrenColumnName,
  } = props;

  const { prefixCls, getComponent, onColumnResize, flattenColumns } = useContext(TableContext, [
    'prefixCls',
    'getComponent',
    'onColumnResize',
    'flattenColumns',
  ]);

  const flattenData: { record: RecordType; indent: number; index: number }[] =
    useFlattenRecords<RecordType>(data, childrenColumnName, expandedKeys, getRowKey);

  // =================== Performance ====================
  const perfRef = React.useRef<PerfRecord>({
    renderWithProps: false,
  });

  // ====================== Render ======================
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
          scopeCellComponent={thComponent}
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
    <PerfContext.Provider value={perfRef.current}>
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
    </PerfContext.Provider>
  );
}

Body.displayName = 'Body';

export default responseImmutable(Body);
