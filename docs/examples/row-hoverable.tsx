import type { TableProps } from 'rc-table';
import Table from 'rc-table';
import React from 'react';
import '../../assets/index.less';

interface RecordType {
  a?: string;
}

const data = [{ a: 'A' }, { a: 'B' }, { a: 'C' }];

const Demo = () => {
  const columns: TableProps<RecordType>['columns'] = [{ title: 'title', dataIndex: 'a' }];

  return <Table columns={columns} data={data} rowHoverable={false} />;
};

export default Demo;
