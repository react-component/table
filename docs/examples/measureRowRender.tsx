import React from 'react';
import { Table } from 'rc-table';
import { ConfigProvider } from 'antd';

// 示例：使用 measureRowRender 包裹 ConfigProvider 来隐藏 MeasureRow 中的弹层
const MeasureRowRenderExample = () => {
  const columns = [
    {
      title: (
        <div>
          Name
          <ConfigProvider
            getPopupContainer={node => node} // 将弹层渲染到 MeasureRow 内部
          >
            <div>Filter Dropdown</div>
          </ConfigProvider>
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

  // 自定义 MeasureRow 渲染，包裹 ConfigProvider 来隐藏弹层
  const measureRowRender = measureRow => (
    <ConfigProvider
      getPopupContainer={() => {
        // 创建一个隐藏的容器来承载弹层
        const hiddenContainer = document.createElement('div');
        hiddenContainer.style.display = 'none';
        hiddenContainer.style.position = 'absolute';
        hiddenContainer.style.left = '-9999px';
        hiddenContainer.style.top = '-9999px';
        document.body.appendChild(hiddenContainer);
        return hiddenContainer;
      }}
    >
      {measureRow}
    </ConfigProvider>
  );

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
