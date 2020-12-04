import React from 'react';
import Table from 'rc-table';
import '../../assets/index.less';

const columns = [
  { title: 'title1', dataIndex: 'a', key: 'a', width: 100 },
  { id: '123', title: 'title2', dataIndex: 'b', key: 'b', width: 100 },
  { title: 'title3', dataIndex: 'c', key: 'c', width: 200 },
  {
    title: 'Operations',
    dataIndex: '',
    key: 'd',
    render() {
      return <a href="#">Operations</a>;
    },
  },
];

const data = [];

const Demo = () => (
  <div>
    <Table columns={columns} data={data} />
    <br />
    <Table columns={columns} data={data} emptyText="customize!!" />
    <br />
    <Table columns={columns} data={data} emptyText={() => <h1>No No No!</h1>} />
  </div>
);

export default Demo;
