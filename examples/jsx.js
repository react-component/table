webpackJsonp([14],{

/***/ 214:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(215);


/***/ }),

/***/ 215:
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





var ColumnGroup = __WEBPACK_IMPORTED_MODULE_2_rc_table___default.a.ColumnGroup,
    Column = __WEBPACK_IMPORTED_MODULE_2_rc_table___default.a.Column;


var data = [{ a: '123', key: '1' }, { a: 'cdd', b: 'edd', key: '2' }, { a: '1333', c: 'eee', d: 2, key: '3' }];

__WEBPACK_IMPORTED_MODULE_1_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
  'div',
  null,
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
    'h2',
    null,
    'JSX table'
  ),
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
    __WEBPACK_IMPORTED_MODULE_2_rc_table___default.a,
    { data: data },
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      ColumnGroup,
      { title: 'Bazinga' },
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(Column, {
        title: 'title1',
        dataIndex: 'a',
        key: 'a',
        width: 100
      }),
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(Column, {
        id: '123',
        title: 'title2',
        dataIndex: 'b',
        key: 'b',
        width: 100
      })
    ),
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(Column, {
      title: 'title3',
      dataIndex: 'c',
      key: 'c',
      width: 200
    }),
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(Column, {
      title: 'Operations',
      dataIndex: '',
      key: 'd',
      render: function render() {
        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          'a',
          { href: '#' },
          'Operations'
        );
      }
    })
  )
), document.getElementById('__react-content'));

/***/ })

},[214]);
//# sourceMappingURL=jsx.js.map