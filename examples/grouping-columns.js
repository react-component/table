webpackJsonp([10],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(307);


/***/ },

/***/ 307:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* eslint-disable no-console,func-names,react/no-multi-comp */
	var React = __webpack_require__(4);
	var ReactDOM = __webpack_require__(37);
	var Table = __webpack_require__(188);
	__webpack_require__(211);
	__webpack_require__(308);
	
	var columns = [{
	  title: '姓名',
	  dataIndex: 'name',
	  key: 'name'
	}, {
	  title: '其它',
	  children: [{
	    title: '年龄',
	    dataIndex: 'age',
	    key: 'age'
	  }, {
	    title: '住址',
	    children: [{
	      title: '街道',
	      dataIndex: 'street',
	      key: 'street'
	    }, {
	      title: '小区',
	      children: [{
	        title: '单元',
	        dataIndex: 'building',
	        key: 'building'
	      }, {
	        title: '门牌',
	        dataIndex: 'number',
	        key: 'number'
	      }]
	    }]
	  }]
	}, {
	  title: '公司',
	  children: [{
	    title: '地址',
	    dataIndex: 'companyAddress',
	    key: 'companyAddress'
	  }, {
	    title: '名称',
	    dataIndex: 'companyName',
	    key: 'companyName'
	  }]
	}, {
	  title: '性别',
	  dataIndex: 'gender',
	  key: 'gender'
	}];
	
	var data = [{
	  key: '1',
	  name: '胡彦斌',
	  age: 32,
	  street: '拱墅区和睦街道',
	  building: 1,
	  number: 2033,
	  companyAddress: '西湖区湖底公园',
	  companyName: '湖底有限公司',
	  gender: '男'
	}, {
	  key: '2',
	  name: '胡彦祖',
	  age: 42,
	  street: '拱墅区和睦街道',
	  building: 3,
	  number: 2035,
	  companyAddress: '西湖区湖底公园',
	  companyName: '湖底有限公司',
	  gender: '男'
	}];
	
	ReactDOM.render(React.createElement(
	  'div',
	  null,
	  React.createElement(
	    'h2',
	    null,
	    'grouping columns'
	  ),
	  React.createElement(Table, { columns: columns, data: data, className: 'bordered' })
	), document.getElementById('__react-content'));

/***/ },

/***/ 308:
211

});
//# sourceMappingURL=grouping-columns.js.map