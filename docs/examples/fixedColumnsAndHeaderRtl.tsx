import React from 'react';
import Table from 'rc-table';
import '../../assets/index.less';
import { ColumnsType } from '@/interface';
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

const longTextData: RecordType[] = [...originData];
longTextData[0] = {
  ...longTextData[0],
  a: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
};

const useColumn = (
  fixLeft: boolean,
  fixTitle: boolean,
  fixRight: boolean,
  ellipsis: boolean,
  percentage: boolean,
) => {
  const columns: ColumnsType<RecordType> = React.useMemo(
    () => [
      {
        title: 'title1',
        dataIndex: 'a',
        key: 'a',
        width: percentage ? '10%' : 80,
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
    [fixLeft, fixTitle, fixRight, ellipsis, percentage],
  );

  return columns;
};

const Demo = () => {
  const [autoWidth, autoWidthProps] = useCheckbox(false);
  const [isRtl, isRtlProps] = useCheckbox(true);
  const [longText, longTextProps] = useCheckbox(false);
  const [fixHeader, fixHeaderProps] = useCheckbox(true);
  const [fixLeft, fixLeftProps] = useCheckbox(true);
  const [fixRight, fixRightProps] = useCheckbox(true);
  const [fixTitle3, fixTitle3Props] = useCheckbox(false);
  const [ellipsis, ellipsisProps] = useCheckbox(false);
  const [percentage, percentageProps] = useCheckbox(false);
  const [empty, emptyProps] = useCheckbox(false);
  const columns = useColumn(fixLeft, fixTitle3, fixRight, ellipsis, percentage);

  let mergedData: RecordType[];
  if (empty) {
    mergedData = null;
  } else if (longText) {
    mergedData = longTextData;
  } else {
    mergedData = originData;
  }

  return (
    <React.StrictMode>
      <div>
        <h2>Fixed columns and header in RTL direction</h2>

        <label>
          <input {...isRtlProps} />
          IsRtl
        </label>
        <label>
          <input {...autoWidthProps} />
          Auto Width
        </label>
        <label>
          <input {...longTextProps} />
          Long Text
        </label>
        <label>
          <input {...fixHeaderProps} />
          Fix Header
        </label>
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
        <label>
          <input {...percentageProps} />
          Percentage Width
        </label>
        <label>
          <input {...emptyProps} />
          Empty
        </label>

        <Table<RecordType>
          columns={columns}
          scroll={{ x: 1650, y: fixHeader ? 300 : null }}
          data={mergedData}
          style={{ width: autoWidth ? null : 800 }}
          direction={isRtl ? 'rtl' : 'ltr'}
        />
      </div>
    </React.StrictMode>
  );
};

export default Demo;
