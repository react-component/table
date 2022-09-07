/* eslint-disable no-console,func-names,react/no-multi-comp */
import Table from 'rc-table';
import React from 'react';
import '../../assets/index.less';

interface RecordType {
  a?: string;
  b?: string;
  c?: string;
}

const data = [
  { a: '123', key: '1' },
  { a: 'cdd', b: 'edd', key: '2' },
  { a: '1333', c: 'eee', d: 2, key: '3' },
];

class Demo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
    };

    this.columns = [
      {
        title: 'title1',
        dataIndex: 'a',
        render: this.renderColumn,
      },
    ];
  }

  renderColumn = () => {
    return this.state.count;
  };

  render() {
    return (
      <>
        <button
          onClick={() => {
            this.setState({
              count: this.state.count + 1,
            });
          }}
        >
          Click {this.state.count} times
        </button>
        <Table<RecordType> columns={this.columns} data={data} />
      </>
    );
  }
}

export default Demo;
/* eslint-enable */
