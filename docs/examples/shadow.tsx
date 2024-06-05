import React from 'react';
import type { TableProps } from 'rc-table';
import Table from 'rc-table';
import '../../assets/index.less';
import type { ColumnsType } from '@/interface';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  street: string;
  building: string;
  number: number;
  companyAddress: string;
  companyName: string;
  gender: string;
}

const columns: ColumnsType<any> = [
  {
    title: 'Other',
    fixed: 'left',
    ellipsis: true,
    children: [
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: 150,
        fixed: 'left',
        ellipsis: true,
      },
      {
        title: 'Address',
        children: [
          {
            title: 'Street',
            dataIndex: 'street',
            key: 'street',
            width: 150,
            fixed: 'left',
            ellipsis: true,
          },
          {
            title: 'Block',
            children: [
              {
                title: 'Door No.',
                dataIndex: 'number',
                key: 'number',
                width: 100,
                fixed: 'left',
                ellipsis: true,
              },
              {
                title: 'Building',
                dataIndex: 'building',
                key: 'building',
                width: 100,
                fixed: 'left',
                ellipsis: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 100,
  },
  {
    title: 'Company',
    children: [
      {
        title: 'Company Address',
        dataIndex: 'companyAddress',
        key: 'companyAddress',
        width: 200,
      },
      {
        title: 'Company Name',
        dataIndex: 'companyName',
        key: 'companyName',
      },
    ],
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
    width: 80,
    fixed: 'right',
  },
];

const data: DataType[] = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: 'John Brown',
    age: i + 1,
    street: 'Lake Park',
    building: 'C',
    number: 2035,
    companyAddress: 'Lake Street 42',
    companyName: 'SoftLake Co',
    gender: 'M',
  });
}

interface User {
  key: number;
  name: string;
  name0?: string;
  name1?: string;
  name2?: string;
  name3?: string;
}

const columns2: ColumnsType<User> = [
  {
    title: '父表头右侧的阴影导致整个表格最右侧有空隙',
    key: 'title',
    children: [
      {
        key: 'name0',
        title: 'Name0',
        fixed: 'left',
        dataIndex: 'name0',
        width: 100,
      },
      {
        key: 'name1',
        title: 'Name1',
        fixed: 'left',
        dataIndex: 'name1',
        width: 100,
      },
      {
        key: 'name2',
        title: 'Name2',
        dataIndex: 'name2',
        width: 500,
      },
      {
        key: 'name3',
        title: 'Name3',
        fixed: 'right',
        dataIndex: 'name3',
        width: 100,
      },
    ],
  },
];

const data2: User[] = [
  {
    key: 0,
    name: 'Jack',
  },
  {
    key: 1,
    name: 'Jack1',
  },
  {
    key: 2,
    name: 'Jack1',
  },
];

const Demo = () => (
  <div>
    <h2>colSpan & rowSpan</h2>
    <Table columns={columns} data={data} className="table" scroll={{ x: 1500, y: 500 }} />
    <hr />
    <Table columns={columns2} data={data2} className="table" scroll={{ x: 1500, y: 500 }} />
  </div>
);

export default Demo;
