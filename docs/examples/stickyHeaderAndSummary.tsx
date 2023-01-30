/* eslint-disable no-console,func-names,react/no-multi-comp, no-nested-ternary */
import React from 'react';
import Table from 'rc-table';
import '../../assets/index.less';
import type { ColumnType } from '@/interface';

interface RecordType {
  a: string;
  b?: string;
  c?: string;
  d: number;
  key: string;
}

const columns: ColumnType<RecordType>[] = [
  { title: 'title1', dataIndex: 'a', key: 'a', width: 100, fixed: 'left' },
  { title: 'title2', dataIndex: 'b', key: 'b', width: 100, fixed: 'left', ellipsis: true },
  { title: 'title3', dataIndex: 'c', key: 'c' },
  { title: 'title4', dataIndex: 'b', key: 'd' },
  { title: 'title5', dataIndex: 'b', key: 'e' },
  { title: 'title6', dataIndex: 'b', key: 'f' },
  {
    title: (
      <div>
        title7
        <br />
        <br />
        <br />
        Hello world!
      </div>
    ),
    dataIndex: 'b',
    key: 'g',
  },
  { title: 'title8', dataIndex: 'b', key: 'h' },
  { title: 'title9', dataIndex: 'b', key: 'i' },
  { title: 'title10', dataIndex: 'b', key: 'j' },
  { title: 'title11', dataIndex: 'b', key: 'k', width: 50, fixed: 'right' },
  { title: 'title12', dataIndex: 'b', key: 'l', width: 100, fixed: 'right' },
];

const data: RecordType[] = [
  {
    a: '123',
    b: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    d: 3,
    key: '1',
  },
  { a: 'cdd', b: 'edd12221', d: 3, key: '2' },
  { a: '133', c: 'edd12221', d: 2, key: '3' },
  { a: '133', c: 'edd12221', d: 2, key: '4' },
  { a: '133', c: 'edd12221', d: 2, key: '5' },
  { a: '133', c: 'edd12221', d: 2, key: '6' },
  { a: '133', c: 'edd12221', d: 2, key: '7' },
  { a: '133', c: 'edd12221', d: 2, key: '8' },
  { a: '133', c: 'edd12221', d: 2, key: '9' },
];

for (let i = 0; i < 20; i += 1) {
  const str = `str_${i}`;

  data.push({
    a: str,
    b: str,
    d: i,
    key: str,
  });
}

const Demo = () => {
  const [sticky, setSticky] = React.useState(true);
  const [stickyTop, setStickyTop] = React.useState(true);

  return (
    <div style={{ width: 800 }}>
      <label>
        <input type="checkbox" checked={sticky} onChange={() => setSticky(!sticky)} />
        Sticky Summary
      </label>
      <label>
        <input type="checkbox" checked={stickyTop} onChange={() => setStickyTop(!stickyTop)} />
        Sticky Top
      </label>

      <Table
        sticky={sticky}
        columns={columns}
        expandedRowRender={({ b, c }) => b || c}
        scroll={{ x: 1200, y: sticky ? null : 800 }}
        data={data}
        summary={() => (
          <Table.Summary fixed={stickyTop ? 'top' : 'bottom'}>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} />
              <Table.Summary.Cell index={1} colSpan={2}>
                Summary
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3} colSpan={8}>
                Content
              </Table.Summary.Cell>
              <Table.Summary.Cell index={11} colSpan={2}>
                Right
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </div>
  );
};

export default Demo;
