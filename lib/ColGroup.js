'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = ColGroup;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function ColGroup(props, _ref) {
  var table = _ref.table;
  var _table$props = table.props,
      prefixCls = _table$props.prefixCls,
      expandIconAsCell = _table$props.expandIconAsCell;
  var fixed = props.fixed;


  var cols = [];

  if (expandIconAsCell && fixed !== 'right') {
    cols.push(_react2['default'].createElement('col', { className: prefixCls + '-expand-icon-col', key: 'rc-table-expand-icon-col' }));
  }

  var leafColumns = void 0;

  if (fixed === 'left') {
    leafColumns = table.columnManager.leftLeafColumns();
  } else if (fixed === 'right') {
    leafColumns = table.columnManager.rightLeafColumns();
  } else {
    leafColumns = table.columnManager.leafColumns();
  }
  cols = cols.concat(leafColumns.map(function (c) {
    return _react2['default'].createElement('col', { key: c.key || c.dataIndex, style: { width: c.width, minWidth: c.width } });
  }));

  return _react2['default'].createElement(
    'colgroup',
    null,
    cols
  );
}

ColGroup.propTypes = {
  fixed: _propTypes2['default'].string
};

ColGroup.contextTypes = {
  table: _propTypes2['default'].any
};
module.exports = exports['default'];