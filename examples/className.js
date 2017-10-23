webpackJsonp([23],{

/***/ 150:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(151);


/***/ }),

/***/ 151:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
throw new Error("Cannot find module \"rc-table\"");
throw new Error("Cannot find module \"rc-table/assets/index.less\"");
/* eslint-disable no-console,func-names,react/no-multi-comp */





var columns = [{ title: 'title1', dataIndex: 'a',
  className: 'a',
  key: 'a', width: 100 }, { id: '123', title: 'title2', dataIndex: 'b',
  className: 'b',
  key: 'b', width: 100 }, { title: 'title3', dataIndex: 'c',
  className: 'c',
  key: 'c', width: 200 }, {
  title: 'Operations', dataIndex: '',
  className: 'd',
  key: 'd', render: function render() {
    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      'a',
      { href: '#' },
      'Operations'
    );
  }
}];

var data = [{ a: '123', key: '1' }, { a: 'cdd', b: 'edd', key: '2' }, { a: '1333', c: 'eee', d: 2, key: '3' }];

__WEBPACK_IMPORTED_MODULE_1_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
  'div',
  null,
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
    'h2',
    null,
    'rowClassName and className'
  ),
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_rc_table___default.a, {
    columns: columns,
    rowClassName: function rowClassName(record, i) {
      return 'row-' + i;
    },
    expandedRowRender: function expandedRowRender(record) {
      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'p',
        null,
        'extra: ',
        record.a
      );
    },
    expandedRowClassName: function expandedRowClassName(record, i) {
      return 'ex-row-' + i;
    },
    data: data,
    className: 'table'
  })
), document.getElementById('__react-content'));

/***/ })

},[150]);
//# sourceMappingURL=className.js.map