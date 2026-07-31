import type { TableProps } from '@rc-component/table';
import Table from '@rc-component/table';
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
