/* eslint-disable no-console,func-names,react/no-multi-comp, no-nested-ternary */
import type { ColumnType } from '@/interface';
import Table from 'rc-table';
import React from 'react';
import '../../assets/index.less';

interface RecordType {
  a: string;
  b?: string;
  c?: string;
  d: number;
  key: string;
}

const columns: ColumnType<RecordType>[] = [
  { title: 'title1', dataIndex: 'a', key: 'a' },
  { title: 'title2', dataIndex: 'b', key: 'b' },
  { title: 'title3', dataIndex: 'c', key: 'c' },
  { title: 'title4', dataIndex: 'd', key: 'd' },
];

const data: RecordType[] = [
  { a: 'cdd', b: 'edd12221', d: 3, key: '2' },
  { a: '133', c: 'edd12221', d: 2, key: '3' },
  { a: '133', c: 'edd12221', d: 2, key: '4' },
];

const Demo = () => {
  return (
    <div style={{ width: 800 }}>
      <Table
        columns={columns}
        data={data}
        summary={() => (
          <Table.Summary>
            <Table.Summary.Row
              onClick={e => {
                e.stopPropagation();
                alert('click summary row will trigger the click event');
              }}
            >
              <Table.Summary.Cell index={0} />
              <Table.Summary.Cell index={1}>Summary</Table.Summary.Cell>
              <Table.Summary.Cell index={3}>Content</Table.Summary.Cell>
              <Table.Summary.Cell index={11}>Right</Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </div>
  );
};

export default Demo;
