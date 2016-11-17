webpackJsonp([13],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(260);


/***/ },

/***/ 260:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(4);
	var ReactDOM = __webpack_require__(39);
	var Table = __webpack_require__(182);
	__webpack_require__(202);
	
	var columns = [{ title: 'First Name', dataIndex: 'names.first', key: 'a', width: 100 }, { title: 'Last Name', dataIndex: 'names.last', key: 'b', width: 100 }, { title: 'Age', dataIndex: 'age', key: 'c', width: 100 }];
	
	var data = [{
	  age: '23',
	  names: {
	    first: 'John',
	    last: 'Doe'
	  },
	  key: '1'
	}, {
	  age: '36',
	  names: {
	    first: 'Terry',
	    last: 'Garner'
	  },
	  key: '2'
	}, {
	  age: '52',
	  names: {
	    first: 'Thomas',
	    last: 'Goodwin'
	  },
	  key: '3'
	}];
	
	ReactDOM.render(React.createElement(
	  'div',
	  null,
	  React.createElement(
	    'h2',
	    null,
	    'Nested data table'
	  ),
	  React.createElement(Table, {
	    columns: columns,
	    data: data,
	    className: 'table'
	  })
	), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=nested.js.map