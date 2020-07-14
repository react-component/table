/* eslint-disable no-console,func-names,react/no-multi-comp */
import React from 'react';
import Table from '../src';
import '../assets/index.less';
import { ColumnType } from '../src/interface';

interface RecordType {
  a?: string;
  b?: string;
  c?: string;
}

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

const Demo = () => (
  <div
    style={{
      height: 10000,
    }}
  >
    <h2>Show Header</h2>
    <Table<RecordType>
      columns={columns}
      data={data}
      tableLayout="auto"
      sticky={{
        isShowHeader: true,
      }}
      scroll={{
        x: 10000,
      }}
      style={{
        marginBottom: 100,
      }}
    />

    <h2>Show Scroll</h2>
    <Table<RecordType>
      columns={columns}
      data={data}
      tableLayout="auto"
      sticky={{
        isShowScroll: true,
      }}
      scroll={{
        x: 10000,
      }}
      style={{
        marginBottom: 100,
      }}
    />

    <h2>Show Both</h2>
    <Table<RecordType>
      columns={columns}
      data={data}
      tableLayout="auto"
      sticky={{
        isShowHeader: true,
        isShowScroll: true,
      }}
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
        isShowHeader: true,
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
        isShowScroll: true,
        offsetScroll: 100,
      }}
      scroll={{
        x: 10000,
      }}
      style={{
        marginBottom: 100,
      }}
    />
  </div>
);

export default Demo;
