import React from 'react';
import ReactDOM from 'react-dom';
import Table from 'rc-table';
import 'rc-table/assets/index.less';

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

const data = [
  { a: '123', key: '1' },
  { a: 'cdd', b: 'edd', key: '2' },
  { a: '1333', c: 'eee', d: 2, key: '3' },
];

const MyTable = props => <table name="my-table" {...props} />;
const HeaderWrapper = props => <thead name="my-header-wrapper" {...props} />;
const HeaderRow = props => <tr name="my-header-row" {...props} />;
const HeaderCell = props => <th name="my-header-cell" {...props} />;
const BodyWrapper = props => <tbody name="my-body-wrapper" {...props} />;
const BodyRow = props => <tr name="my-body-row" {...props} />;
const BodyCell = props => <td name="my-body-cell" {...props} />;

const components = {
  table: MyTable,
  header: {
    wrapper: HeaderWrapper,
    row: HeaderRow,
    cell: HeaderCell,
  },
  body: {
    wrapper: BodyWrapper,
    row: BodyRow,
    cell: BodyCell,
  },
};

ReactDOM.render(
  <div>
    <h2>Custom Component</h2>
    <Table columns={columns} data={data} components={components} />
  </div>,
  document.getElementById('__react-content')
);
