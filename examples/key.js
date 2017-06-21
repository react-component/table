webpackJsonp([12],{

/***/ 172:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rc_table__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rc_table___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rc_table__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rc_table_assets_index_less__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rc_table_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rc_table_assets_index_less__);
/* eslint-disable no-console,func-names,react/no-multi-comp */





var CheckBox = __WEBPACK_IMPORTED_MODULE_0_react___default.a.createClass({
  displayName: 'CheckBox',
  render: function render() {
    var props = this.props;
    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      'label',
      null,
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('input', { type: 'checkbox' }),
      props.id
    );
  }
});

var MyTable = __WEBPACK_IMPORTED_MODULE_0_react___default.a.createClass({
  displayName: 'MyTable',
  getInitialState: function getInitialState() {
    var props = this.props;
    return {
      data: props.data
    };
  },
  remove: function remove(index) {
    var rows = this.state.data;
    rows.splice(index, 1);
    this.setState({
      data: rows
    });
  },
  handleClick: function handleClick(index) {
    var self = this;
    return function () {
      self.remove(index);
    };
  },
  checkbox: function checkbox(a) {
    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(CheckBox, { id: a });
  },
  renderAction: function renderAction(o, row, index) {
    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      'a',
      { href: '#', onClick: this.handleClick(index) },
      'Delete'
    );
  },
  render: function render() {
    var state = this.state;
    var columns = [{ title: 'title1', dataIndex: 'a', key: 'a', width: 100, render: this.checkbox }, { title: 'title2', dataIndex: 'b', key: 'b', width: 100 }, { title: 'title3', dataIndex: 'c', key: 'c', width: 200 }, { title: 'Operations', dataIndex: '', key: 'x', render: this.renderAction }];
    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_rc_table___default.a, { columns: columns, data: state.data, className: 'table', rowKey: function rowKey(record) {
        return record.a;
      } });
  }
});

var data = [{ a: '123' }, { a: 'cdd', b: 'edd' }, { a: '1333', c: 'eee', d: 2 }];

__WEBPACK_IMPORTED_MODULE_1_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
  'div',
  null,
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
    'h2',
    null,
    'specify key'
  ),
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(MyTable, { data: data })
), document.getElementById('__react-content'));

/***/ }),

/***/ 402:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(172);


/***/ })

},[402]);
//# sourceMappingURL=key.js.map