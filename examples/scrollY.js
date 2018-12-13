webpackJsonp([11],{

/***/ 476:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(477);


/***/ }),

/***/ 477:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_dom__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rc_table__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rc_table_assets_index_less__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rc_table_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rc_table_assets_index_less__);




/* eslint-disable no-console,func-names,react/no-multi-comp */





var data = [];
for (var i = 0; i < 10; i++) {
  data.push({
    key: i,
    a: 'a' + i,
    b: 'b' + i,
    c: 'c' + i
  });
}

var Demo = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default()(Demo, _React$Component);

  function Demo() {
    var _ref;

    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, Demo);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(this, (_ref = Demo.__proto__ || Object.getPrototypeOf(Demo)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      showBody: true
    }, _this.toggleBody = function () {
      _this.setState({
        showBody: !_this.state.showBody
      });
    }, _temp), __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(Demo, [{
    key: 'render',
    value: function render() {
      var columns = [{ title: 'title1', key: 'a', dataIndex: 'a', width: 100 }, { id: '123', title: 'title2', dataIndex: 'b', key: 'b', width: 100 }, { title: 'title3', key: 'c', dataIndex: 'c', width: 200 }, {
        title: __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
          'a',
          { onClick: this.toggleBody, href: '#' },
          this.state.showBody ? '隐藏' : '显示',
          '\u4F53'
        ),
        key: 'x',
        width: 200,
        render: function render() {
          return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
            'a',
            { href: '#' },
            'Operations'
          );
        }
      }];
      return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6_rc_table__["a" /* default */], {
        columns: columns,
        data: data,
        scroll: { y: 300 },
        rowKey: function rowKey(record) {
          return record.key;
        },
        bodyStyle: {
          display: this.state.showBody ? '' : 'none'
        }
      });
    }
  }]);

  return Demo;
}(__WEBPACK_IMPORTED_MODULE_4_react___default.a.Component);

__WEBPACK_IMPORTED_MODULE_5_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
  'div',
  null,
  __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
    'h2',
    null,
    'scroll body table'
  ),
  __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(Demo, null)
), document.getElementById('__react-content'));

/***/ })

},[476]);
//# sourceMappingURL=scrollY.js.map