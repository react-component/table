/* eslint-disable no-console,func-names,react/no-multi-comp */
import React from 'react';
import Table from '../src';
import '../assets/index.less';
import { ColumnsType } from '../src/interface';

const columns: ColumnsType = [
  { dataIndex: 'a', title: 'a' },
  { dataIndex: 'b', title: 'b' },
  { dataIndex: 'c', title: 'c', fixed: 'right', width: 200 },
];

const Demo = () => {
  const [showB, setShowB] = React.useState(true);
  const myColumns = showB ? columns : columns.filter(({ title }) => title !== 'b');

  return (
    <div>
      <Table<any>
        scroll={{ x: 2000 }}
        tableLayout="auto"
        columns={myColumns}
        data={[{ a: 1, b: 2, c: 3, key: 1 }]}
      />
      <button
        type="button"
        onClick={() => {
          setShowB(!showB);
        }}
      >
        Trigger {showB.toString()}
      </button>
    </div>
  );
};

export default Demo;
/* eslint-enable */
