import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'mini-store';
import ExpandIcon from './ExpandIcon';

var ExpandableRow = function (_React$Component) {
  _inherits(ExpandableRow, _React$Component);

  function ExpandableRow() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ExpandableRow);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ExpandableRow.__proto__ || Object.getPrototypeOf(ExpandableRow)).call.apply(_ref, [this].concat(args))), _this), _this.hasExpandIcon = function (columnIndex) {
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

      return React.createElement(ExpandIcon, {
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


      cells.push(React.createElement(
        'td',
        { className: prefixCls + '-expand-icon-cell', key: 'rc-table-expand-icon-cell' },
        _this.renderExpandIcon()
      ));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ExpandableRow, [{
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
}(React.Component);

ExpandableRow.propTypes = {
  prefixCls: PropTypes.string.isRequired,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  fixed: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  record: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  indentSize: PropTypes.number,
  needIndentSpaced: PropTypes.bool.isRequired,
  expandRowByClick: PropTypes.bool,
  expanded: PropTypes.bool.isRequired,
  expandIconAsCell: PropTypes.bool,
  expandIconColumnIndex: PropTypes.number,
  childrenColumnName: PropTypes.string,
  expandedRowRender: PropTypes.func,
  expandIcon: PropTypes.func,
  onExpandedChange: PropTypes.func.isRequired,
  onRowClick: PropTypes.func,
  children: PropTypes.func.isRequired
};


export default connect(function (_ref2, _ref3) {
  var expandedRowKeys = _ref2.expandedRowKeys;
  var rowKey = _ref3.rowKey;
  return {
    expanded: !!~expandedRowKeys.indexOf(rowKey)
  };
})(ExpandableRow);