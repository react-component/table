webpackJsonp([1],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(213);


/***/ },

/***/ 213:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* eslint-disable no-console,func-names,react/no-multi-comp */
	var React = __webpack_require__(4);
	var ReactDOM = __webpack_require__(37);
	var Table = __webpack_require__(188);
	__webpack_require__(211);
	
	var columns = [{
	  title: 'Name',
	  dataIndex: 'name',
	  key: 'name',
	  width: 400
	}, {
	  title: 'Age',
	  dataIndex: 'age',
	  key: 'age',
	  width: 100
	}, {
	  title: 'Address',
	  dataIndex: 'address',
	  key: 'address',
	  width: 200
	}, {
	  title: 'Operations',
	  dataIndex: 'operation',
	  key: 'x',
	  width: 150
	}];
	
	var data = [{
	  key: 1,
	  name: 'a',
	  age: 32,
	  address: 'I am a',
	  children: [{
	    key: 11,
	    name: 'aa',
	    age: 33,
	    address: 'I am aa'
	  }, {
	    key: 12,
	    name: 'ab',
	    age: 33,
	    address: 'I am ab',
	    children: [{
	      key: 121,
	      name: 'aba',
	      age: 33,
	      address: 'I am aba'
	    }]
	  }, {
	    key: 13,
	    name: 'ac',
	    age: 33,
	    address: 'I am ac',
	    children: [{
	      key: 131,
	      name: 'aca',
	      age: 33,
	      address: 'I am aca',
	      children: [{
	        key: 1311,
	        name: 'acaa',
	        age: 33,
	        address: 'I am acaa'
	      }, {
	        key: 1312,
	        name: 'acab',
	        age: 33,
	        address: 'I am acab'
	      }]
	    }]
	  }]
	}, {
	  key: 2,
	  name: 'b',
	  age: 32,
	  address: 'I am b'
	}];
	
	function onExpand(expanded, record) {
	  console.log('onExpand', expanded, record);
	}
	
	ReactDOM.render(React.createElement(Table, { defaultExpandAllRows: true, columns: columns, data: data, indentSize: 30, onExpand: onExpand }), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=childrenIndent.js.map