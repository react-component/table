/* eslint-disable no-console,func-names,react/no-multi-comp */
import React, { useRef } from 'react';
import Table from 'rc-table';
import '../../assets/index.less';
import { ColumnType } from '@/interface';

interface RecordType {
  a?: string;
  b?: string;
  c?: string;
  d?: number;
  key?: string;
}

const fixedColumns: ColumnType<RecordType>[] = [
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
  { title: 'title11', dataIndex: 'b', key: 'k' },
  { title: 'title12', dataIndex: 'b', key: 'l', width: 100, fixed: 'right' },
];

const fixedData = [
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

const columns: ColumnType<{ a: string; b: string; c: string }>[] = [
  { title: 'title1', dataIndex: 'a', key: 'a', width: 100 },
  { title: 'title2', dataIndex: 'b', key: 'b', width: 100, align: 'right' },
  { title: 'title3', dataIndex: 'c', key: 'c', width: 200 },
  {
    title: 'Operations',
    dataIndex: '',
    key: 'd',
    render(_, record) {
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
  { a: '1333', c: 'eee', d: 2, key: '4' },
  { a: '1333', c: 'eee', d: 2, key: '5' },
  { a: '1333', c: 'eee', d: 2, key: '6' },
  { a: '1333', c: 'eee', d: 2, key: '7' },
  { a: '1333', c: 'eee', d: 2, key: '8' },
  { a: '1333', c: 'eee', d: 2, key: '9' },
  { a: '1333', c: 'eee', d: 2, key: '10' },
  { a: '1333', c: 'eee', d: 2, key: '11' },
  { a: '1333', c: 'eee', d: 2, key: '12' },
  { a: '1333', c: 'eee', d: 2, key: '13' },
  { a: '1333', c: 'eee', d: 2, key: '14' },
  { a: '1333', c: 'eee', d: 2, key: '15' },
  { a: '1333', c: 'eee', d: 2, key: '16' },
  { a: '1333', c: 'eee', d: 2, key: '17' },
  { a: '1333', c: 'eee', d: 2, key: '18' },
  { a: '1333', c: 'eee', d: 2, key: '19' },
  { a: '1333', c: 'eee', d: 2, key: '20' },
];

const Demo = () => {
  const container = useRef();
  return (
    <div
      style={{
        height: 10000,
      }}
    >
      <h2>Sticky</h2>
      <Table<RecordType>
        columns={columns}
        data={data}
        tableLayout="auto"
        sticky
        scroll={{
          x: 10000,
        }}
        style={{
          marginBottom: 100,
        }}
      />

      <h2>Show offset Header</h2>
      <Table<RecordType>
        columns={columns}
        data={data}
        tableLayout="auto"
        sticky={{
          offsetHeader: 100,
        }}
        scroll={{
          x: 10000,
        }}
        style={{
          marginBottom: 100,
        }}
      />

      <h2>Show offset scroll</h2>
      <Table<RecordType>
        columns={columns}
        data={data}
        tableLayout="auto"
        sticky={{
          offsetScroll: 100,
        }}
        scroll={{
          x: 10000,
        }}
        style={{
          marginBottom: 100,
        }}
      />

      <h2>Sticky with fixed columns</h2>
      <div style={{ width: 800 }}>
        <Table<RecordType>
          columns={fixedColumns}
          data={fixedData}
          sticky
          scroll={{
            x: 1200,
          }}
          style={{
            marginBottom: 100,
          }}
        />
      </div>

      <h2>Sticky with fixed columns and scroll.y</h2>
      <div style={{ width: 800 }}>
        <Table<RecordType>
          columns={fixedColumns}
          data={fixedData}
          sticky
          scroll={{
            x: 1200,
            y: 300,
          }}
          style={{
            marginBottom: 100,
          }}
        />
      </div>

      <h2>Sticky with custom container</h2>
      <div style={{ height: 500, overflow: 'scroll' }} ref={container}>
        <div style={{ height: 700 }}>
          {' '}
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore aliquid neque accusamus
          suscipit asperiores, id ullam in iste soluta dignissimos vero incidunt, rem ex consectetur
          beatae totam aperiam. Sunt, laudantium?
        </div>
        <Table<RecordType>
          columns={fixedColumns}
          data={fixedData}
          scroll={{
            x: 1200,
          }}
          sticky={{
            getContainer: () => container.current,
          }}
          style={{
            marginBottom: 100,
          }}
        />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore aliquid neque accusamus
        suscipit asperiores, id ullam in iste soluta dignissimos vero incidunt, rem ex consectetur
        beatae totam aperiam. Sunt, laudantium?
      </div>
    </div>
  );
};

export default Demo;
