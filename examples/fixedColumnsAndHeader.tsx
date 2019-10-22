import React from 'react';
import Table from '../src';
import '../assets/index.less';
import { ColumnsType } from '../src/interface';

interface RecordType {
  a: string;
  b?: string;
  c: string;
  d: number;
  key: string;
}

const columns: ColumnsType<RecordType> = [
  { title: 'title1', dataIndex: 'a', key: 'a', width: 100, fixed: 'left' },
  { title: 'title2', dataIndex: 'b', key: 'b', width: 100, fixed: 'left' },
  // { title: 'title3', dataIndex: 'c', key: 'c', width: 150 },
  // { title: 'title4', dataIndex: 'c', key: 'd', width: 150 },
  // { title: 'title5', dataIndex: 'c', key: 'e', width: 150 },
  {
    title: 'title3',
    children: [
      { title: 'title4', dataIndex: 'c', key: 'd', width: 150 },
      { title: 'title5', dataIndex: 'c', key: 'e', width: 150 },
    ],
  },
  { title: 'title6', dataIndex: 'c', key: 'f', width: 150 },
  { title: 'title7', dataIndex: 'c', key: 'g', width: 150 },
  { title: 'title8', dataIndex: 'c', key: 'h', width: 150 },
  { title: 'title9', dataIndex: 'b', key: 'i', width: 150 },
  { title: 'title10', dataIndex: 'b', key: 'j', width: 150 },
  { title: 'title11', dataIndex: 'b', key: 'k', width: 150 },
  { title: 'title12', dataIndex: 'b', key: 'l', width: 100, fixed: 'right' },
];

const originData: RecordType[] = [
  { a: 'aaa', b: 'bbb', c: '内容内容内容内容内容', d: 3, key: '1' },
  { a: 'aaa', b: 'bbb', c: '内容内容内容内容内容', d: 3, key: '2' },
  { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '3' },
  { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '4' },
  { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '5' },
  { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '6' },
  { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '7' },
  { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '8' },
  { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '9' },
];

const Demo = () => {
  const [data, setData] = React.useState(originData);

  return (
    <React.StrictMode>
      <div>
        <h2>Fixed columns and header</h2>
        <Table<RecordType>
          columns={columns}
          scroll={{ x: 1650, y: 300 }}
          data={data}
          style={{ width: 800 }}
        />
        <button
          type="button"
          onClick={() => {
            const newData = [...originData];
            newData[0] = {
              ...newData[0],
              a: 'aaaaaaaaaaaaaaa',
            };
            setData(newData);
          }}
        >
          Resize
        </button>
      </div>
    </React.StrictMode>
  );
};

export default Demo;
