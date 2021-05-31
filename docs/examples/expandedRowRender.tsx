import React from 'react';
import Table from 'rc-table';
import '../../assets/index.less';
import { useCheckbox } from './utils/useInput';
import type { ColumnType } from '@/interface';

interface RecordType {
  key: React.Key;
  a: string;
  b?: string;
  c?: string;
  d?: number;
}

const tableData: RecordType[] = [
  { key: 0, a: '123' },
  { key: 1, a: 'cdd', b: 'edd' },
  { key: 2, a: '1333', c: 'eee', d: 2 },
];

for (let i = 0; i < 10; i += 1) {
  const str = `${i}`;
  const item: RecordType = {
    key: i * 10 + 99,
    a: str.repeat(3),
    b: str.repeat(5),
    c: str.repeat(7),
    d: i,
  };
  tableData.push(item);
}

const Demo = () => {
  const [data, setData] = React.useState(tableData);
  const [expandedRowKeys, setExpandedRowKeys] = React.useState([]);
  const [expandRowByClick, expandRowByClickProps] = useCheckbox(false);
  const [fixColumns, fixColumnsProps] = useCheckbox(false);
  const [scrollX, scrollXProps] = useCheckbox(false);
  const [fixHeader, fixHeaderProps] = useCheckbox(false);
  const [expandIconPosition, expandIconPositionProps] = useCheckbox(false);
  const [fixExpand, setFixExpand] = useCheckbox(false);

  const remove = (index: number) => {
    const newData = data.slice();
    newData.splice(index, 1);
    setData(newData);
  };

  const renderAction = (o: any, row: RecordType, index: number) => (
    <a href="#" onClick={() => remove(index)}>
      Delete
    </a>
  );

  const columns: ColumnType<RecordType>[] = [
    { title: 'title 1', dataIndex: 'a', key: 'a', width: 100 },
    { title: 'title 2', dataIndex: 'b', key: 'b', width: 100 },
    { title: 'title 3', dataIndex: 'c', key: 'c', width: 200 },
    { title: 'Operation', dataIndex: '', key: 'x', render: renderAction },
  ];

  if (fixColumns) {
    columns.unshift({ title: 'fix left 2', dataIndex: 'a', width: 100, fixed: 'left' });
    columns.unshift({ title: 'fix left 1', dataIndex: 'a', width: 100, fixed: true });
    columns.push({ title: 'fix right', dataIndex: 'a', width: 100, fixed: 'right' });
  }

  if (fixExpand) {
    columns.unshift({ title: 'test ', dataIndex: 'a', width: 200 });
    columns.unshift({ title: 'test ', dataIndex: 'a', width: 200 });
    columns.unshift({ title: 'test ', dataIndex: 'a', width: 200 });
    columns.unshift({ title: 'test ', dataIndex: 'a', width: 200 });
  }

  const onExpand = (expanded, record) => {
    console.log('onExpand', expanded, record);
  };

  const onExpandedRowsChange = (rows: React.Key[]) => {
    setExpandedRowKeys(rows);
  };

  const rowExpandable = (record: RecordType) => record.key !== 1;

  // Toggle Button
  let toggleButton: React.ReactNode;
  if (expandedRowKeys.length) {
    const closeAll = () => setExpandedRowKeys([]);
    toggleButton = (
      <button type="button" onClick={closeAll}>
        Close All
      </button>
    );
  } else {
    const openAll = () => setExpandedRowKeys([0, 1, 2]);
    toggleButton = (
      <button type="button" onClick={openAll}>
        Expand All
      </button>
    );
  }

  // Render
  return (
    <div>
      {toggleButton}
      <label>
        <input {...expandRowByClickProps} />
        Expand Row by Click
      </label>
      <label>
        <input {...fixColumnsProps} />
        Fix Columns
      </label>
      <label>
        <input {...scrollXProps} />
        ScrollX
      </label>
      <label>
        <input {...fixHeaderProps} />
        Fix Header
      </label>
      <label>
        <input {...expandIconPositionProps} />
        Change Expand Icon Position
      </label>
      <label>
        <input {...setFixExpand} />
        Change Expand Icon Fixed
      </label>
      <Table<RecordType>
        columns={columns}
        expandable={{
          expandRowByClick,
          expandedRowRender: (record, index, indent, expanded) =>
            expanded ? <p>extra: {record.a}</p> : null,
          expandedRowKeys,
          onExpandedRowsChange,
          onExpand,
          rowExpandable,
          expandIconColumnIndex: expandIconPosition ? 1 : null,
          fixed: fixExpand,
        }}
        scroll={{ x: fixColumns || scrollX ? 2000 : null, y: fixHeader ? 300 : null }}
        data={data}
      />
    </div>
  );
};

export default Demo;
