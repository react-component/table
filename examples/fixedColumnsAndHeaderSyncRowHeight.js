webpackJsonp([9],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(306);


/***/ },

/***/ 306:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* eslint-disable no-console,func-names,react/no-multi-comp */
	var React = __webpack_require__(4);
	var ReactDOM = __webpack_require__(37);
	var Table = __webpack_require__(188);
	__webpack_require__(211);
	
	var columns = [{ title: 'title1', dataIndex: 'a', key: 'a', width: 100, fixed: 'left' }, { title: 'title2', dataIndex: 'b', key: 'b', width: 100, fixed: 'left' }, { title: 'titletitle3', dataIndex: 'c', key: 'c' }, { title: 'title4', dataIndex: 'c', key: 'd', width: 150 }, { title: 'title5', dataIndex: 'c', key: 'e', width: 150 }, { title: 'title6', dataIndex: 'c', key: 'f', width: 150 }, { title: 'title7', dataIndex: 'c', key: 'g', width: 150 }, { title: 'title8', dataIndex: 'c', key: 'h', width: 150 }, { title: 'title9', dataIndex: 'b', key: 'i', width: 150 }, { title: 'title10', dataIndex: 'b', key: 'j', width: 150 }, { title: 'title11', dataIndex: 'b', key: 'k', width: 150 }, { title: 'title12', dataIndex: 'b', key: 'l', width: 100, fixed: 'right' }];
	
	var data = [{ a: 'aaa', b: 'bbb', c: '内容内容内容内容内容', d: 3, key: '1' }, { a: 'aaa', b: 'bbb', c: '内容内容内容内容内容', d: 3, key: '2' }, { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '3' }, { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '4' }, { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '5' }, { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '6' }, { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '7' }, { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '8' }, { a: 'aaa', c: '内容内容内容内容内容', d: 2, key: '9' }];
	
	ReactDOM.render(React.createElement(
	  'div',
	  null,
	  React.createElement(
	    'h2',
	    null,
	    'Fixed columns and header, resize window for test'
	  ),
	  React.createElement(Table, { columns: columns, scroll: { x: '150%', y: 300 }, data: data })
	), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=fixedColumnsAndHeaderSyncRowHeight.js.map