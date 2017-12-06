webpackJsonp([15],{

/***/ 304:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(305);


/***/ }),

/***/ 305:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rc_table__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rc_table_assets_index_less__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rc_table_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rc_table_assets_index_less__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint-disable no-console,func-names,react/no-multi-comp */






var CheckBox = function CheckBox(_ref) {
  var id = _ref.id;
  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
    'label',
    null,
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('input', { type: 'checkbox' }),
    id
  );
};

var Demo = function (_React$Component) {
  _inherits(Demo, _React$Component);

  function Demo(props) {
    _classCallCheck(this, Demo);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.handleClick = function (index) {
      return function () {
        _this.remove(index);
      };
    };

    _this.renderAction = function (o, row, index) {
      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'a',
        { href: '#', onClick: _this.handleClick(index) },
        'Delete'
      );
    };

    _this.state = {
      data: props.data
    };
    return _this;
  }

  Demo.prototype.remove = function remove(index) {
    var rows = this.state.data;
    rows.splice(index, 1);
    this.setState({
      data: rows
    });
  };

  Demo.prototype.checkbox = function checkbox(a) {
    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(CheckBox, { id: a });
  };

  Demo.prototype.render = function render() {
    var state = this.state;
    var columns = [{ title: 'title1', dataIndex: 'a', key: 'a', width: 100, render: this.checkbox }, { title: 'title2', dataIndex: 'b', key: 'b', width: 100 }, { title: 'title3', dataIndex: 'c', key: 'c', width: 200 }, { title: 'Operations', dataIndex: '', key: 'x', render: this.renderAction }];
    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_rc_table__["a" /* default */], { columns: columns, data: state.data, className: 'table', rowKey: function rowKey(record) {
        return record.a;
      } });
  };

  return Demo;
}(__WEBPACK_IMPORTED_MODULE_0_react___default.a.Component);

Demo.propTypes = {
  data: __WEBPACK_IMPORTED_MODULE_2_prop_types___default.a.array.isRequired
};


var data = [{ a: '123' }, { a: 'cdd', b: 'edd' }, { a: '1333', c: 'eee', d: 2 }];

__WEBPACK_IMPORTED_MODULE_1_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
  'div',
  null,
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
    'h2',
    null,
    'specify key'
  ),
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(Demo, { data: data })
), document.getElementById('__react-content'));

/***/ })

},[304]);
//# sourceMappingURL=key.js.map