'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = HeadTable;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('./utils');

var _BaseTable = require('./BaseTable');

var _BaseTable2 = _interopRequireDefault(_BaseTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function HeadTable(props, _ref) {
  var table = _ref.table;
  var _table$props = table.props,
      prefixCls = _table$props.prefixCls,
      scroll = _table$props.scroll,
      showHeader = _table$props.showHeader;
  var columns = props.columns,
      fixed = props.fixed,
      tableClassName = props.tableClassName,
      handleBodyScrollLeft = props.handleBodyScrollLeft,
      expander = props.expander;
  var saveRef = table.saveRef;
  var useFixedHeader = table.props.useFixedHeader;

  var headStyle = {};

  if (scroll.y) {
    useFixedHeader = true;
    // Add negative margin bottom for scroll bar overflow bug
    var scrollbarWidth = (0, _utils.measureScrollbar)('horizontal');
    if (scrollbarWidth > 0 && !fixed) {
      headStyle.marginBottom = '-' + scrollbarWidth + 'px';
      headStyle.paddingBottom = '0px';
    }
  }

  if (!useFixedHeader || !showHeader) {
    return null;
  }

  return _react2['default'].createElement(
    'div',
    {
      key: 'headTable',
      ref: fixed ? null : saveRef('headTable'),
      className: prefixCls + '-header',
      style: headStyle,
      onScroll: handleBodyScrollLeft
    },
    _react2['default'].createElement(_BaseTable2['default'], {
      tableClassName: tableClassName,
      hasHead: true,
      hasBody: false,
      fixed: fixed,
      columns: columns,
      expander: expander
    })
  );
}

HeadTable.propTypes = {
  fixed: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].bool]),
  columns: _propTypes2['default'].array.isRequired,
  tableClassName: _propTypes2['default'].string.isRequired,
  handleBodyScrollLeft: _propTypes2['default'].func.isRequired,
  expander: _propTypes2['default'].object.isRequired
};

HeadTable.contextTypes = {
  table: _propTypes2['default'].any
};
module.exports = exports['default'];