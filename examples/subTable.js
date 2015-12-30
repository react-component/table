webpackJsonp([8],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(219);


/***/ },

/***/ 219:
/***/ function(module, exports, __webpack_require__) {

	/* eslint react/no-multi-comp: 0*/
	'use strict';
	
	var React = __webpack_require__(2);
	var ReactDOM = __webpack_require__(159);
	var Table = __webpack_require__(160);
	__webpack_require__(164);
	
	var MyTable = React.createClass({
	  displayName: 'MyTable',
	
	  getInitialState: function getInitialState() {
	    var props = this.props;
	    return {
	      data: props.data
	    };
	  },
	
	  getRowKey: function getRowKey(record) {
	    return record.a;
	  },
	
	  handleClick: function handleClick(record, e) {
	    e.preventDefault();
	    console.log(record.a);
	  },
	
	  render: function render() {
	    var _this = this;
	
	    var state = this.state;
	    var columns = [{ title: '表头1', dataIndex: 'a', key: 'a', width: 100 }, { title: '表头2', dataIndex: 'b', key: 'b', width: 100 }, { title: '表头3', dataIndex: 'c', key: 'c', width: 200 }, {
	      title: '操作', dataIndex: '', key: 'x', render: function render(_, record) {
	        return React.createElement(
	          'a',
	          { href: 'a', onClick: _this.handleClick.bind(null, record) },
	          'click ',
	          record.a
	        );
	      }
	    }];
	    return React.createElement(Table, { columns: columns,
	      expandIconAsCell: true,
	      data: state.data, className: 'table', rowKey: this.getRowKey });
	  }
	});
	
	var data = [{
	  a: 'a1'
	}, {
	  a: 'a2',
	  b: 'b2',
	  children: [{
	    a: 'a2-1',
	    b: 'b2-1'
	  }, {
	    a: 'a2-2',
	    b: 'b2-2'
	  }]
	}, {
	  a: 'a3',
	  c: 'c3',
	  d: 'd3'
	}];
	
	ReactDOM.render(React.createElement(
	  'div',
	  null,
	  React.createElement(
	    'h2',
	    null,
	    'sub table'
	  ),
	  React.createElement(MyTable, { data: data, className: 'table' })
	), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=subTable.js.map