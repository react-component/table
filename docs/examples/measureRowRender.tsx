import React from 'react';
import Table from 'rc-table';

// 示例：使用 measureRowRender 来隐藏 MeasureRow 中的弹层
const MeasureRowRenderExample = () => {
  const columns = [
    {
      title: (
        <div>
          Name
          <div className="filter-dropdown" style={{ display: 'none' }}>
            Filter Content
          </div>
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: 80,
    },
  ];

  const data = [
    { key: 1, name: 'John', age: 25 },
    { key: 2, name: 'Jane', age: 30 },
  ];

  // 自定义 MeasureRow 渲染，隐藏弹层内容
  const measureRowRender = measureRow => <div style={{ display: 'none' }}>{measureRow}</div>;

  return (
    <Table
      columns={columns}
      data={data}
      sticky
      scroll={{ x: true }}
      measureRowRender={measureRowRender}
    />
  );
};

export default MeasureRowRenderExample;
