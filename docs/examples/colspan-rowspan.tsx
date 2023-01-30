import React from 'react';
import Table from 'rc-table';
import '../../assets/index.less';
import { ColumnsType, RenderedCell } from '@/interface';

interface RecordType {
  a?: string;
  b?: string;
  c?: string;
  d?: string;
  e?: string;
  key?: string;
}

const columns: ColumnsType<RecordType> = [
  {
    title: '手机号',
    dataIndex: 'a',
    colSpan: 2,
    width: 100,
    key: 'a',
    render(o, row, index) {
      return index === 0 ? <a href="#">{o}</a> : o;
    },
    onCell: (_, index) => {
      const props: React.TdHTMLAttributes<HTMLTableCellElement> = {};

      // 第5行合并两列
      if (index === 4) {
        props.colSpan = 2;
      }

      if (index === 5) {
        props.colSpan = 6;
      }

      return props;
    },
  },
  {
    title: '电话',
    dataIndex: 'b',
    colSpan: 0,
    width: 100,
    key: 'b',
    onCell(_, index) {
      // 列合并掉的表格设置colSpan=0，不会去渲染
      if (index === 4 || index === 5) {
        return { colSpan: 0 };
      }
      return {};
    },
  },
  {
    title: 'Name',
    dataIndex: 'c',
    width: 100,
    key: 'c',
    onCell(_, index) {
      if (index === 5) {
        return { colSpan: 0 };
      }
      return {};
    },
  },
  {
    title: 'Address',
    dataIndex: 'd',
    width: 200,
    key: 'd',
    onCell(_, index) {
      const props: React.TdHTMLAttributes<HTMLTableCellElement> = {};
      if (index === 0) {
        props.rowSpan = 2;
      }
      if (index === 1 || index === 5) {
        props.rowSpan = 0;
      }

      if (index === 5) {
        props.colSpan = 0;
      }
      return props;
    },
  },
  {
    title: 'Gender',
    dataIndex: 'e',
    width: 200,
    key: 'e',
    onCell(_, index) {
      if (index === 5) {
        return { colSpan: 0 };
      }
      return {};
    },
  },
  {
    title: 'Operations',
    dataIndex: '',
    key: 'f',
    render() {
      return <a href="#">Operations</a>;
    },
    onCell(_, index) {
      if (index === 5) {
        return {
          colSpan: 0,
        };
      }
      return {};
    },
  },
];

const data: RecordType[] = [
  { a: '13812340987', b: '0571-12345678', c: '张三', d: '文一西路', e: 'Male', key: '1' },
  { a: '13812340986', b: '0571-98787658', c: '张夫人', d: '文一西路', e: 'Female', key: '2' },
  { a: '13812988888', b: '0571-099877', c: '李四', d: '文二西路', e: 'Male', key: '3' },
  { a: '1381200008888', b: '0571-099877', c: '王五', d: '文二西路', e: 'Male', key: '4' },
  { a: '0571-88888110', c: '李警官', d: '武林门', e: 'Male', key: '5' },
  { a: '资料统计完毕于xxxx年xxx月xxx日', key: '6' },
];

const Demo = () => (
  <div>
    <h2>colSpan & rowSpan</h2>
    <Table columns={columns} data={data} className="table" />
  </div>
);

export default Demo;
