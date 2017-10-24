webpackJsonp([4],{

/***/ 238:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(239);


/***/ }),

/***/ 239:
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





var data = [{
  a: 'a1'
}, {
  a: 'a2',
  b: 'b2',
  children: [{
    a: 'a2-1',
    b: 'b2-1'
  }, {
    a: 'a2-2',
    b: 'b2-2'
  }]
}, {
  a: 'a3',
  c: 'c3',
  d: 'd3'
}];

var MyTable = __WEBPACK_IMPORTED_MODULE_0_react___default.a.createClass({
  displayName: 'MyTable',
  handleClick: function handleClick(record, e) {
    e.preventDefault();
    console.log(record.a);
  },
  render: function render() {
    var _this = this;

    var columns = [{ title: 'title1', dataIndex: 'a', key: 'a', width: 100 }, { title: 'title2', dataIndex: 'b', key: 'b', width: 100 }, { title: 'title3', dataIndex: 'c', key: 'c', width: 200 }, {
      title: 'Operations', dataIndex: '', key: 'x', render: function render(text, record) {
        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          'a',
          { href: '#', onClick: function onClick(e) {
              return _this.handleClick(record, e);
            } },
          'click ',
          record.a
        );
      }
    }];
    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      'div',
      null,
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'h2',
        null,
        'sub table'
      ),
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_rc_table__["a" /* default */], {
        columns: columns,
        expandIconAsCell: true,
        data: data,
        rowKey: function rowKey(record) {
          return record.a;
        }
      })
    );
  }
});

__WEBPACK_IMPORTED_MODULE_1_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(MyTable, null), document.getElementById('__react-content'));

/***/ })

},[238]);
//# sourceMappingURL=subTable.js.map