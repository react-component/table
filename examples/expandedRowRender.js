webpackJsonp([20],{

/***/ 163:
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





var tableData = [{ key: 0, a: '123' }, { key: 1, a: 'cdd', b: 'edd' }, { key: 2, a: '1333', c: 'eee', d: 2 }];

var App = __WEBPACK_IMPORTED_MODULE_0_react___default.a.createClass({
  displayName: 'App',
  getInitialState: function getInitialState() {
    this.columns = [{ title: 'title 1', dataIndex: 'a', key: 'a', width: 100 }, { title: 'title 2', dataIndex: 'b', key: 'b', width: 100 }, { title: 'title 3', dataIndex: 'c', key: 'c', width: 200 }, { title: 'Operation', dataIndex: '', key: 'x', render: this.renderAction }];
    return {
      data: tableData,
      expandedRowKeys: [],
      expandIconAsCell: true,
      expandRowByClick: false
    };
  },
  onExpand: function onExpand(expanded, record) {
    console.log('onExpand', expanded, record);
  },
  onExpandedRowsChange: function onExpandedRowsChange(rows) {
    this.setState({
      expandedRowKeys: rows
    });
  },
  onExpandIconAsCellChange: function onExpandIconAsCellChange(e) {
    this.setState({
      expandIconAsCell: e.target.checked
    });
  },
  onExpandRowByClickChange: function onExpandRowByClickChange(e) {
    this.setState({
      expandRowByClick: e.target.checked
    });
  },
  toggleButton: function toggleButton() {
    var _this = this;

    if (this.state.expandedRowKeys.length) {
      var closeAll = function closeAll() {
        return _this.setState({ expandedRowKeys: [] });
      };
      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'button',
        { onClick: closeAll },
        'Close All'
      );
    }
    var openAll = function openAll() {
      return _this.setState({ expandedRowKeys: [0, 1, 2] });
    };
    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      'button',
      { onClick: openAll },
      'Expand All'
    );
  },
  remove: function remove(index) {
    var data = this.state.data;
    data.splice(index, 1);
    this.setState({ data: data });
  },
  expandedRowRender: function expandedRowRender(record) {
    console.log(record);
    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      'p',
      null,
      'extra: ',
      record.a
    );
  },
  renderAction: function renderAction(o, row, index) {
    var _this2 = this;

    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      'a',
      { href: '#', onClick: function onClick() {
          return _this2.remove(index);
        } },
      'Delete'
    );
  },
  render: function render() {
    var _state = this.state,
        expandIconAsCell = _state.expandIconAsCell,
        expandRowByClick = _state.expandRowByClick,
        expandedRowKeys = _state.expandedRowKeys,
        data = _state.data;

    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      'div',
      null,
      this.toggleButton(),
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', { style: { display: 'inline-block', width: 20 } }),
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('input', {
        type: 'checkbox',
        checked: expandIconAsCell,
        onChange: this.onExpandIconAsCellChange
      }),
      'expandIconAsCell',
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('span', { style: { display: 'inline-block', width: 20 } }),
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('input', {
        type: 'checkbox',
        checked: expandRowByClick,
        onChange: this.onExpandRowByClickChange
      }),
      'expandRowByClick',
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_rc_table___default.a, {
        columns: this.columns,
        expandIconAsCell: expandIconAsCell,
        expandRowByClick: expandRowByClick,
        expandedRowRender: this.expandedRowRender,
        expandedRowKeys: expandedRowKeys,
        onExpandedRowsChange: this.onExpandedRowsChange,
        onExpand: this.onExpand,
        data: data
      })
    );
  }
});

__WEBPACK_IMPORTED_MODULE_1_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
  'div',
  null,
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
    'h2',
    null,
    'expandedRowRender'
  ),
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(App, null)
), document.getElementById('__react-content'));

/***/ }),

/***/ 393:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(163);


/***/ })

},[393]);
//# sourceMappingURL=expandedRowRender.js.map