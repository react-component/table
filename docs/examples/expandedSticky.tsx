import React, { useState } from 'react';
import type { ColumnType } from 'rc-table';
import Table from 'rc-table';
import '../../assets/index.less';

const Demo = () => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>([]);

  const columns: ColumnType<Record<string, any>>[] = [
    {
      title: '手机号',
      dataIndex: 'a',
      width: 100,
      onCell: (_, index) => {
        const props: React.TdHTMLAttributes<HTMLTableCellElement> = {};
        if (index === 1) props.rowSpan = expandedRowKeys.includes('b') ? 3 : 2;
        if (index === 2) props.rowSpan = 0;
        return props;
      },
    },
    Table.EXPAND_COLUMN,
    { title: 'Name', dataIndex: 'c', width: 100 },
    { title: 'Address', dataIndex: 'd', width: 200 },
  ];

  return (
    <div>
      <h2>expanded & sticky</h2>
      <Table<Record<string, any>>
        rowKey="key"
        sticky
        columns={columns}
        data={[
          { key: 'a', a: '12313132132', c: '小二', d: '文零西路' },
          { key: 'b', a: '13812340987', c: '张三', d: '文一西路' },
          { key: 'c', a: '13812340987', c: '张夫', d: '文二西路' },
        ]}
        expandable={{
          expandedRowColSpan: columns.length - 1,
          expandedRowKeys,
          onExpandedRowsChange: keys => setExpandedRowKeys(keys),
          expandedRowRender: record => <p style={{ margin: 0 }}>{record.key}</p>,
        }}
        className="table"
      />
    </div>
  );
};

export default Demo;
