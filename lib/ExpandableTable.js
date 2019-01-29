'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _miniStore = require('mini-store');

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _TableRow = require('./TableRow');

var _TableRow2 = _interopRequireDefault(_TableRow);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ExpandableTable = function (_React$Component) {
  (0, _inherits3['default'])(ExpandableTable, _React$Component);

  function ExpandableTable(props) {
    (0, _classCallCheck3['default'])(this, ExpandableTable);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (ExpandableTable.__proto__ || Object.getPrototypeOf(ExpandableTable)).call(this, props));

    _initialiseProps.call(_this);

    var data = props.data,
        childrenColumnName = props.childrenColumnName,
        defaultExpandAllRows = props.defaultExpandAllRows,
        expandedRowKeys = props.expandedRowKeys,
        defaultExpandedRowKeys = props.defaultExpandedRowKeys,
        getRowKey = props.getRowKey;


    var finnalExpandedRowKeys = [];
    var rows = [].concat((0, _toConsumableArray3['default'])(data));

    if (defaultExpandAllRows) {
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        finnalExpandedRowKeys.push(getRowKey(row, i));
        rows = rows.concat(row[childrenColumnName] || []);
      }
    } else {
      finnalExpandedRowKeys = expandedRowKeys || defaultExpandedRowKeys;
    }

    _this.columnManager = props.columnManager;
    _this.store = props.store;

    _this.store.setState({
      expandedRowsHeight: {},
      expandedRowKeys: finnalExpandedRowKeys
    });
    return _this;
  }

  (0, _createClass3['default'])(ExpandableTable, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.handleUpdated();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if ('expandedRowKeys' in this.props) {
        this.store.setState({
          expandedRowKeys: this.props.expandedRowKeys
        });
      }
      this.handleUpdated();
    }
  }, {
    key: 'handleUpdated',
    value: function handleUpdated() {
      // We should record latest expanded rows to avoid multiple rows remove cause `onExpandedRowsChange` trigger many times
      this.latestExpandedRows = null;
    }
  }, {
    key: 'renderExpandedRow',
    value: function renderExpandedRow(record, index, _render, className, ancestorKeys, indent, fixed) {
      var _this2 = this;

      var _props = this.props,
          prefixCls = _props.prefixCls,
          expandIconAsCell = _props.expandIconAsCell,
          indentSize = _props.indentSize;

      var parentKey = ancestorKeys[ancestorKeys.length - 1];
      var rowKey = parentKey + '-extra-row';
      var components = {
        body: {
          row: 'tr',
          cell: 'td'
        }
      };
      var colCount = void 0;
      if (fixed === 'left') {
        colCount = this.columnManager.leftLeafColumns().length;
      } else if (fixed === 'right') {
        colCount = this.columnManager.rightLeafColumns().length;
      } else {
        colCount = this.columnManager.leafColumns().length;
      }
      var columns = [{
        key: 'extra-row',
        render: function render() {
          var _store$getState = _this2.store.getState(),
              expandedRowKeys = _store$getState.expandedRowKeys;

          var expanded = !!~expandedRowKeys.indexOf(parentKey);
          return {
            props: {
              colSpan: colCount
            },
            children: fixed !== 'right' ? _render(record, index, indent, expanded) : '&nbsp;'
          };
        }
      }];
      if (expandIconAsCell && fixed !== 'right') {
        columns.unshift({
          key: 'expand-icon-placeholder',
          render: function render() {
            return null;
          }
        });
      }

      return _react2['default'].createElement(_TableRow2['default'], {
        key: rowKey,
        columns: columns,
        className: className,
        rowKey: rowKey,
        ancestorKeys: ancestorKeys,
        prefixCls: prefixCls + '-expanded-row',
        indentSize: indentSize,
        indent: indent,
        fixed: fixed,
        components: components,
        expandedRow: true
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          data = _props2.data,
          childrenColumnName = _props2.childrenColumnName,
          children = _props2.children;

      var needIndentSpaced = data.some(function (record) {
        return record[childrenColumnName];
      });

      return children({
        props: this.props,
        needIndentSpaced: needIndentSpaced,
        renderRows: this.renderRows,
        handleExpandChange: this.handleExpandChange,
        renderExpandIndentCell: this.renderExpandIndentCell
      });
    }
  }]);
  return ExpandableTable;
}(_react2['default'].Component);

ExpandableTable.propTypes = {
  expandIconAsCell: _propTypes2['default'].bool,
  expandedRowKeys: _propTypes2['default'].array,
  expandedRowClassName: _propTypes2['default'].func,
  defaultExpandAllRows: _propTypes2['default'].bool,
  defaultExpandedRowKeys: _propTypes2['default'].array,
  expandIconColumnIndex: _propTypes2['default'].number,
  expandedRowRender: _propTypes2['default'].func,
  expandIcon: _propTypes2['default'].func,
  childrenColumnName: _propTypes2['default'].string,
  indentSize: _propTypes2['default'].number,
  onExpand: _propTypes2['default'].func,
  onExpandedRowsChange: _propTypes2['default'].func,
  columnManager: _propTypes2['default'].object.isRequired,
  store: _propTypes2['default'].object.isRequired,
  prefixCls: _propTypes2['default'].string.isRequired,
  data: _propTypes2['default'].array,
  children: _propTypes2['default'].func.isRequired,
  getRowKey: _propTypes2['default'].func.isRequired
};
ExpandableTable.defaultProps = {
  expandIconAsCell: false,
  expandedRowClassName: function expandedRowClassName() {
    return '';
  },
  expandIconColumnIndex: 0,
  defaultExpandAllRows: false,
  defaultExpandedRowKeys: [],
  childrenColumnName: 'children',
  indentSize: 15,
  onExpand: function onExpand() {},
  onExpandedRowsChange: function onExpandedRowsChange() {}
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.handleExpandChange = function (expanded, record, event, rowKey) {
    var destroy = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    var _props3 = _this3.props,
        onExpandedRowsChange = _props3.onExpandedRowsChange,
        onExpand = _props3.onExpand;

    var _store$getState2 = _this3.store.getState(),
        expandedRowKeys = _store$getState2.expandedRowKeys;

    if (expanded) {
      // row was expanded
      expandedRowKeys = [].concat((0, _toConsumableArray3['default'])(expandedRowKeys), [rowKey]);
    } else {
      // row was collapse
      var expandedRowIndex = expandedRowKeys.indexOf(rowKey);
      if (expandedRowIndex !== -1) {
        expandedRowKeys = (0, _utils.remove)(expandedRowKeys, rowKey);
      }
    }

    if (!_this3.props.expandedRowKeys) {
      _this3.store.setState({ expandedRowKeys: expandedRowKeys });
    }

    // De-dup of repeat call
    if (!_this3.latestExpandedRows || !(0, _shallowequal2['default'])(_this3.latestExpandedRows, expandedRowKeys)) {
      _this3.latestExpandedRows = expandedRowKeys;
      onExpandedRowsChange(expandedRowKeys);
    }
    if (!destroy) {
      onExpand(expanded, record);
    }
  };

  this.renderExpandIndentCell = function (rows, fixed) {
    var _props4 = _this3.props,
        prefixCls = _props4.prefixCls,
        expandIconAsCell = _props4.expandIconAsCell;

    if (!expandIconAsCell || fixed === 'right' || !rows.length) {
      return;
    }

    var iconColumn = {
      key: 'rc-table-expand-icon-cell',
      className: prefixCls + '-expand-icon-th',
      title: '',
      rowSpan: rows.length
    };

    rows[0].unshift((0, _extends3['default'])({}, iconColumn, { column: iconColumn }));
  };

  this.renderRows = function (renderRows, rows, record, index, indent, fixed, parentKey, ancestorKeys) {
    var _props5 = _this3.props,
        expandedRowClassName = _props5.expandedRowClassName,
        expandedRowRender = _props5.expandedRowRender,
        childrenColumnName = _props5.childrenColumnName;

    var childrenData = record[childrenColumnName];
    var nextAncestorKeys = [].concat((0, _toConsumableArray3['default'])(ancestorKeys), [parentKey]);
    var nextIndent = indent + 1;

    if (expandedRowRender) {
      rows.push(_this3.renderExpandedRow(record, index, expandedRowRender, expandedRowClassName(record, index, indent), nextAncestorKeys, nextIndent, fixed));
    }

    if (childrenData) {
      rows.push.apply(rows, (0, _toConsumableArray3['default'])(renderRows(childrenData, nextIndent, nextAncestorKeys)));
    }
  };
};

(0, _reactLifecyclesCompat.polyfill)(ExpandableTable);

exports['default'] = (0, _miniStore.connect)()(ExpandableTable);
module.exports = exports['default'];