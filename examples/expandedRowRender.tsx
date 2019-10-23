import React from 'react';
import Table from '../src';
import '../assets/index.less';
import { useCheckbox } from './utils/useInput';
import { ColumnsType } from '../src/interface';

interface RecordType {
  key: React.Key;
  a: string;
  b?: string;
  c?: string;
  d?: number;
}

const tableData = [
  { key: 0, a: '123' },
  { key: 1, a: 'cdd', b: 'edd' },
  { key: 2, a: '1333', c: 'eee', d: 2 },
];

const Demo = () => {
  const [data, setData] = React.useState(tableData);
  const [expandedRowKeys, setExpandedRowKeys] = React.useState([]);
  const [expandRowByClick, expandRowByClickProps] = useCheckbox(false);
  const [fixColumns, fixColumnsProps] = useCheckbox(false);

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

  const columns: ColumnsType<RecordType> = [
    { title: 'title 1', dataIndex: 'a', key: 'a', width: 100 },
    { title: 'title 2', dataIndex: 'b', key: 'b', width: 100 },
    { title: 'title 3', dataIndex: 'c', key: 'c', width: 200 },
    { title: 'Operation', dataIndex: '', key: 'x', render: renderAction },
  ];

  if (fixColumns) {
    columns.unshift({ title: 'fix left', dataIndex: 'a', width: 100, fixed: 'left' });
    columns.push({ title: 'fix right', dataIndex: 'a', width: 100, fixed: 'right' });
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
        }}
        scroll={fixColumns ? { x: 2000 } : null}
        data={data}
      />
    </div>
  );
};

export default Demo;
