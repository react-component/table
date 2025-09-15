import React, { useState } from 'react';
import type { ColumnType } from 'rc-table';
import Table from 'rc-table';
import '../../assets/index.less';

// 合并单元格
export const getRowSpan = (source: (string | number | undefined)[] = []) => {
  const list: { rowSpan?: number }[] = [];
  let span = 0;
  source.reverse().forEach((key, index) => {
    span = span + 1;
    if (key !== source[index + 1]) {
      list.push({ rowSpan: span });
      span = 0;
    } else {
      list.push({ rowSpan: 0 });
    }
  });
  return list.reverse();
};

const Demo = () => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>([]);

  const data = [
    { key: 'a', a: '小二', d: '文零西路' },
    { key: 'b', a: '张三', d: '文一西路' },
    { key: 'c', a: '张三', d: '文二西路' },
  ];
  // const rowKeys = data.map(item => item.key);

  // const rowSpanList = getRowSpan(data.map(item => item.a));

  const columns: ColumnType<Record<string, any>>[] = [
    {
      title: '手机号',
      dataIndex: 'a',
      width: 100,
      colSpan: 2,
      // fixed: 'left',
      onCell: (_, index) => {
        // const { rowSpan = 1 } = rowSpanList[index];
        // const props: React.TdHTMLAttributes<HTMLTableCellElement> = {};
        // props.rowSpan = rowSpan;
        // if (rowSpan >= 1) {
        //   let currentRowSpan = rowSpan;
        //   for (let i = index; i < index + rowSpan; i += 1) {
        //     const rowKey = rowKeys[i];
        //     if (expandedRowKeys.includes(rowKey)) {
        //       currentRowSpan += 1;
        //     }
        //   }
        //   props.rowSpan = currentRowSpan;
        // }
        // return props;

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
    { title: 'key', dataIndex: 'key2', colSpan: 0, width: 100 },
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
        scroll={{ x: 1000 }}
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
