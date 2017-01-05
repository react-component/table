webpackJsonp([12],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(310);


/***/ },

/***/ 310:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* eslint-disable no-console,func-names,react/no-multi-comp */
	var React = __webpack_require__(4);
	var ReactDOM = __webpack_require__(37);
	var Table = __webpack_require__(188);
	__webpack_require__(211);
	
	var ColumnGroup = Table.ColumnGroup,
	    Column = Table.Column;
	
	
	var data = [{ a: '123', key: '1' }, { a: 'cdd', b: 'edd', key: '2' }, { a: '1333', c: 'eee', d: 2, key: '3' }];
	
	ReactDOM.render(React.createElement(
	  'div',
	  null,
	  React.createElement(
	    'h2',
	    null,
	    'JSX table'
	  ),
	  React.createElement(
	    Table,
	    { data: data },
	    React.createElement(
	      ColumnGroup,
	      { title: 'Bazinga' },
	      React.createElement(Column, {
	        title: 'title1',
	        dataIndex: 'a',
	        key: 'a',
	        width: 100
	      }),
	      React.createElement(Column, {
	        id: '123',
	        title: 'title2',
	        dataIndex: 'b',
	        key: 'b',
	        width: 100
	      })
	    ),
	    React.createElement(Column, {
	      title: 'title3',
	      dataIndex: 'c',
	      key: 'c',
	      width: 200
	    }),
	    React.createElement(Column, {
	      title: 'Operations',
	      dataIndex: '',
	      key: 'd',
	      render: function render() {
	        return React.createElement(
	          'a',
	          { href: '#' },
	          'Operations'
	        );
	      }
	    })
	  )
	), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=jsx.js.map