import React from 'react';
import Table from 'rc-table';
import '../../assets/index.less';

const columns = [
  {
    title: 'title0',
    dataIndex: 'a',
    key: 'a',
    width: 100,
    fixed: 'left',
  },
  {
    title: 'title1',
    dataIndex: 'b',
    key: 'b',
    width: 100,
    fixed: 'left',
  },
  {
    title: 'title2',
    dataIndex: 'c',
    key: 'c',
    width: 100,
    fixed: 'left',
  },
  {
    title: 'title3',
    dataIndex: 'd',
    key: 'd',
    width: 100,
    fixed: 'left',
  },
];

const data = [
  { a: '123', b: 'xxxxxxxx xxxxxxxx', d: 3, key: '1' },
  { a: 'cdd', b: 'edd12221 edd12221', d: 3, key: '2' },
  { a: '133', c: 'edd12221 edd12221', d: 2, key: '3' },
  { a: '133', c: 'edd12221 edd12221', d: 2, key: '4' },
];

const Demo = () => (
  <div>
    <h2>Scroll X Only one</h2>
    <Table scroll={{ x: true }} columns={columns} data={data} />
    {/* <Table scroll={{ x: true }} columns={columns} data={data} /> */}
  </div>
);

export default Demo;
