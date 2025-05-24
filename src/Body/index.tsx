import { useContext } from '@rc-component/context';
import * as React from 'react';
import type { PerfRecord } from '../context/PerfContext';
import PerfContext from '../context/PerfContext';
import TableContext, { responseImmutable } from '../context/TableContext';
import useFlattenRecords from '../hooks/useFlattenRecords';
import devRenderTimes from '../hooks/useRenderTimes';
import { getColumnsKey } from '../utils/valueUtil';
import BodyRow from './BodyRow';
import ExpandedRow from './ExpandedRow';
import MeasureRow from './MeasureRow';
import cls from 'classnames';

export interface BodyProps<RecordType> {
  data: readonly RecordType[];
  measureColumnWidth: boolean;
}

function Body<RecordType>(props: BodyProps<RecordType>) {
  if (process.env.NODE_ENV !== 'production') {
    devRenderTimes(props);
  }

  const { data, measureColumnWidth } = props;

  const {
    prefixCls,
    getComponent,
    onColumnResize,
    flattenColumns,
    getRowKey,
    expandedKeys,
    childrenColumnName,
    emptyNode,
    expandedRowOffset,
    classNames,
    styles,
  } = useContext(TableContext, [
    'prefixCls',
    'getComponent',
    'onColumnResize',
    'flattenColumns',
    'getRowKey',
    'expandedKeys',
    'childrenColumnName',
    'emptyNode',
    'expandedRowOffset',
    'classNames',
    'styles',
  ]);
  const { body: bodyCls = {} } = classNames || {};
  const { body: bodyStyles = {} } = styles || {};

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
          classNames={bodyCls}
          styles={bodyStyles}
          key={key}
          rowKey={key}
          record={record}
          index={idx}
          renderIndex={renderIndex}
          rowComponent={trComponent}
          cellComponent={tdComponent}
          scopeCellComponent={thComponent}
          indent={indent}
          expandedRowOffset={expandedRowOffset}
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
      <WrapperComponent
        className={cls(`${prefixCls}-tbody`, bodyCls.wrapper)}
        style={bodyStyles.wrapper}
      >
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

if (process.env.NODE_ENV !== 'production') {
  Body.displayName = 'Body';
}

export default responseImmutable(Body);
