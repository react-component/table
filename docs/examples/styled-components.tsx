import React from 'react';
import styled from 'styled-components';
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

const data = [
  { a: '123', key: '1' },
  { a: 'cdd', b: 'edd', key: '2' },
  { a: '1333', c: 'eee', d: 2, key: '3' },
];

const BodyRow = styled.tr`
  & td {
    transition: all 0.3s;
  }

  &:hover td {
    background: palevioletred;
    transform: scale(1.01);
  }
`;

const components = {
  body: {
    row: BodyRow,
  },
};

const Demo = () => (
  <div>
    <h2>Integrate with styled-components</h2>
    <Table columns={columns} data={data} components={components} />
  </div>
);

export default Demo;
