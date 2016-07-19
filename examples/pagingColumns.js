webpackJsonp([13],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(294);


/***/ },

/***/ 294:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* eslint-disable no-console,func-names,react/no-multi-comp */
	var React = __webpack_require__(4);
	var ReactDOM = __webpack_require__(38);
	var Table = __webpack_require__(182);
	__webpack_require__(197);
	
	var columns = [{ title: '表头1', dataIndex: 'a', key: 'a' }, { title: '表头2', dataIndex: 'b', key: 'b' }, { title: '表头3', dataIndex: 'b', key: 'c' }, { title: '表头4', dataIndex: 'b', key: 'd' }, { title: '表头5', dataIndex: 'b', key: 'e' }, { title: '表头6', dataIndex: 'b', key: 'f' }, { title: '表头7', dataIndex: 'b', key: 'g' }, { title: '表头8', dataIndex: 'b', key: 'h' }, { title: '表头9', dataIndex: 'b', key: 'i' }, { title: '表头10', dataIndex: 'b', key: 'j' }, { title: '表头11', dataIndex: 'b', key: 'k' }, { title: '表头12', dataIndex: 'b', key: 'l' }];
	
	var data = [{ a: '123', key: '1' }, { a: 'cdd', b: 'edd', key: '2' }, { a: '1333', c: 'eee', d: 2, key: '3' }];
	
	ReactDOM.render(React.createElement(
	  'div',
	  null,
	  React.createElement(
	    'h2',
	    null,
	    'paging columns table'
	  ),
	  React.createElement(Table, {
	    columns: columns,
	    columnsPageRange: [1, 10],
	    columnsPageSize: 4,
	    data: data
	  })
	), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=pagingColumns.js.map