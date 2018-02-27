webpackJsonp([23],{

/***/ 502:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(503);


/***/ }),

/***/ 503:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_dom__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rc_table__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rc_table_assets_index_less__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rc_table_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rc_table_assets_index_less__);



/* eslint-disable no-console,func-names,react/no-multi-comp */





var tableData = [{ key: 0, a: '123' }, { key: 1, a: 'cdd', b: 'edd' }, { key: 2, a: '1333', c: 'eee', d: 2 }];

var Demo = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits___default()(Demo, _React$Component);

  function Demo() {
    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, Demo);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn___default()(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      data: tableData,
      expandedRowKeys: [],
      expandIconAsCell: true,
      expandRowByClick: false
    }, _this.onExpand = function (expanded, record) {
      console.log('onExpand', expanded, record);
    }, _this.onExpandedRowsChange = function (rows) {
      _this.setState({
        expandedRowKeys: rows
      });
    }, _this.onExpandIconAsCellChange = function (e) {
      _this.setState({
        expandIconAsCell: e.target.checked
      });
    }, _this.onExpandRowByClickChange = function (e) {
      _this.setState({
        expandRowByClick: e.target.checked
      });
    }, _this.columns = [{ title: 'title 1', dataIndex: 'a', key: 'a', width: 100 }, { title: 'title 2', dataIndex: 'b', key: 'b', width: 100 }, { title: 'title 3', dataIndex: 'c', key: 'c', width: 200 }, { title: 'Operation', dataIndex: '', key: 'x', render: _this.renderAction }], _temp), __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  Demo.prototype.toggleButton = function toggleButton() {
    var _this2 = this;

    if (this.state.expandedRowKeys.length) {
      var closeAll = function closeAll() {
        return _this2.setState({ expandedRowKeys: [] });
      };
      return __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        'button',
        { onClick: closeAll },
        'Close All'
      );
    }
    var openAll = function openAll() {
      return _this2.setState({ expandedRowKeys: [0, 1, 2] });
    };
    return __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
      'button',
      { onClick: openAll },
      'Expand All'
    );
  };

  Demo.prototype.remove = function remove(index) {
    var data = this.state.data;
    data.splice(index, 1);
    this.setState({ data: data });
  };

  Demo.prototype.expandedRowRender = function expandedRowRender(record) {
    // console.log(record);
    return __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
      'p',
      null,
      'extra: ',
      record.a
    );
  };

  Demo.prototype.renderAction = function renderAction(o, row, index) {
    var _this3 = this;

    return __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
      'a',
      { href: '#', onClick: function onClick() {
          return _this3.remove(index);
        } },
      'Delete'
    );
  };

  Demo.prototype.render = function render() {
    var _state = this.state,
        expandIconAsCell = _state.expandIconAsCell,
        expandRowByClick = _state.expandRowByClick,
        expandedRowKeys = _state.expandedRowKeys,
        data = _state.data;

    return __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
      'div',
      null,
      this.toggleButton(),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement('span', { style: { display: 'inline-block', width: 20 } }),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement('input', {
        type: 'checkbox',
        checked: expandIconAsCell,
        onChange: this.onExpandIconAsCellChange
      }),
      'expandIconAsCell',
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement('span', { style: { display: 'inline-block', width: 20 } }),
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement('input', {
        type: 'checkbox',
        checked: expandRowByClick,
        onChange: this.onExpandRowByClickChange
      }),
      'expandRowByClick',
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5_rc_table__["a" /* default */], {
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
  };

  return Demo;
}(__WEBPACK_IMPORTED_MODULE_3_react___default.a.Component);

__WEBPACK_IMPORTED_MODULE_4_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
  'div',
  null,
  __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
    'h2',
    null,
    'expandedRowRender'
  ),
  __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(Demo, null)
), document.getElementById('__react-content'));

/***/ })

},[502]);
//# sourceMappingURL=expandedRowRender.js.map