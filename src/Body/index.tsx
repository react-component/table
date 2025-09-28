import { useContext } from '@rc-component/context';
import * as React from 'react';
import { clsx } from 'clsx';
import type { PerfRecord } from '../context/PerfContext';
import PerfContext from '../context/PerfContext';
import TableContext, { responseImmutable } from '../context/TableContext';
import useFlattenRecords from '../hooks/useFlattenRecords';
import devRenderTimes from '../hooks/useRenderTimes';
import { getColumnsKey } from '../utils/valueUtil';
import BodyRow from './BodyRow';
import ExpandedRow from './ExpandedRow';
import MeasureRow from './MeasureRow';

export interface BodyProps<RecordType> {
  data: readonly RecordType[];
  measureColumnWidth: boolean;
}

const Body = <RecordType,>(props: BodyProps<RecordType>) => {
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
    classNames,
    styles,
    expandedRowOffset = 0,
    colWidths,
  } = useContext(TableContext, [
    'prefixCls',
    'getComponent',
    'onColumnResize',
    'flattenColumns',
    'getRowKey',
    'expandedKeys',
    'childrenColumnName',
    'emptyNode',
    'classNames',
    'styles',
    'expandedRowOffset',
    'fixedInfoList',
    'colWidths',
  ]);
  const { body: bodyCls = {} } = classNames || {};
  const { body: bodyStyles = {} } = styles || {};

  const flattenData = useFlattenRecords<RecordType>(
    data,
    childrenColumnName,
    expandedKeys,
    getRowKey,
  );

  const rowKeys = React.useMemo(() => flattenData.map(item => item.rowKey), [flattenData]);

  // =================== Performance ====================
  const perfRef = React.useRef<PerfRecord>({ renderWithProps: false });

  // ===================== Expanded =====================
  // `expandedRowOffset` data is same for all the rows.
  // Let's calc on Body side to save performance.
  const expandedRowInfo = React.useMemo(() => {
    const expandedColSpan = flattenColumns.length - expandedRowOffset;

    let expandedStickyStart = 0;
    for (let i = 0; i < expandedRowOffset; i += 1) {
      expandedStickyStart += colWidths[i] || 0;
    }

    return {
      offset: expandedRowOffset,
      colSpan: expandedColSpan,
      sticky: expandedStickyStart,
    };
  }, [flattenColumns.length, expandedRowOffset, colWidths]);

  // ====================== Render ======================
  const WrapperComponent = getComponent(['body', 'wrapper'], 'tbody');
  const trComponent = getComponent(['body', 'row'], 'tr');
  const tdComponent = getComponent(['body', 'cell'], 'td');
  const thComponent = getComponent(['body', 'cell'], 'th');

  let rows: React.ReactNode;
  if (data.length) {
    rows = flattenData.map((item, idx) => {
      const { record, indent, index: renderIndex, rowKey } = item;

      return (
        <BodyRow
          classNames={bodyCls}
          styles={bodyStyles}
          key={rowKey}
          rowKey={rowKey}
          rowKeys={rowKeys}
          record={record}
          index={idx}
          renderIndex={renderIndex}
          rowComponent={trComponent}
          cellComponent={tdComponent}
          scopeCellComponent={thComponent}
          indent={indent}
          // Expanded row info
          expandedRowInfo={expandedRowInfo}
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
        style={bodyStyles.wrapper}
        className={clsx(`${prefixCls}-tbody`, bodyCls.wrapper)}
      >
        {/* Measure body column width with additional hidden col */}
        {measureColumnWidth && (
          <MeasureRow
            prefixCls={prefixCls}
            columnsKey={columnsKey}
            onColumnResize={onColumnResize}
            columns={flattenColumns}
          />
        )}
        {rows}
      </WrapperComponent>
    </PerfContext.Provider>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Body.displayName = 'Body';
}

export default responseImmutable(Body);
