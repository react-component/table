/* eslint-disable no-console,func-names,react/no-multi-comp */
import React from 'react';
import ReactDOM from 'react-dom';
import Table from 'rc-table';
import 'rc-table/assets/index.less';

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
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    width: 200,
  },
  {
    title: 'Operations',
    dataIndex: 'operation',
    key: 'x',
    width: 150,
  },
];

const data = [
  {
    key: 1,
    name: 'a',
    age: 32,
    address: 'I am a',
    children: [
      {
        key: 11,
        name: 'aa',
        age: 33,
        address: 'I am aa',
      },
      {
        key: 12,
        name: 'ab',
        age: 33,
        address: 'I am ab',
        children: [
          {
            key: 121,
            name: 'aba',
            age: 33,
            address: 'I am aba',
          },
        ],
      },
      {
        key: 13,
        name: 'ac',
        age: 33,
        address: 'I am ac',
        children: [
          {
            key: 131,
            name: 'aca',
            age: 33,
            address: 'I am aca',
            children: [
              {
                key: 1311,
                name: 'acaa',
                age: 33,
                address: 'I am acaa',
              },
              {
                key: 1312,
                name: 'acab',
                age: 33,
                address: 'I am acab',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 2,
    name: 'b',
    age: 32,
    address: 'I am b',
  },
];

function onExpand(expanded, record) {
  console.log('onExpand', expanded, record);
}

ReactDOM.render(
  <Table defaultExpandAllRows columns={columns} data={data} indentSize={30} onExpand={onExpand} />,
  document.getElementById('__react-content'),
);
