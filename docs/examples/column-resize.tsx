import React, { useMemo, useState } from 'react';
import type { ColumnType, ColumnsType } from 'rc-table';
import Table from 'rc-table';
import { Resizable } from 'react-resizable';
import '../../assets/index.less';
import 'react-resizable/css/styles.css';
const ResizableTitle = props => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }
  return (
    <Resizable width={width} height={0} onResize={onResize}>
      <th {...restProps} />
    </Resizable>
  );
};

const data = [
  { a: '123', key: '1' },
  { a: 'cdd', b: 'edd', key: '2' },
  { a: '1333', c: 'eee', d: 2, key: '3' },
] as const;

type RecordType = (typeof data)[number];

const Demo = () => {
  const [columns, setColumns] = useState<ColumnsType<RecordType>>([
    { title: 'title1', dataIndex: 'a', key: 'a', width: 100 },
    { title: 'title2', dataIndex: 'b', key: 'b', width: 100 },
    { title: 'title3', dataIndex: 'c', key: 'c', width: 200 },
    {
      title: 'Operations',
      dataIndex: 'd',
      key: 'd',
      render() {
        return <a href="#">Operations</a>;
      },
    },
  ]);
  const handleResize = useMemo(() => {
    return (index: number) => {
      return (_: React.MouseEvent<HTMLTableCellElement>, { size }: { size: { width: number } }) => {
        setColumns(prevColumns =>
          prevColumns.map((col, i) => (i === index ? { ...col, width: size.width } : col)),
        );
      };
    };
  }, []);
  const columnsWithResizable = useMemo(() => {
    return columns.map((col, index) => ({
      ...col,
      onHeaderCell: (column: ColumnType<RecordType>) => ({
        width: column.width,
        onResize: handleResize(index),
      }),
    }));
  }, [columns, handleResize]);

  const tableProps = useMemo(() => {
    return {
      components: { header: { cell: ResizableTitle } },
      columns: columnsWithResizable,
      data,
    };
  }, [columnsWithResizable]);
  return <Table {...tableProps} />;
};

export default Demo;
