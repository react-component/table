/* eslint-disable no-console,func-names,react/no-multi-comp */
import React from 'react';
import Table from 'rc-table';
import '../../assets/index.less';

interface RecordType {
  a?: string;
  b?: string;
  c?: string;
}

const columns = [
  { title: 'title1', dataIndex: 'a', key: 'a', width: 100 },
  { id: '123', title: 'title2', dataIndex: 'b', key: 'b', width: 100, align: 'right' },
  { title: 'title3', dataIndex: 'c', key: 'c', width: 200 },
  {
    title: 'Operations',
    dataIndex: '',
    key: 'd',
    render(_: any, record: RecordType) {
      return (
        <a
          onClick={e => {
            e.preventDefault();
            console.log('Operate on:', record);
          }}
          href="#"
        >
          Operations
        </a>
      );
    },
  },
];

const data = [
  { a: '123', key: '1' },
  { a: 'cdd', b: 'edd', key: '2' },
  { a: '1333', c: 'eee', d: 2, key: '3' },
];

const Demo = () => (
  <div>
    <h2>simple table</h2>
    <Table<RecordType> columns={columns} data={data} />
  </div>
);

export default Demo;
/* eslint-enable */
