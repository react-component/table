webpackJsonp([15],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(262);


/***/ },

/***/ 262:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* eslint-disable no-console,func-names,react/no-multi-comp */
	var React = __webpack_require__(4);
	var ReactDOM = __webpack_require__(40);
	var Table = __webpack_require__(185);
	__webpack_require__(203);
	
	var onRowClick = function onRowClick(record, index, event) {
	  console.log('Click nth(' + index + ') element of parent, record.name: ' + record.name);
	  // See https://facebook.github.io/react/docs/events.html for original click event details.
	  if (event.shiftKey) {
	    console.log('Shift + mouse click triggered.');
	  }
	};
	
	var onRowDoubleClick = function onRowDoubleClick(record, index) {
	  console.log('Double click nth(' + index + ') element of parent, record.name: ' + record.name);
	};
	
	var onOperationClick = function onOperationClick(text, record, event) {
	  event.preventDefault();
	  event.stopPropagation();
	  console.log('Click Cell ' + text + ', record.name is ' + record.name);
	};
	
	var columns = [{
	  title: 'Name',
	  dataIndex: 'name',
	  key: 'name',
	  width: 400
	}, {
	  title: 'Age',
	  dataIndex: 'age',
	  key: 'age',
	  width: 100,
	  render: function render(text, record) {
	    return React.createElement(
	      'a',
	      { href: '#', onClick: function onClick(e) {
	          return onOperationClick(text, record, e);
	        } },
	      'Alert: ',
	      text,
	      ', click will pop to row click'
	    );
	  }
	}, {
	  title: 'Address',
	  dataIndex: 'address',
	  key: 'address',
	  width: 200
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
	
	ReactDOM.render(React.createElement(Table, {
	  columns: columns,
	  data: data,
	  onRowClick: onRowClick,
	  onRowDoubleClick: onRowDoubleClick
	}), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=rowClick.js.map