import React from 'react';
import Table from '../src';
import '../assets/index.less';

const columns = [
  { title: 'title1', dataIndex: 'a', key: 'a', width: 100 },
  { title: 'title2', dataIndex: 'b', key: 'b', width: 100 },
  { title: 'title3', dataIndex: 'c', key: 'c', width: 100 },
  { title: 'title4', dataIndex: 'b', key: 'd', width: 100 },
  { title: 'title5', dataIndex: 'b', key: 'e', width: 100 },
  { title: 'title6', dataIndex: 'b', key: 'f', width: 100 },
  { title: 'title7', dataIndex: 'b', key: 'g', width: 100 },
  { title: 'title8', dataIndex: 'b', key: 'h', width: 100 },
  { title: 'title9', dataIndex: 'b', key: 'i', width: 100 },
  { title: 'title10', dataIndex: 'b', key: 'j', width: 100 },
  { title: 'title11', dataIndex: 'b', key: 'k', width: 100 },
  { title: 'title12', dataIndex: 'b', key: 'l', width: 100 },
];

const data = [
  { a: '123', b: 'xxxxxxxx xxxxxxxx', d: 3, key: '1' },
  { a: 'cdd', b: 'edd12221 edd12221', d: 3, key: '2' },
  { a: '133', c: 'edd12221 edd12221', d: 2, key: '3' },
  { a: '133', c: 'edd12221 edd12221', d: 2, key: '4' },
];

const Demo = () => (
  <div>
    <h2>Scroll X</h2>
    <Table style={{ width: 800 }} scroll={{ x: true }} columns={columns} data={data} />
  </div>
);

export default Demo;
