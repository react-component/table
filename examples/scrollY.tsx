import React from 'react';
import Table from '../src';
import '../assets/index.less';
import DropDown from 'rc-dropdown';
import Menu, { Item, Divider } from 'rc-menu';
import 'rc-dropdown/assets/index.css';

const dataSource = [];
for (let i = 0; i < 10; i += 1) {
  dataSource.push({
    key: i,
    a: `a${i}`,
    b: `b${i}`,
    c: `c${i}`,
  });
}

class Demo extends React.Component {
  state = {
    showBody: true,
    visible: false,
    data: dataSource,
  };

  filters = [];

  handleVisibleChange = visible => {
    this.setState({ visible });
  };

  toggleBody = () => {
    this.setState(({ showBody }) => ({ showBody: !showBody }));
  };

  handleSelect = selected => {
    this.filters.push(selected.key);
  };

  handleDeselect = unSelect => {
    const index = this.filters.indexOf(unSelect.key);
    if (index !== -1) {
      this.filters.splice(index, 1);
    }
  };

  confirmFilter = () => {
    this.setState(prev  => {
      const newD = dataSource.filter(item => this.filters.includes(item.a) || !this.filters.length)

      return {
        ...prev,
        visible: false,
        data: newD
      }
    })
  };


  render() {
    const { showBody, data } = this.state;
    const menu = (
      <Menu
        style={{ width: 200 }}
        multiple
        onSelect={this.handleSelect}
        onDeselect={this.handleDeselect}
      >
        <Item key="a0">a0</Item>
        <Item key="a1">a1</Item>
        <Item key="a2">a2</Item>
        <Divider />
        <Item disabled>
          <button
            type="button"
            style={{
              cursor: 'pointer',
              color: '#000',
              pointerEvents: 'visible',
            }}
            onClick={this.confirmFilter}
          >
            确定
          </button>
        </Item>
      </Menu>
    );


    const columns = [
      { title: (
        <div>
          title1
          <DropDown
            trigger={['click']}
            onVisibleChange={this.handleVisibleChange}
            visible={this.state.visible}
            overlay={menu}
          >
            <a href="#">filter</a>
          </DropDown>
        </div>
      ), key: 'a', dataIndex: 'a', width: 100  },
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
