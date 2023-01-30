import React, { useState, useCallback } from 'react';
import Table from 'rc-table';
import '../../assets/index.less';
import type { ColumnType } from '@/interface';

interface RecordType {
  a: string;
  b?: string;
  c?: string;
  d: number;
  key: string;
}

const defaultColumns: ColumnType<RecordType>[] = [
  { title: 'title1', dataIndex: 'a', key: 'a', width: 100, fixed: 'left' },
  { title: 'title2', dataIndex: 'b', key: 'b', width: 100, fixed: 'left', ellipsis: true },
  { title: 'title3', dataIndex: 'c', key: 'c' },
  { title: 'title4', dataIndex: 'b', key: 'd' },
  { title: 'title5', dataIndex: 'b', key: 'e' },
  { title: 'title6', dataIndex: 'b', key: 'f' },
  { title: 'title8', dataIndex: 'b', key: 'h' },
  { title: 'title9', dataIndex: 'b', key: 'i' },
  { title: 'title11', dataIndex: 'b', key: 'j' },
  { title: 'title12', dataIndex: 'b', key: 'j1' },
  { title: 'title13', dataIndex: 'b', key: 'j2' },
  { title: 'title14', dataIndex: 'b', key: 'j3' },
  { title: 'title15', dataIndex: 'b', key: 'j4' },
  { title: 'title16', dataIndex: 'b', key: 'j5' },
  { title: 'title17', dataIndex: 'b', key: 'j6' },
  { title: 'title18', dataIndex: 'b', key: 'j7' },
  { title: 'title19', dataIndex: 'b', key: 'k', width: 50, fixed: 'right' },
  { title: 'title20', dataIndex: 'b', key: 'l', width: 100, fixed: 'right' },
];

const data: RecordType[] = Array.from(new Array(200).fill(1), (v, index) => {
  return {
    a: '123',
    b: 'xxxxx',
    d: 3,
    key: index + '',
  };
});

const Demo = () => {
  const [isShown, setIsShown] = useState(false);
  const [renderTime, setRenderTime] = useState(0);
  const [isFixed, setIsFixed] = useState(true);
  const [columns, setColumns] = useState(defaultColumns);
  const onToggleSideBar = useCallback(() => {
    const s = window.performance.now();
    setIsShown(v => !v);

    setTimeout(() => {
      setRenderTime(+(window.performance.now() - s).toFixed(2));
    });
  }, []);

  const onToggleFixed = useCallback(() => {
    setIsFixed(v => !v);
  }, []);

  const onRemoveColumn = useCallback(() => {
    setColumns(state => {
      const newState = [...state];
      newState.splice(
        state.findIndex(({ fixed }) => !fixed),
        1,
      );
      return newState;
    });
  }, []);

  const onAddColumn = useCallback(() => {
    setColumns(state => {
      const newState = [...state];
      newState.splice(
        state.findIndex(({ fixed }) => !fixed),
        0,
        { title: 'new title', dataIndex: 'b', key: Math.random().toString(16).slice(2) },
      );
      return newState;
    });
  }, []);

  const expandedRowRender = useCallback(({ b, c }) => b || c, []);

  return (
    <div>
      <div>
        <button onClick={onToggleSideBar}>切换侧边栏展开状态</button>
        <button onClick={onToggleFixed}>切换固定列</button>
        <button onClick={onRemoveColumn}>删除列</button>
        <button onClick={onAddColumn}>增加列</button>
        <p>更新用时：{renderTime} ms</p>
      </div>
      <div
        style={{
          display: 'flex',
          width: '800px',
          resize: 'both',
          padding: '12px',
          border: '1px solid #333',
          height: '80vh',
          overflow: 'auto',
        }}
      >
        <div style={{ flex: `0 0 ${isShown ? '10px' : '80px'}` }} />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Table
            columns={columns}
            scroll={isFixed ? { x: 1200 } : null}
            data={data}
            expandedRowRender={expandedRowRender}
          />
        </div>
      </div>
    </div>
  );
};

export default Demo;
