webpackJsonp([5],{

/***/ 46:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 488:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(489);


/***/ }),

/***/ 489:
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rc_table_assets_animation_less__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rc_table_assets_animation_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_rc_table_assets_animation_less__);




/* eslint-disable no-console,func-names,react/no-multi-comp */






var createDate = function createDate() {
  var data = [];
  for (var a = 0; a < 10; a++) {
    data.push({
      key: "" + a,
      name: "" + a,
      age: "32",
      address: "London, Park Lane no. 0",
      children: []
    });
  }
  return data;
};

var EditableTable = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default()(EditableTable, _React$Component);

  function EditableTable(props) {
    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, EditableTable);

    var _this = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(this, (EditableTable.__proto__ || Object.getPrototypeOf(EditableTable)).call(this, props));

    _this.state = {
      dataSource: createDate(),
      expandedRowKeys: []
    };

    _this.onExpandedRowsChange = function (expandedRowKeys) {
      //
      console.log("onExpandedRowsChange", expandedRowKeys);
      _this.setState({ expandedRowKeys: expandedRowKeys });
    };

    _this.setExpandedRowKeys = function () {
      _this.init();
      // 这之后不知道为啥居然调用 onExpandedRowsChange
      _this.setState({ expandedRowKeys: ["0"] });
    };

    _this.init = function () {
      _this.setState({
        dataSource: [{
          key: "0",
          name: "1(应该展开)",
          age: "32",
          address: "London, Park Lane no. 0",
          children: [{
            key: "0-1",
            name: "0-1",
            age: "32",
            address: "London, Park Lane no. 0"
          }]
          // 将下方解除注释就正常
          // {
          //   key: "1",
          //   name: "2",
          //   age: "32",
          //   address: "London, Park Lane no. 1",
          //   children: []
          // }
        }]
      });
    };

    _this.columns = [{
      title: "name",
      dataIndex: "name",
      width: "30%"
    }, {
      title: "age",
      dataIndex: "age"
    }, {
      title: "address",
      dataIndex: "address"
    }];
    return _this;
  }

  __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(EditableTable, [{
    key: 'render',
    value: function render() {
      var dataSource = this.state.dataSource;


      var columns = this.columns;
      return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
        'div',
        null,
        __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
          'button',
          {
            onClick: this.setExpandedRowKeys,
            type: 'primary',
            style: { marginBottom: 16 }
          },
          '\u52A0\u8F7D\u6570\u636E\u5E76\u5C55\u5F00'
        ),
        __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6_rc_table__["a" /* default */], {
          bordered: true,
          expandedRowKeys: this.state.expandedRowKeys,
          onExpandedRowsChange: this.onExpandedRowsChange,
          data: dataSource,
          columns: columns
        })
      );
    }
  }]);

  return EditableTable;
}(__WEBPACK_IMPORTED_MODULE_4_react___default.a.Component);

__WEBPACK_IMPORTED_MODULE_5_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(EditableTable, null), document.getElementById('__react-content'));

/***/ })

},[488]);
//# sourceMappingURL=~debug2.js.map