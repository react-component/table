'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _ExpandIcon = require('./ExpandIcon');

var _ExpandIcon2 = _interopRequireDefault(_ExpandIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ExpandableRow = function (_React$Component) {
  (0, _inherits3['default'])(ExpandableRow, _React$Component);

  function ExpandableRow() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, ExpandableRow);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = ExpandableRow.__proto__ || Object.getPrototypeOf(ExpandableRow)).call.apply(_ref, [this].concat(args))), _this), _this.hasExpandIcon = function (columnIndex) {
      var expandRowByClick = _this.props.expandRowByClick;

      return !_this.expandIconAsCell && !expandRowByClick && columnIndex === _this.expandIconColumnIndex;
    }, _this.handleExpandChange = function (record, event) {
      var _this$props = _this.props,
          onExpandedChange = _this$props.onExpandedChange,
          expanded = _this$props.expanded,
          rowKey = _this$props.rowKey;

      if (_this.expandable) {
        onExpandedChange(!expanded, record, event, rowKey);
      }
    }, _this.handleRowClick = function (record, index, event) {
      var _this$props2 = _this.props,
          expandRowByClick = _this$props2.expandRowByClick,
          onRowClick = _this$props2.onRowClick;

      if (expandRowByClick) {
        _this.handleExpandChange(record, event);
      }
      if (onRowClick) {
        onRowClick(record, index, event);
      }
    }, _this.renderExpandIcon = function () {
      var _this$props3 = _this.props,
          prefixCls = _this$props3.prefixCls,
          expanded = _this$props3.expanded,
          record = _this$props3.record,
          needIndentSpaced = _this$props3.needIndentSpaced,
          expandIcon = _this$props3.expandIcon;


      if (expandIcon) {
        return expandIcon({
          prefixCls: prefixCls,
          expanded: expanded,
          record: record,
          needIndentSpaced: needIndentSpaced,
          expandable: _this.expandable,
          onExpand: _this.handleExpandChange
        });
      }

      return _react2['default'].createElement(_ExpandIcon2['default'], {
        expandable: _this.expandable,
        prefixCls: prefixCls,
        onExpand: _this.handleExpandChange,
        needIndentSpaced: needIndentSpaced,
        expanded: expanded,
        record: record
      });
    }, _this.renderExpandIconCell = function (cells) {
      if (!_this.expandIconAsCell) {
        return;
      }
      var prefixCls = _this.props.prefixCls;


      cells.push(_react2['default'].createElement(
        'td',
        { className: prefixCls + '-expand-icon-cell', key: 'rc-table-expand-icon-cell' },
        _this.renderExpandIcon()
      ));
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(ExpandableRow, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.handleDestroy();
    }
  }, {
    key: 'handleDestroy',
    value: function handleDestroy() {
      var _props = this.props,
          onExpandedChange = _props.onExpandedChange,
          rowKey = _props.rowKey,
          record = _props.record;

      if (this.expandable) {
        onExpandedChange(false, record, null, rowKey, true);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          childrenColumnName = _props2.childrenColumnName,
          expandedRowRender = _props2.expandedRowRender,
          indentSize = _props2.indentSize,
          record = _props2.record,
          fixed = _props2.fixed,
          expanded = _props2.expanded;


      this.expandIconAsCell = fixed !== 'right' ? this.props.expandIconAsCell : false;
      this.expandIconColumnIndex = fixed !== 'right' ? this.props.expandIconColumnIndex : -1;
      var childrenData = record[childrenColumnName];
      this.expandable = !!(childrenData || expandedRowRender);

      var expandableRowProps = {
        indentSize: indentSize,
        expanded: expanded, // not used in TableRow, but it's required to re-render TableRow when `expanded` changes
        onRowClick: this.handleRowClick,
        hasExpandIcon: this.hasExpandIcon,
        renderExpandIcon: this.renderExpandIcon,
        renderExpandIconCell: this.renderExpandIconCell
      };

      return this.props.children(expandableRowProps);
    }
  }]);
  return ExpandableRow;
}(_react2['default'].Component);

ExpandableRow.propTypes = {
  prefixCls: _propTypes2['default'].string.isRequired,
  rowKey: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].number]).isRequired,
  fixed: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].bool]),
  record: _propTypes2['default'].oneOfType([_propTypes2['default'].object, _propTypes2['default'].array]).isRequired,
  indentSize: _propTypes2['default'].number,
  needIndentSpaced: _propTypes2['default'].bool.isRequired,
  expandRowByClick: _propTypes2['default'].bool,
  expanded: _propTypes2['default'].bool.isRequired,
  expandIconAsCell: _propTypes2['default'].bool,
  expandIconColumnIndex: _propTypes2['default'].number,
  childrenColumnName: _propTypes2['default'].string,
  expandedRowRender: _propTypes2['default'].func,
  expandIcon: _propTypes2['default'].func,
  onExpandedChange: _propTypes2['default'].func.isRequired,
  onRowClick: _propTypes2['default'].func,
  children: _propTypes2['default'].func.isRequired
};
exports['default'] = (0, _miniStore.connect)(function (_ref2, _ref3) {
  var expandedRowKeys = _ref2.expandedRowKeys;
  var rowKey = _ref3.rowKey;
  return {
    expanded: !!~expandedRowKeys.indexOf(rowKey)
  };
})(ExpandableRow);
module.exports = exports['default'];