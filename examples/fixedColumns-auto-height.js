webpackJsonp([7],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(304);


/***/ },

/***/ 304:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* eslint-disable no-console,func-names,react/no-multi-comp */
	var React = __webpack_require__(4);
	var ReactDOM = __webpack_require__(37);
	var Table = __webpack_require__(188);
	__webpack_require__(211);
	
	var columns = [{ title: 'title1', dataIndex: 'a', key: 'a', width: 100, fixed: 'left' }, { title: 'title2', dataIndex: 'b', key: 'b', width: 100, fixed: 'left' }, { title: 'title3', dataIndex: 'c', key: 'c' }, { title: 'title4', dataIndex: 'b', key: 'd' }, { title: 'title5', dataIndex: 'b', key: 'e' }, { title: 'title6', dataIndex: 'b', key: 'f',
	  render: function render() {
	    return React.createElement(
	      'div',
	      { style: { height: '40px', lineHeight: '40px' } },
	      '\u6211\u5F88\u9AD8'
	    );
	  } }, { title: 'title7', dataIndex: 'b', key: 'g' }, { title: 'title8', dataIndex: 'b', key: 'h' }, { title: 'title9', dataIndex: 'b', key: 'i' }, { title: 'title10', dataIndex: 'b', key: 'j' }, { title: 'title11', dataIndex: 'b', key: 'k' }, { title: 'title12', dataIndex: 'b', key: 'l', width: 100, fixed: 'right' }];
	
	var data = [{ a: '123', b: 'xxxxxxxx', d: 3, key: '1' }, { a: 'cdd', b: 'edd12221', d: 3, key: '2' }, { a: '133', c: 'edd12221', d: 2, key: '3' }, { a: '133', c: 'edd12221', d: 2, key: '4' }, { a: '133', c: 'edd12221', d: 2, key: '5' }, { a: '133', c: 'edd12221', d: 2, key: '6' }, { a: '133', c: 'edd12221', d: 2, key: '7' }, { a: '133', c: 'edd12221', d: 2, key: '8' }, { a: '133', c: 'edd12221', d: 2, key: '9' }];
	
	ReactDOM.render(React.createElement(
	  'div',
	  { style: { width: 800 } },
	  React.createElement(
	    'h2',
	    null,
	    'Fixed columns'
	  ),
	  React.createElement(Table, {
	    columns: columns,
	    expandedRowRender: function expandedRowRender(record) {
	      return record.title;
	    },
	    expandIconAsCell: true,
	    scroll: { x: 1200 },
	    data: data
	  })
	), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=fixedColumns-auto-height.js.map