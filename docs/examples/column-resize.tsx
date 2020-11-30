import React from 'react';
import { Resizable } from 'react-resizable';
import Table from 'rc-table';
import '../../assets/index.less';
import 'react-resizable/css/styles.css';
import { ColumnType } from '@/interface';

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

interface RecordType {
  a: string;
  b?: string;
  c?: string;
  d?: number;
  key: string;
}

interface DemoState {
  columns: ColumnType<RecordType>[];
}

class Demo extends React.Component<{}, DemoState> {
  state: DemoState = {
    columns: [
      { title: 'title1', dataIndex: 'a', key: 'a', width: 100 },
      { title: 'title2', dataIndex: 'b', key: 'b', width: 100 },
      { title: 'title3', dataIndex: 'c', key: 'c', width: 200 },
      {
        title: 'Operations',
        dataIndex: '',
        key: 'd',
        render() {
          return <a href="#">Operations</a>;
        },
      },
    ],
  };

  components = {
    header: {
      cell: ResizableTitle,
    },
  };

  data = [
    { a: '123', key: '1' },
    { a: 'cdd', b: 'edd', key: '2' },
    { a: '1333', c: 'eee', d: 2, key: '3' },
  ];

  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  render() {
    const columns = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: (column: ColumnType<RecordType>) =>
        ({
          width: column.width,
          onResize: this.handleResize(index),
        } as any),
    }));

    return (
      <div>
        <h2>Integrate with react-resizable</h2>
        <Table components={this.components} columns={columns} data={this.data} />
      </div>
    );
  }
}

export default Demo;
