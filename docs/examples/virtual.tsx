import React from 'react';
import '../../assets/index.less';
import { VirtualTable } from '../../src';
import type { ColumnsType, Reference } from '../../src/interface';

interface RecordType {
  a: string;
  b?: string;
  c?: string;
  d: number;
  indexKey: string;
}

const columns: ColumnsType = [
  // { title: 'title1', dataIndex: 'a', key: 'a', width: 100,},
  // { title: 'title1', dataIndex: 'a', key: 'a', width: 100, },
  { title: 'title1', dataIndex: 'a', key: 'a', width: 100, fixed: 'left' },
  { title: 'title2', dataIndex: 'b', key: 'b', width: 100, fixed: 'left', ellipsis: true },
  {
    title: 'title3',
    dataIndex: 'c',
    key: 'c',
    onCell: (_, index) => {
      if (index % 4 === 0) {
        return {
          rowSpan: 3,
        };
      }

      if (index % 4 === 3) {
        return {
          rowSpan: 1,
          colSpan: 3,
        };
      }

      return {
        rowSpan: 0,
      };
    },
  },
  {
    title: 'title4',
    key: 'd',
    children: [
      // Children columns
      {
        title: 'title4-1',
        dataIndex: 'b',
        onCell: (_, index) => {
          if (index % 4 === 0) {
            return {
              colSpan: 3,
            };
          }

          if (index % 4 === 3) {
            return {
              colSpan: 0,
            };
          }
        },
      },
      {
        title: 'title4-2',
        dataIndex: 'b',
        onCell: (_, index) => {
          if (index % 4 === 0 || index % 4 === 3) {
            return {
              colSpan: 0,
            };
          }
        },
      },
    ],
  },
  {
    title: 'title6',
    dataIndex: 'b',
    key: 'f',
    onCell: (_, index) => {
      if (index % 4 === 0) {
        return {
          rowSpan: 0,
          colSpan: 0,
        };
      }

      if (index % 4 === 1) {
        return {
          rowSpan: 3,
        };
      }

      return {
        rowSpan: 0,
      };
    },
  },
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
    dataIndex: 'bk',
    key: 'g',
  },
  {
    title: 'title8',
    dataIndex: 'b',
    onCell: (_, index) => {
      if (index % 2 === 0) {
        return {
          rowSpan: 2,
          colSpan: 2,
        };
      }

      return {
        rowSpan: 0,
      };
    },
  },
  {
    title: 'title9 i',
    dataIndex: 'b',
    key: 'i',
    onCell: () => ({
      colSpan: 0,
    }),
  },
  { title: 'title10', dataIndex: 'b', key: 'j' },
  {
    title: 'title11',
    dataIndex: 'b',
    key: 'k',
    width: 50,
    fixed: 'right',
    onCell: (_, index) => {
      return {
        rowSpan: index % 2 === 0 ? 2 : 0,
        // colSpan: 2,
      };
    },
  },
  {
    title: 'title12',
    dataIndex: 'b',
    key: 'l',
    width: 100,
    fixed: 'right',
    onCell: () => {
      return {
        // colSpan: 0,
      };
    },
  },
];

export function cleanOnCell(cols: any = []) {
  cols.forEach(col => {
    delete (col as any).onCell;

    cleanOnCell((col as any).children);
  });
}
cleanOnCell(columns);

const data: RecordType[] = new Array(4 * 10000).fill(null).map((_, index) => ({
  a: `a${index}`,
  b: `b${index}`,
  c: `c${index}`,
  d: index,
  bk: <strong>Hello</strong>,
  indexKey: `${index}`,
  // children: [
  //   {
  //     indexKey: `${index}-1`,
  //   },
  //   {
  //     indexKey: `${index}-2`,
  //   },
  // ],
}));

const Demo: React.FC = () => {
  const tableRef = React.useRef<Reference>(null);
  return (
    <div style={{ width: 800, padding: `0 64px` }}>
      <button onClick={() => tableRef.current?.scrollTo({ top: 9999999999999 })}>
        Scroll To End
      </button>
      <button onClick={() => tableRef.current?.scrollTo({ top: 0 })}>Scroll To Start</button>
      <button onClick={() => tableRef.current?.scrollTo({ index: data.length - 1 })}>
        Scroll To Key
      </button>
      <button onClick={() => tableRef.current?.scrollTo({ index: 10, offset: -10 })}>
        Scroll To Index 10 + Offset -10
      </button>
      <button onClick={() => tableRef.current?.scrollTo({ key: '50', offset: -10 })}>
        Scroll To Key 50 + Offset -10
      </button>
      <VirtualTable
        style={{ marginTop: 16 }}
        ref={tableRef}
        columns={columns}
        // expandedRowRender={({ b, c }) => b || c}
        scroll={{ x: 1300, y: 200 }}
        data={data}
        // data={[]}
        rowKey="indexKey"
        expandable={{
          expandedRowRender: () => 2333,
          columnWidth: 60,
          expandedRowClassName: () => 'good-one',
        }}
        // onRow={() => ({ className: 'rowed' })}
        rowClassName="nice-try"
        getContainerWidth={(ele, width) => {
          // Minus border
          const { borderInlineStartWidth } = getComputedStyle(ele.querySelector('.rc-table-tbody'));
          const mergedWidth = width - parseInt(borderInlineStartWidth, 10);
          return mergedWidth;
        }}
      />
    </div>
  );
};

export default Demo;
