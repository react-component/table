webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(214);


/***/ },

/***/ 214:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* eslint-disable no-console,func-names,react/no-multi-comp */
	var React = __webpack_require__(4);
	var ReactDOM = __webpack_require__(37);
	var Table = __webpack_require__(188);
	__webpack_require__(211);
	
	var columns = [{ title: 'title1', dataIndex: 'a',
	  className: 'a',
	  key: 'a', width: 100 }, { id: '123', title: 'title2', dataIndex: 'b',
	  className: 'b',
	  key: 'b', width: 100 }, { title: 'title3', dataIndex: 'c',
	  className: 'c',
	  key: 'c', width: 200 }, {
	  title: 'Operations', dataIndex: '',
	  className: 'd',
	  key: 'd', render: function render() {
	    return React.createElement(
	      'a',
	      { href: '#' },
	      'Operations'
	    );
	  }
	}];
	
	var data = [{ a: '123', key: '1' }, { a: 'cdd', b: 'edd', key: '2' }, { a: '1333', c: 'eee', d: 2, key: '3' }];
	
	ReactDOM.render(React.createElement(
	  'div',
	  null,
	  React.createElement(
	    'h2',
	    null,
	    'rowClassName and className'
	  ),
	  React.createElement(Table, {
	    columns: columns,
	    rowClassName: function rowClassName(record, i) {
	      return 'row-' + i;
	    },
	    expandedRowRender: function expandedRowRender(record) {
	      return React.createElement(
	        'p',
	        null,
	        'extra: ',
	        record.a
	      );
	    },
	    expandedRowClassName: function expandedRowClassName(record, i) {
	      return 'ex-row-' + i;
	    },
	    data: data,
	    className: 'table'
	  })
	), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=className.js.map