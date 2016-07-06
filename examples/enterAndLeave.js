/* eslint-disable no-console,func-names,react/no-multi-comp */
const React = require('react');
const ReactDOM = require('react-dom');
const Table = require('rc-table');
import Animate from 'rc-animate';
require('rc-table/assets/index.less');

class Demo extends React.Component {
  constructor() {
    super(...arguments);
    this.columns = [
      { title: '表头1', dataIndex: 'a', key: 'a', width: 100 },
      { id: '123', title: '表头2', dataIndex: 'b', key: 'b', width: 100 },
      { title: '表头3', dataIndex: 'c', key: 'c', width: 200 },
      {
        title: '操作', dataIndex: '', key: 'd', render: (e) =>
        <a onClick={this.onDelete.bind(this, e.key)}>册除</a>,
      },
    ];
    this.state = {
      data: [{ a: '123', key: '1' }, { a: 'cdd', b: 'edd', key: '2' }, { a: '1333', c: 'eee', key: '3' }],
    };
  }

  onDelete(key) {
    console.log(key);
    const data = this.state.data.map(item => {
      if (item.key !== key) {
        return item;
      }
    }).filter(item => item);
    this.setState({ data });
  }

  onAdd() {
    const ac = ['b', 'c'];
    const obj = { a: Date.now(), key: Date.now() };
    console.log(Math.round(Math.random() * (ac.length - 1)));
    obj[ac[Math.round(Math.random() * (ac.length - 1))]] = Math.random();
    const data = this.state.data;
    data.unshift(obj);
    this.setState({
      data,
    });
  }

  getRowWrapper(tbody) {
    return (<Animate
      transitionName="move"
      component="tbody"
      {...tbody.props}
    >
      {tbody.props.children}
    </Animate>);
  }

  render() {
    return (<div>
      <h2>simple table</h2>
      <Table columns={this.columns}
        data={this.state.data}
        className="table"
        rowWrapper={this.getRowWrapper.bind(this)}
      />
      <button onClick={this.onAdd.bind(this)}>添加</button>
    </div>);
  }
}
ReactDOM.render(
  <Demo />,
  document.getElementById('__react-content')
);
