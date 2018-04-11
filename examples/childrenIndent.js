webpackJsonp([26],{

/***/ 310:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(311);


/***/ }),

/***/ 311:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rc_table__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rc_table_assets_index_less__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rc_table_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rc_table_assets_index_less__);
/* eslint-disable no-console,func-names,react/no-multi-comp */





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

__WEBPACK_IMPORTED_MODULE_1_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_rc_table__["a" /* default */], { defaultExpandAllRows: true, columns: columns, data: data, indentSize: 30, onExpand: onExpand }), document.getElementById('__react-content'));

/***/ })

},[310]);
//# sourceMappingURL=childrenIndent.js.map