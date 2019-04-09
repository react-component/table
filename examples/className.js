webpackJsonp([28],{

/***/ 330:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(331);


/***/ }),

/***/ 331:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rc_table__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rc_table_assets_index_less__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rc_table_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rc_table_assets_index_less__);
/* eslint-disable no-console,func-names,react/no-multi-comp */





var columns = [{
  title: 'title1',
  dataIndex: 'a',
  className: 'a',
  key: 'a',
  width: 100
}, {
  id: '123',
  title: 'title2',
  dataIndex: 'b',
  className: 'b',
  key: 'b',
  width: 100
}, {
  title: 'title3',
  dataIndex: 'c',
  className: 'c',
  key: 'c',
  width: 200
}, {
  title: 'Operations',
  dataIndex: '',
  className: 'd',
  key: 'd',
  render: function render() {
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
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_rc_table__["a" /* default */], {
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

},[330]);
//# sourceMappingURL=className.js.map