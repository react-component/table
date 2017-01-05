webpackJsonp([13],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(311);


/***/ },

/***/ 311:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* eslint-disable no-console,func-names,react/no-multi-comp */
	var React = __webpack_require__(4);
	var ReactDOM = __webpack_require__(37);
	var Table = __webpack_require__(188);
	__webpack_require__(211);
	
	var CheckBox = React.createClass({
	  displayName: 'CheckBox',
	  render: function render() {
	    var props = this.props;
	    return React.createElement(
	      'label',
	      null,
	      React.createElement('input', { type: 'checkbox' }),
	      props.id
	    );
	  }
	});
	
	var MyTable = React.createClass({
	  displayName: 'MyTable',
	  getInitialState: function getInitialState() {
	    var props = this.props;
	    return {
	      data: props.data
	    };
	  },
	  remove: function remove(index) {
	    var rows = this.state.data;
	    rows.splice(index, 1);
	    this.setState({
	      data: rows
	    });
	  },
	  handleClick: function handleClick(index) {
	    var self = this;
	    return function () {
	      self.remove(index);
	    };
	  },
	  checkbox: function checkbox(a) {
	    return React.createElement(CheckBox, { id: a });
	  },
	  renderAction: function renderAction(o, row, index) {
	    return React.createElement(
	      'a',
	      { href: '#', onClick: this.handleClick(index) },
	      'Delete'
	    );
	  },
	  render: function render() {
	    var state = this.state;
	    var columns = [{ title: 'title1', dataIndex: 'a', key: 'a', width: 100, render: this.checkbox }, { title: 'title2', dataIndex: 'b', key: 'b', width: 100 }, { title: 'title3', dataIndex: 'c', key: 'c', width: 200 }, { title: 'Operations', dataIndex: '', key: 'x', render: this.renderAction }];
	    return React.createElement(Table, { columns: columns, data: state.data, className: 'table', rowKey: function rowKey(record) {
	        return record.a;
	      } });
	  }
	});
	
	var data = [{ a: '123' }, { a: 'cdd', b: 'edd' }, { a: '1333', c: 'eee', d: 2 }];
	
	ReactDOM.render(React.createElement(
	  'div',
	  null,
	  React.createElement(
	    'h2',
	    null,
	    'specify key'
	  ),
	  React.createElement(MyTable, { data: data })
	), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=key.js.map