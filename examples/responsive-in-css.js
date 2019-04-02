import React from 'react';
import ReactDOM from 'react-dom';
import Table from 'rc-table';
import 'rc-table/assets/bordered.less';
import 'rc-table/assets/index.less';
import './responsive-in-css.css';

const columns = [
  { title: '表头A', className: 'title-a', dataIndex: 'a', key: 'a' },
  {
    title: '表头B(hidden xs)',
    className: 'title-a hidden-xs',
    colClassName: 'hidden-xs',
    dataIndex: 'b',
    key: 'b',
  },
  {
    title: '表头C(hidden sm)',
    className: 'title-a hidden-sm',
    colClassName: 'hidden-sm',
    dataIndex: 'c',
    key: 'c',
  },
];

const data = [
  { key: '1', a: 'a1', b: 'b1', c: 'c1' },
  { key: '2', a: 'a2', b: 'b2', c: 'c2' },
  { key: '3', a: 'a3', b: 'b3', c: 'c3' },
];

ReactDOM.render(
  <div>
    <h2>responsive in css</h2>
    <Table columns={columns} data={data} className="bordered" />
  </div>,
  document.getElementById('__react-content'),
);
