'use strict';

var React = require('react');
var Table = require('rc-table');
require('rc-table/assets/index.css');


var MyTable = React.createClass({
  getInitialState: function () {
    return {
      data: this.props.data
    };
  },

  handleClick(record, e) {
    e.preventDefault();
    console.log(record.a);
  },

  getRowKey(record) {
    return record.a;
  },

  render: function () {
    var state = this.state;
    var columns = [
      {title: '表头1', dataIndex: 'a', key: 'a', width: 100},
      {title: '表头2', dataIndex: 'b', key: 'b', width: 100},
      {title: '表头3', dataIndex: 'c', key: 'c', width: 200},
      {
        title: '操作', dataIndex: '', key: 'x', render: (_, record) => {
        return <a href='a' onClick={this.handleClick.bind(null, record)}>click {record.a}</a>
      }
      }
    ];
    return (
      <Table columns={columns}
             expandIconAsCell={true}
             data={state.data} className="table" rowKey={this.getRowKey}/>
    );
  }
});

var data = [
  {
    a: 'a1'
  },
  {
    a: 'a2',
    b: 'b2',
    children: [
      {
        a: 'a2-1',
        b: 'b2-1'
      },
      {
        a: 'a2-2',
        b: 'b2-2'
      }
    ]
  },
  {
    a: 'a3',
    c: 'c3',
    d: 'd3'
  }
];

React.render(
  <div>
    <h2>sub table</h2>
    <MyTable data={data} className="table"/>
  </div>,
  document.getElementById('__react-content')
);
