webpackJsonp([1],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(6);


/***/ },

/***/ 6:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(2);
	var Table = __webpack_require__(3);
	var pkg = __webpack_require__(5);
	
	var columns = [{ title: '表头1', dataIndex: 'a', width: 100 }, { id: '123', title: '表头2', dataIndex: 'b', width: 100 }, { title: '表头3', dataIndex: 'c', width: 200 }, {
	  title: '操作', dataIndex: '', renderer: function renderer() {
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
	    'h1',
	    null,
	    pkg.name,
	    '@',
	    pkg.version
	  ),
	  React.createElement('link', { rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css' }),
	  React.createElement(Table, { columns: columns, data: data, className: 'table' })
	), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=simple.js.map