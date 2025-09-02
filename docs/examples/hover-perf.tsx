import React from 'react';
import Table from 'rc-table';
import '../../assets/index.less';

const CellExample = ({ data, count }) => {
  console.log('rerender ' + Date.now());
  return <>{count + ' ' + data.index}</>;
};

// const dataSource = Array.from({ length: 10000 }).map((_, index) => ({ index }));
const dataSource = Array.from({ length: 100 }).map((_, index) => ({ index, key: index }));

const ProblemTable = () => {
  const columns = [
    {
      title: 'Grouped by 10',
      onCell: (_, index) => ({ rowSpan: index % 10 === 0 ? 10 : 0 }),
      render: (_, record) => (
        <span>
          {record.index}-{record.index + 10}
        </span>
      ),
    },
    {
      title: 'one',
      render: (_, record) => <CellExample count="one" data={record} />,
    },
    {
      title: 'two',
      render: (_, record) => <CellExample count="two" data={record} />,
    },
    {
      title: 'three',
      render: (_, record) => <CellExample count="three" data={record} />,
    },
    {
      title: 'four',
      render: (_, record) => <CellExample count="four" data={record} />,
    },
  ];
  return <Table tableLayout="fixed" data={dataSource} columns={columns} />;
};

export default ProblemTable;
