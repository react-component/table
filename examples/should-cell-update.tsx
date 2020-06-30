import React from 'react';
import Table from '../src';
import '../assets/index.less';

interface RecordType {
  key: React.Key;
  name: string;
  age: number;
  children?: RecordType[];
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 400,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: 100,
  }
];

const data: RecordType[] = [
  {
    key: 1,
    name: 'a',
    age: 32,
    children: [
      {
        key: 11,
        name: 'aa',
        age: 33,
      },
    ],
  },
  {
    key: 2,
    name: 'b',
    age: 32,
    children: [
      {
        key: 11,
        name: 'bb',
        age: 33,
      },
    ],
  },
];

const Cell = React.memo((cell) => {
  return <td>{cell.children}</td>;
}, (pre, next) => {
  // 【使用column的shouldCellUpdate属性同样会导致该问题】

  /*
   此处模拟某些情况下该单元格是否需要渲染（当前的展开收起的状态发生变化时需要重新渲染，反之则不需要需要渲染）
   */

  /*
   BUG：当包含展开图标的单元格不重新渲染时，table中的onTriggerExpand方法中获取到的mergedExpandedKeys使用的是该单元格首次渲染的值，导致展开收起异常
   */

  // 改进：不使用useMemo进行数据缓存，而是参照react官方推荐使用useRef.current来缓存上一次的值
  return pre.children[0]?.props.children[1].props.className === next.children[0]?.props.children[1].props.className;
});

const Demo = () => (
  <Table<RecordType>
    components={{
      body: {
        cell: Cell,
      }
    }}
    columns={columns}
    data={data}
    indentSize={30}
  />
);

export default Demo;
