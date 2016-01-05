/* eslint react/no-multi-comp: 0*/
const React = require('react');
const ReactDOM = require('react-dom');
const Table = require('rc-table');
require('rc-table/assets/index.less');

const MyTable = React.createClass({
  getInitialState: function() {
    const props = this.props;
    return {
      data: props.data,
    };
  },

  getRowKey(record) {
    return record.a;
  },

  handleClick(record, e) {
    e.preventDefault();
    console.log(record.a);
  },

  render: function() {
    const state = this.state;
    const columns = [
      {title: '表头1', dataIndex: 'a', key: 'a', width: 100},
      {title: '表头2', dataIndex: 'b', key: 'b', width: 100},
      {title: '表头3', dataIndex: 'c', key: 'c', width: 200},
      {
        title: '操作', dataIndex: '', key: 'x', render: (_, record) => {
          return <a href="a" onClick={this.handleClick.bind(null, record)}>click {record.a}</a>;
        },
      },
    ];
    return (
      <Table columns={columns}
             expandIconAsCell
             expandOnRowClick
             data={state.data} className="table" rowKey={this.getRowKey}/>
    );
  },
});

const data = [
  {
    a: 'a1',
  },
  {
    a: 'a2',
    b: 'b2',
    children: [
      {
        a: 'a2-1',
        b: 'b2-1',
      },
      {
        a: 'a2-2',
        b: 'b2-2',
      },
    ],
  },
  {
    a: 'a3',
    c: 'c3',
    d: 'd3',
  },
];

ReactDOM.render(
  <div>
    <h2>sub table opens on whole tr click</h2>
    <MyTable data={data} className="table"/>
  </div>,
  document.getElementById('__react-content')
);
