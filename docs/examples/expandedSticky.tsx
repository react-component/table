import React, { useState } from 'react';
import type { ColumnType } from 'rc-table';
import Table from 'rc-table';
import '../../assets/index.less';

const Demo = () => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>([]);

  const data = [
    { key: 'a', a: '小二', d: '文零西路' },
    { key: 'b', a: '张三', d: '文一西路' },
    { key: 'c', a: '张三', d: '文二西路' },
  ];

  const columns: ColumnType<Record<string, any>>[] = [
    {
      title: '手机号',
      dataIndex: 'a',
      width: 100,
      onCell: (_, index) => {
        if (index === 1) {
          return {
            rowSpan: 2,
          };
        } else if (index === 2) {
          return {
            rowSpan: 0,
          };
        }
      },
    },
    { title: 'key', dataIndex: 'key2', width: 100 },
    Table.EXPAND_COLUMN,
    { title: 'key', dataIndex: 'key' },
    { title: 'Address', fixed: 'right', dataIndex: 'd', width: 200 },
  ];

  return (
    <div style={{ height: 10000 }}>
      <h2>expanded & sticky</h2>
      <Table<Record<string, any>>
        rowKey="key"
        sticky
        scroll={{ x: 2000 }}
        columns={columns}
        data={data}
        expandable={{
          expandedRowOffset: 2,
          expandedRowKeys,
          onExpandedRowsChange: keys => setExpandedRowKeys(keys),
          expandedRowRender: record => <p style={{ margin: 0 }}>expandedRowRender: {record.key}</p>,
        }}
        className="table"
      />
    </div>
  );
};

export default Demo;
