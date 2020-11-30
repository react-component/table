import React from 'react';
import Table from 'rc-table';
import '../../assets/index.less';

const data = [];
for (let i = 0; i < 10; i += 1) {
  data.push({
    key: i,
    a: `a${i}`,
    b: `b${i}`,
    c: `c${i}`,
  });
}

class Demo extends React.Component {
  state = {
    showBody: true,
  };

  toggleBody = () => {
    this.setState(({ showBody }) => ({ showBody: !showBody }));
  };

  render() {
    const { showBody } = this.state;
    const columns = [
      { title: 'title1', key: 'a', dataIndex: 'a', width: 100 },
      { id: '123', title: 'title2', dataIndex: 'b', key: 'b', width: 100 },
      { title: 'title3', key: 'c', dataIndex: 'c', width: 200 },
      {
        title: (
          <a onClick={this.toggleBody} href="#">
            {this.state.showBody ? '隐藏' : '显示'}体
          </a>
        ),
        key: 'x',
        width: 200,
        render() {
          return <a href="#">Operations</a>;
        },
      },
    ];
    return (
      <Table
        columns={columns}
        data={data}
        scroll={{ y: 300 }}
        rowKey={record => record.key}
        bodyStyle={{
          display: showBody ? '' : 'none',
        }}
      />
    );
  }
}

const Test = () => (
  <div>
    <h2>scroll body table</h2>
    <Demo />
  </div>
);

export default Test;
