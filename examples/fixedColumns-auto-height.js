webpackJsonp([19],{

/***/ 164:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rc_table__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rc_table_assets_index_less__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rc_table_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rc_table_assets_index_less__);
/* eslint-disable no-console,func-names,react/no-multi-comp */





var columns = [{ title: 'title1', dataIndex: 'a', key: 'a', width: 100, fixed: 'left' }, { title: 'title2', dataIndex: 'b', key: 'b', width: 100, fixed: 'left' }, { title: 'title3', dataIndex: 'c', key: 'c' }, { title: 'title4', dataIndex: 'b', key: 'd' }, { title: 'title5', dataIndex: 'b', key: 'e' }, { title: 'title6', dataIndex: 'b', key: 'f',
  render: function render() {
    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      'div',
      { style: { height: '40px', lineHeight: '40px' } },
      '\u6211\u5F88\u9AD8'
    );
  } }, { title: 'title7', dataIndex: 'b', key: 'g' }, { title: 'title8', dataIndex: 'b', key: 'h' }, { title: 'title9', dataIndex: 'b', key: 'i' }, { title: 'title10', dataIndex: 'b', key: 'j' }, { title: 'title11', dataIndex: 'b', key: 'k' }, { title: 'title12', dataIndex: 'b', key: 'l', width: 100, fixed: 'right' }];

var data = [{ a: '123', b: 'xxxxxxxx', d: 3, key: '1' }, { a: 'cdd', b: 'edd12221', d: 3, key: '2' }, { a: '133', c: 'edd12221', d: 2, key: '3' }, { a: '133', c: 'edd12221', d: 2, key: '4' }, { a: '133', c: 'edd12221', d: 2, key: '5' }, { a: '133', c: 'edd12221', d: 2, key: '6' }, { a: '133', c: 'edd12221', d: 2, key: '7' }, { a: '133', c: 'edd12221', d: 2, key: '8' }, { a: '133', c: 'edd12221', d: 2, key: '9' }];

__WEBPACK_IMPORTED_MODULE_1_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
  'div',
  { style: { width: 800 } },
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
    'h2',
    null,
    'Fixed columns'
  ),
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_rc_table__["a" /* default */], {
    columns: columns,
    expandedRowRender: function expandedRowRender(record) {
      return record.title;
    },
    expandIconAsCell: true,
    scroll: { x: 1200 },
    data: data
  })
), document.getElementById('__react-content'));

/***/ }),

/***/ 393:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(164);


/***/ })

},[393]);
//# sourceMappingURL=fixedColumns-auto-height.js.map