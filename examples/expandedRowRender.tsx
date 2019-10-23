import React from 'react';
import Table from '../src';
import '../assets/index.less';

interface RecordType {
  key: React.Key;
  a: string;
  b?: string;
  c?: string;
  d?: number;
}

const tableData = [
  { key: 0, a: '123' },
  { key: 1, a: 'cdd', b: 'edd' },
  { key: 2, a: '1333', c: 'eee', d: 2 },
];

class Demo extends React.Component {
  state = {
    data: tableData,
    expandedRowKeys: [],
    expandRowByClick: false,
  };

  onExpand = (expanded, record) => {
    console.log('onExpand', expanded, record);
  };

  onExpandedRowsChange = (rows: React.Key[]) => {
    this.setState({
      expandedRowKeys: rows,
    });
  };

  onExpandRowByClickChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    this.setState({
      expandRowByClick: e.target.checked,
    });
  };

  columns = [
    { title: 'title 1', dataIndex: 'a', key: 'a', width: 100 },
    { title: 'title 2', dataIndex: 'b', key: 'b', width: 100 },
    { title: 'title 3', dataIndex: 'c', key: 'c', width: 200 },
    { title: 'Operation', dataIndex: '', key: 'x', render: this.renderAction },
  ];

  rowExpandable = (record: RecordType) => record.key !== 1;

  toggleButton() {
    if (this.state.expandedRowKeys.length) {
      const closeAll = () => this.setState({ expandedRowKeys: [] });
      return (
        <button type="button" onClick={closeAll}>
          Close All
        </button>
      );
    }
    const openAll = () => this.setState({ expandedRowKeys: [0, 1, 2] });
    return (
      <button type="button" onClick={openAll}>
        Expand All
      </button>
    );
  }

  remove(index: number) {
    const { data } = this.state;
    data.splice(index, 1);
    this.setState({ data });
  }

  renderAction(o: any, row: RecordType, index: number) {
    return (
      <a href="#" onClick={() => this.remove(index)}>
        Delete
      </a>
    );
  }

  render() {
    const { expandRowByClick, expandedRowKeys, data } = this.state;
    return (
      <div>
        {this.toggleButton()}
        <label>
          <input
            type="checkbox"
            checked={expandRowByClick}
            onChange={this.onExpandRowByClickChange}
          />
          expandRowByClick
        </label>
        <Table<RecordType>
          columns={this.columns}
          expandable={{
            expandRowByClick,
            expandedRowRender: (record, index, indent, expanded) =>
              expanded ? <p>extra: {record.a}</p> : null,
            expandedRowKeys,
            onExpandedRowsChange: this.onExpandedRowsChange,
            onExpand: this.onExpand,
            rowExpandable: this.rowExpandable,
          }}
          data={data}
        />
      </div>
    );
  }
}

export default Demo;
