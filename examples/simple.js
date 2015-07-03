webpackJsonp([4],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(75);


/***/ },

/***/ 75:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(2);
	var Table = __webpack_require__(3);
	__webpack_require__(6);
	
	var columns = [{ title: '表头1', dataIndex: 'a', width: 100 }, { id: '123', title: '表头2', dataIndex: 'b', width: 100 }, { title: '表头3', dataIndex: 'c', width: 200 }, {
	  title: '操作', dataIndex: '', render: function render() {
	    return React.createElement(
	      'a',
	      { href: '#' },
	      '操作'
	    );
	  }
	}];
	
	var data = [{ a: '123' }, { a: 'cdd', b: 'edd' }, { a: '1333', c: 'eee', d: 2 }];
	
	var table = React.render(React.createElement(
	  'div',
	  null,
	  React.createElement(
	    'h2',
	    null,
	    'simple table'
	  ),
	  React.createElement(Table, { columns: columns,
	    data: data,
	    className: 'table' })
	), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=simple.js.map