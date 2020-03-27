import React from 'react';
import Table from '../src';
import '../assets/index.less';

const columns = [
  { title: 'name', fixed: 'left', dataIndex: 'name', width: 100, ellipsis: true },
  { title: 'descrption', dataIndex: 'descrption', width: 50, key: 'descrption 1', ellipsis: true },
  { title: 'descrption', dataIndex: 'descrption', width: 100, key: 'descrption 2', ellipsis: true },
  { title: 'descrption', dataIndex: 'descrption', width: 100, key: 'descrption 3', ellipsis: true },
  { title: 'descrption', dataIndex: 'descrption', width: 100, key: 'descrption 4', ellipsis: true },
  { title: 'descrption', dataIndex: 'descrption', width: 100, key: 'descrption 5', ellipsis: true },
  { title: 'descrption', dataIndex: 'descrption', width: 100, key: 'descrption 6', ellipsis: true },
  { title: 'descrption', dataIndex: 'descrption', width: 100, key: 'descrption 7', ellipsis: true },
  { title: 'descrption', dataIndex: 'descrption', width: 100, key: 'descrption 8', ellipsis: true },
  { title: 'descrption', dataIndex: 'descrption', width: 100, key: 'descrption 9', ellipsis: true },
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
  { name: 'verylongname verylongname verylongname', descrption: 'descrption descrption', key: '2' },
];

let width = 0;
columns.forEach(elem => {
  width += elem.width * 1 || 0;
});
const scroll = {
  x: width,
};
const Demo = () => (
  <div>
    <h2>Table ellipsis</h2>
    <Table columns={columns} data={data} scroll={scroll} />
  </div>
);

export default Demo;
