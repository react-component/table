import React from 'react';
import type { TableProps } from 'rc-table';
import Table from 'rc-table';
import '../../assets/index.less';

const columns: TableProps['columns'] = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '出勤',
    rowSpan: 3,
    children: [
      {
        title: '出勤',
        dataIndex: 'attendance',
        key: 'attendance',
      },
      {
        title: '迟到',
        dataIndex: 'late',
        key: 'late',
      },
      {
        title: '请假',
        dataIndex: 'leave',
        key: 'leave',
      },
    ],
  },
  {
    title: '其它',
    children: [
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '住址',
        children: [
          {
            title: '街道',
            dataIndex: 'street',
            key: 'street',
          },
          {
            title: '小区',
            children: [
              {
                title: '单元',
                dataIndex: 'building',
                key: 'building',
              },
              {
                title: '门牌',
                dataIndex: 'number',
                key: 'number',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: '技能',
    rowSpan: 2,
    children: [
      {
        title: '前端',
        dataIndex: 'frontend',
        key: 'frontend',
      },
      {
        title: '后端',
        dataIndex: 'backend',
        key: 'backend',
      },
    ],
  },
  {
    title: '公司',
    children: [
      {
        title: '地址',
        dataIndex: 'companyAddress',
        key: 'companyAddress',
      },
      {
        title: '名称',
        dataIndex: 'companyName',
        key: 'companyName',
      },
    ],
  },
  {
    title: '性别',
    dataIndex: 'gender',
    key: 'gender',
  },
];

const data = [
  {
    key: '1',
    name: '胡彦斌',
    attendance: 20,
    late: 0,
    leave: 1,
    age: 32,
    street: '拱墅区和睦街道',
    building: 1,
    number: 2033,
    frontend: 'S',
    backend: 'S',
    companyAddress: '西湖区湖底公园',
    companyName: '湖底有限公司',
    gender: '男',
  },
  {
    key: '2',
    name: '胡彦祖',
    attendance: 20,
    late: 0,
    leave: 1,
    age: 42,
    street: '拱墅区和睦街道',
    building: 3,
    number: 2035,
    frontend: 'S',
    backend: 'S',
    companyAddress: '西湖区湖底公园',
    companyName: '湖底有限公司',
    gender: '男',
  },
];

const Demo = () => (
  <div>
    <h2>grouping columns specified colSpan & rowSpan</h2>
    <Table columns={columns} data={data} className="bordered" />
  </div>
);

export default Demo;
