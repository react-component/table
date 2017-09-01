/* eslint-disable no-console,func-names,react/no-multi-comp */
import React from 'react';
import ReactDOM from 'react-dom';
import Table from '../src/index';
import 'rc-table/assets/index.less';

const columns = [
  { title: 'Project', dataIndex: 'project', key: 'project', width: 150 },
  { title: 'User', dataIndex: 'user', key: 'user', width: 150 },
  { title: 'Role', dataIndex: 'role', key: 'role', width: 150 },
  { title: 'Remark', dataIndex: 'remark', key: 'remark' },
];

const data = [
  { key: '1', project: 'ant-design', user: 'yiminghe', role: 'maintainer', remark: '' },
  { key: '2', project: 'ant-design', user: 'afc163', role: 'maintainer', remark: '' },
  { key: '3', project: 'ant-design', user: 'marswong', role: 'contributor', remark: '' },
];

ReactDOM.render(
  <div>
    <h2>table with custom textAlign</h2>
    <Table columns={columns} data={data} headerAlign="center" bodyAlign="right" />
  </div>,
  document.getElementById('__react-content')
);
