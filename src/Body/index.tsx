import * as React from 'react';
import BodyRow from './BodyRow';
import TableContext from '../context/TableContext';
import { GetRowKey, Key, GetComponentProps } from '../interface';
import ExpandedRow from './ExpandedRow';
import BodyContext from '../context/BodyContext';
import { getColumnsKey } from '../utils/valueUtil';
import ResizeContext from '../context/ResizeContext';
import MeasureCell from './MeasureCell';

export interface BodyProps<RecordType> {
  data: RecordType[];
  getRowKey: GetRowKey<RecordType>;
  measureColumnWidth: boolean;
  expandedKeys: Set<Key>;
  onRow: GetComponentProps<RecordType>;
  rowExpandable: (record: RecordType) => boolean;
  emptyNode: React.ReactNode;
  childrenColumnName: string;
  start: number;
  end: number;
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
  start,
  end,
}: BodyProps<RecordType>) {
  const { onColumnResize, onRowResize } = React.useContext(ResizeContext);
  const { prefixCls, getComponent } = React.useContext(TableContext);
  const { fixHeader, horizonScroll, flattenColumns, componentWidth } = React.useContext(
    BodyContext,
  );

  const allRows = React.useMemo(() => {
    const trComponent = getComponent(['body', 'row'], 'tr');
    const tdComponent = getComponent(['body', 'cell'], 'td');
    let rows: React.ReactNode | React.ReactNodeArray = [];

    if (data.length) {
      for (let index = start; index <= end; index += 1) {
        const record = data[index];
        const key = getRowKey(record, index);
        (rows as React.ReactElement[]).push(
          <BodyRow
            key={key}
            rowKey={key}
            record={record}
            recordKey={key}
            index={index}
            data={data}
            rowComponent={trComponent}
            cellComponent={tdComponent}
            expandedKeys={expandedKeys}
            onRowResize={onRowResize}
            onRow={onRow}
            getRowKey={getRowKey}
            rowExpandable={rowExpandable}
            childrenColumnName={childrenColumnName}
          />,
        );
      }
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
    return rows;
  }, [
    emptyNode,
    getComponent,
    data,
    flattenColumns,
    componentWidth,
    horizonScroll,
    fixHeader,
    prefixCls,
    expandedKeys,
    getRowKey,
    start,
    end,
    onRowResize,
  ]);

  return React.useMemo(() => {
    const WrapperComponent = getComponent(['body', 'wrapper'], 'tbody');

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

        {allRows}
      </WrapperComponent>
    );
  }, [prefixCls, onRow, measureColumnWidth, getComponent, emptyNode, flattenColumns, allRows]);
}

const MemoBody = React.memo(Body);
MemoBody.displayName = 'Body';

export default MemoBody;
