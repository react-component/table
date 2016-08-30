webpackJsonp([14],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(259);


/***/ },

/***/ 259:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* eslint-disable no-console,func-names,react/no-multi-comp */
	var React = __webpack_require__(4);
	var ReactDOM = __webpack_require__(40);
	var Table = __webpack_require__(185);
	__webpack_require__(202);
	
	var onRowClick = function onRowClick(record, index) {
	  console.log('click nth(' + index + ') element of parent, record.name: ' + record.name);
	};
	
	var onOperationClick = function onOperationClick(text, record) {
	  console.log('click ' + text + ', record.name is ' + record.name);
	};
	
	var columns = [{
	  title: '姓名',
	  dataIndex: 'name',
	  key: 'name',
	  width: 400
	}, {
	  title: '年龄',
	  dataIndex: 'age',
	  key: 'age',
	  width: 100,
	  render: function render(text, record) {
	    return React.createElement(
	      'a',
	      { href: '#', onClick: onOperationClick.bind(null, text, record) },
	      'Alert: ',
	      text,
	      ', click will pop to row click'
	    );
	  }
	}, {
	  title: '住址',
	  dataIndex: 'address',
	  key: 'address',
	  width: 200
	}];
	
	var data = [{
	  key: 1,
	  name: 'a',
	  age: 32,
	  address: '我是a',
	  children: [{
	    key: 11,
	    name: 'aa',
	    age: 33,
	    address: '我是aa'
	  }, {
	    key: 12,
	    name: 'ab',
	    age: 33,
	    address: '我是ab',
	    children: [{
	      key: 121,
	      name: 'aba',
	      age: 33,
	      address: '我是aba'
	    }]
	  }, {
	    key: 13,
	    name: 'ac',
	    age: 33,
	    address: '我是ac',
	    children: [{
	      key: 131,
	      name: 'aca',
	      age: 33,
	      address: '我是aca',
	      children: [{
	        key: 1311,
	        name: 'acaa',
	        age: 33,
	        address: '我是acaa'
	      }, {
	        key: 1312,
	        name: 'acab',
	        age: 33,
	        address: '我是acab'
	      }]
	    }]
	  }]
	}, {
	  key: 2,
	  name: 'b',
	  age: 32,
	  address: '我是b'
	}];
	
	ReactDOM.render(React.createElement(Table, { columns: columns, data: data, onRowClick: onRowClick }), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=rowClick.js.map