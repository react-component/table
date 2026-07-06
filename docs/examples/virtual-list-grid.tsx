import React from 'react';
import { clsx } from 'clsx';
import { Grid, type CellComponentProps, type GridImperativeAPI } from 'react-window';
import Table from '@rc-component/table';
import '../../assets/index.less';
import './virtual-list.less';

const columns = [
  { title: 'A', dataIndex: 'a', width: 150 },
  { title: 'B', dataIndex: 'b', width: 300 },
  { title: 'C', dataIndex: 'c', width: 200 },
  { title: 'D', dataIndex: 'd', width: 100 },
];

const data = [];
for (let i = 0; i < 100000; i += 1) {
  data.push({
    key: i,
    a: `a${i}`,
    b: `b${i}`,
    c: `c${i}`,
    d: `d${i}`,
  });
}
const Cell = ({ ariaAttributes, columnIndex, rowIndex, style }: CellComponentProps) => (
  <div
    {...ariaAttributes}
    className={clsx('virtual-cell', {
      'virtual-cell-last': columnIndex === columns.length - 1,
    })}
    style={style}
  >
    r{rowIndex}, c{columnIndex}
  </div>
);
const Demo = () => {
  const gridRef = React.useRef<GridImperativeAPI>(null);
  const [connectObject] = React.useState<any>(() => {
    const obj = {};
    Object.defineProperty(obj, 'scrollLeft', {
      get: () => {
        return gridRef.current?.element?.scrollLeft ?? null;
      },
      set: (scrollLeft: number) => {
        gridRef.current?.element?.scrollTo({ left: scrollLeft });
      },
    });

    return obj;
  });

  const renderVirtualList = (rawData: object[], { scrollbarSize, ref, onScroll }: any) => {
    ref.current = connectObject;

    return (
      <Grid
        gridRef={gridRef}
        className="virtual-grid"
        cellComponent={Cell}
        cellProps={{}}
        columnCount={columns.length}
        columnWidth={index => {
          const { width } = columns[index];
          return index === columns.length - 1 ? width - scrollbarSize - 1 : width;
        }}
        rowCount={rawData.length}
        rowHeight={50}
        style={{ height: 300, width: 301 }}
        onScroll={event => {
          onScroll({ scrollLeft: event.currentTarget.scrollLeft });
        }}
      />
    );
  };

  return (
    <Table
      style={{ width: 301 }}
      tableLayout="fixed"
      columns={columns}
      data={data}
      scroll={{ y: 300, x: 300 }}
      components={{
        body: renderVirtualList,
      }}
    />
  );
};

export default Demo;
