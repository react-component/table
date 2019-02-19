/* eslint-disable no-console,func-names,react/no-multi-comp */
import React from 'react';
import ReactDOM from 'react-dom';
import Table from 'rc-table';
import 'rc-table/assets/index.less';

const columns = [
  { title: 'title1', dataIndex: 'a', key: 'a', fixed: 'left' },
  { title: 'title2', dataIndex: 'b', key: 'b', fixed: 'left' },
  { title: 'titletitle3', dataIndex: 'c', key: 'c' },
  { title: 'title4', dataIndex: 'c', key: 'd' },
  { title: 'title5', dataIndex: 'c', key: 'e' },
  { title: 'title6', dataIndex: 'c', key: 'f' },
  { title: 'title7', dataIndex: 'c', key: 'g' },
  { title: 'title8', dataIndex: 'c', key: 'h' },
  { title: 'title9', dataIndex: 'b', key: 'i' },
  { title: 'title10', dataIndex: 'b', key: 'j' },
  { title: 'title11', dataIndex: 'b', key: 'k' },
  { title: 'title12', dataIndex: 'b', key: 'l', fixed: 'right' },
];

const data = [
  { a: 'aaa', b: 'bbb', c: '内容内容内容内容内容', d: 3, key: '1' },
  { a: 'aaa', b: 'bbb', c: '内容内容内容内容内容', d: 3, key: '2' },
  { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '3' },
  { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '4' },
  { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '5' },
  { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '6' },
  { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '7' },
  { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '8' },
  { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '9' },
];

ReactDOM.render(
  <div>
    <h2>Fixed columns and header, resize window for test</h2>
    <Table columns={columns} scroll={{ x: '150%', y: 300 }} data={data} />
  </div>,
  document.getElementById('__react-content'),
);
