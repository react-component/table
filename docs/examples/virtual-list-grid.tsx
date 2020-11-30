import React from 'react';
import classNames from 'classnames';
import { VariableSizeGrid as Grid } from 'react-window';
import Table from 'rc-table';
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
const Demo = () => {
  const gridRef = React.useRef<any>();
  const [connectObject] = React.useState<any>(() => {
    const obj = {};
    Object.defineProperty(obj, 'scrollLeft', {
      get: () => null,
      set: (scrollLeft: number) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({ scrollLeft });
        }
      },
    });

    return obj;
  });

  React.useEffect(() => {
    gridRef.current.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: false,
    });
  }, []);

  const renderVirtualList = (rawData: object[], { scrollbarSize, ref, onScroll }: any) => {
    ref.current = connectObject;

    return (
      <Grid
        ref={gridRef}
        className="virtual-grid"
        columnCount={columns.length}
        columnWidth={index => {
          const { width } = columns[index];
          return index === columns.length - 1 ? width - scrollbarSize - 1 : width;
        }}
        height={300}
        rowCount={rawData.length}
        rowHeight={() => 50}
        width={301}
        onScroll={({ scrollLeft }) => {
          onScroll({ scrollLeft });
        }}
      >
        {({ columnIndex, rowIndex, style }) => (
          <div
            className={classNames('virtual-cell', {
              'virtual-cell-last': columnIndex === columns.length - 1,
            })}
            style={style}
          >
            r{rowIndex}, c{columnIndex}
          </div>
        )}
      </Grid>
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
