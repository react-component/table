import React from 'react';
import Table from 'rc-table';
import '../../assets/index.less';

const columns = [
  { title: 'name', dataIndex: 'name', width: 100, ellipsis: true },
  { title: 'descrption', dataIndex: 'descrption', key: 'descrption 1', ellipsis: true, width: 50 },
  { title: 'descrption', dataIndex: 'descrption', key: 'descrption 2', ellipsis: true },
  { title: 'descrption', dataIndex: 'descrption', key: 'descrption 3', ellipsis: true },
  { title: 'descrption', dataIndex: 'descrption', key: 'descrption 4', ellipsis: true },
  { title: 'descrption', dataIndex: 'descrption', key: 'descrption 5', ellipsis: true },
  { title: 'descrption', dataIndex: 'descrption', key: 'descrption 6', ellipsis: true },
  { title: 'descrption', dataIndex: 'descrption', key: 'descrption 7', ellipsis: true },
  { title: 'descrption', dataIndex: 'descrption', key: 'descrption 8', ellipsis: true },
  { title: 'descrption', dataIndex: 'descrption', key: 'descrption 9', ellipsis: true },
  {
    title: 'Operations',
    key: 'operations',
    ellipsis: true,
    render() {
      return <a href="#">Operations</a>;
    },
  },
];

const data = [
  { name: 'jack', descrption: 'descrption descrption descrption', key: '1' },
  { name: 'jackjackjackjackjackjack', descrption: 'descrption descrption', key: '2' },
  { name: 'jack ma', descrption: 'descrption descrption descrption descrption', key: '3' },
  { name: 'jack nickson', descrption: 'descrption descrption', key: '4' },
];

const Demo = () => (
  <div>
    <h2>Table ellipsis</h2>
    <Table columns={columns} data={data} />
  </div>
);

export default Demo;
