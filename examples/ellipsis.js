webpackJsonp([25],{

/***/ 370:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(371);


/***/ }),

/***/ 371:
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





var columns = [{ title: 'name', dataIndex: 'name', width: 100, ellipsis: true }, { title: 'descrption', dataIndex: 'descrption', key: 'descrption 1', ellipsis: true }, { title: 'descrption', dataIndex: 'descrption', key: 'descrption 2', ellipsis: true }, { title: 'descrption', dataIndex: 'descrption', key: 'descrption 3', ellipsis: true }, { title: 'descrption', dataIndex: 'descrption', key: 'descrption 4', ellipsis: true }, { title: 'descrption', dataIndex: 'descrption', key: 'descrption 5', ellipsis: true }, { title: 'descrption', dataIndex: 'descrption', key: 'descrption 6', ellipsis: true }, { title: 'descrption', dataIndex: 'descrption', key: 'descrption 7', ellipsis: true }, { title: 'descrption', dataIndex: 'descrption', key: 'descrption 8', ellipsis: true }, { title: 'descrption', dataIndex: 'descrption', key: 'descrption 9', ellipsis: true }, {
  title: 'Operations',
  key: 'operations',
  ellipsis: true,
  render: function render() {
    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      'a',
      { href: '#' },
      'Operations'
    );
  }
}];

var data = [{ name: 'jack', descrption: 'descrption descrption descrption', key: '1' }, { name: 'jackjackjackjackjackjack', descrption: 'descrption descrption', key: '2' }, { name: 'jack ma', descrption: 'descrption descrption descrption descrption', key: '3' }, { name: 'jack nickson', descrption: 'descrption descrption', key: '4' }];

__WEBPACK_IMPORTED_MODULE_1_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
  'div',
  null,
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
    'h2',
    null,
    'Table ellipsis'
  ),
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_rc_table__["a" /* default */], { columns: columns, data: data })
), document.getElementById('__react-content'));

/***/ })

},[370]);
//# sourceMappingURL=ellipsis.js.map