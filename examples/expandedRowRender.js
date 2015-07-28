webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(62);


/***/ },

/***/ 62:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(2);
	var Table = __webpack_require__(3);
	__webpack_require__(7);
	
	var CheckBox = React.createClass({
	  displayName: 'CheckBox',
	
	  render: function render() {
	    return React.createElement(
	      'label',
	      null,
	      React.createElement('input', { type: "checkbox" }),
	      this.props.id
	    );
	  }
	});
	
	var MyTable = React.createClass({
	  displayName: 'MyTable',
	
	  getInitialState: function getInitialState() {
	    return {
	      data: this.props.data
	    };
	  },
	
	  handleClick: function handleClick(index) {
	    var self = this;
	    return function () {
	      self.remove(index);
	    };
	  },
	
	  remove: function remove(index) {
	    var rows = this.state.data;
	    rows.splice(index, 1);
	    this.setState({
	      data: rows
	    });
	  },
	
	  renderAction: function renderAction(o, row, index) {
	    return React.createElement(
	      'a',
	      { href: "#", onClick: this.handleClick(index) },
	      '删除'
	    );
	  },
	
	  getRowKey: function getRowKey(record) {
	    return record.a;
	  },
	
	  render: function render() {
	    var state = this.state;
	    var columns = [{ title: '表头1', dataIndex: 'a', key: 'a', width: 100, render: this.checkbox }, { title: '表头2', dataIndex: 'b', key: 'b', width: 100 }, { title: '表头3', dataIndex: 'c', key: 'c', width: 200 }, { title: '操作', dataIndex: '', key: 'x', render: this.renderAction }];
	    return React.createElement(Table, { columns: columns,
	      expandedRowRender: expandedRowRender,
	      data: state.data, className: "table", rowKey: this.getRowKey });
	  },
	
	  checkbox: function checkbox(a) {
	    return React.createElement(CheckBox, { id: a });
	  }
	});
	
	var data = [{ a: '123' }, { a: 'cdd', b: 'edd' }, { a: '1333', c: 'eee', d: 2 }];
	
	function expandedRowRender(record) {
	  return React.createElement(
	    'p',
	    null,
	    'extra: ',
	    record.a
	  );
	}
	
	React.render(React.createElement(
	  'div',
	  null,
	  React.createElement(
	    'h2',
	    null,
	    'expandedRowRender'
	  ),
	  React.createElement(MyTable, { data: data,
	
	    className: "table" })
	), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=expandedRowRender.js.map