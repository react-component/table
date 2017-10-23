webpackJsonp([16],{

/***/ 210:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(211);


/***/ }),

/***/ 211:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
throw new Error("Cannot find module \"rc-table\"");
throw new Error("Cannot find module \"rc-table/assets/index.less\"");
throw new Error("Cannot find module \"rc-table/assets/bordered.less\"");
/* eslint-disable no-console,func-names,react/no-multi-comp */






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

__WEBPACK_IMPORTED_MODULE_1_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
  'div',
  null,
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
    'h2',
    null,
    'grouping columns'
  ),
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_rc_table___default.a, { columns: columns, data: data, className: 'bordered' })
), document.getElementById('__react-content'));

/***/ })

},[210]);
//# sourceMappingURL=grouping-columns.js.map