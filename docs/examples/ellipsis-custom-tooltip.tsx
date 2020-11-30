import React from 'react';
import Tooltip from 'rc-tooltip';
import Table from 'rc-table';
import '../../assets/index.less';
import 'rc-tooltip/assets/bootstrap.css';

const createColumns = (length: number) => {
  return Array.from({ length }, (_, i) => ({
    title: 'description',
    dataIndex: 'description',
    key: `description ${i + 1}`,
    ellipsis: {
      showTitle: false,
    },
    ...(i === 0 ? { width: 50 } : null),
    render(description: string) {
      return (
        <Tooltip placement="topLeft" overlay={description}>
          <span>{description}</span>
        </Tooltip>
      );
    },
  }));
};

const columns = [
  {
    title: 'name',
    dataIndex: 'name',
    width: 100,
    ellipsis: {
      showTitle: false,
    },
    render: (name: string) => (
      <Tooltip placement="topLeft" overlay={name}>
        <span>{name}</span>
      </Tooltip>
    ),
  },
  ...createColumns(10),
  {
    title: 'Operations',
    key: 'operations',
    ellipsis: {
      showTitle: false,
    },
    render() {
      return (
        <Tooltip placement="topLeft" overlay="Operations">
          <a href="#">Operations</a>
        </Tooltip>
      );
    },
  },
];

const data = [
  { name: 'jack', description: 'description description', key: '1' },
  { name: 'jackjackjackjackjackjack', description: 'description description', key: '2' },
  { name: 'jack ma', description: 'description description', key: '3' },
  { name: 'jack nickson', description: 'description description', key: '4' },
];

const Demo = () => (
  <div>
    <h2>Table ellipsis custom tooltip</h2>
    <Table columns={columns} data={data} />
  </div>
);

export default Demo;
