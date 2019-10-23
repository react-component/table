import React from 'react';
import Table from '../src';
import '../assets/index.less';
import { ColumnsType } from '../src/interface';
import { useCheckbox } from './utils/useInput';

interface RecordType {
  a: string;
  b?: string;
  c: string;
  d: number;
  key: string;
}

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

const useColumn = (fixLeft: boolean, fixTitle: boolean, fixRight: boolean, ellipsis: boolean) => {
  const columns: ColumnsType<RecordType> = React.useMemo(
    () => [
      {
        title: 'title1',
        dataIndex: 'a',
        key: 'a',
        width: 80,
        fixed: fixLeft ? 'left' : null,
        ellipsis,
      },
      { title: 'title2', dataIndex: 'b', key: 'b', width: 80, fixed: fixLeft ? 'left' : null },
      {
        title: 'title3',
        fixed: fixLeft && fixTitle ? 'left' : null,
        children: [
          { title: 'title4', dataIndex: 'c', key: 'd', width: 100 },
          { title: 'title5', dataIndex: 'c', key: 'e', width: 100 },
        ],
      },
      { title: 'title6', dataIndex: 'c', key: 'f' },
      { title: 'title7', dataIndex: 'c', key: 'g' },
      { title: 'title8', dataIndex: 'c', key: 'h' },
      { title: 'title9', dataIndex: 'b', key: 'i' },
      { title: 'title10', dataIndex: 'b', key: 'j' },
      { title: 'title11', dataIndex: 'b', key: 'k', width: 100, fixed: fixRight ? 'right' : null },
      { title: 'title12', dataIndex: 'b', key: 'l', width: 80, fixed: fixRight ? 'right' : null },
    ],
    [fixLeft, fixTitle, fixRight, ellipsis],
  );

  return columns;
};

const Demo = () => {
  const [data, setData] = React.useState(originData);
  const [fixLeft, fixLeftProps] = useCheckbox(true);
  const [fixRight, fixRightProps] = useCheckbox(true);
  const [fixTitle3, fixTitle3Props] = useCheckbox(false);
  const [ellipsis, ellipsisProps] = useCheckbox(false);
  const columns = useColumn(fixLeft, fixTitle3, fixRight, ellipsis);

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
              a:
                'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            };
            setData(newData);
          }}
        >
          Resize
        </button>

        <label>
          <input {...fixLeftProps} />
          Fix Left
        </label>
        <label>
          <input {...fixTitle3Props} />
          Fix title3
        </label>
        <label>
          <input {...fixRightProps} />
          Fix Right
        </label>
        <label>
          <input {...ellipsisProps} />
          Ellipsis First Column
        </label>
      </div>
    </React.StrictMode>
  );
};

export default Demo;
