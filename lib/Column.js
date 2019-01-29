'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function Column() {}

Column.propTypes = {
  className: _propTypes2['default'].string,
  colSpan: _propTypes2['default'].number,
  title: _propTypes2['default'].node,
  dataIndex: _propTypes2['default'].string,
  width: _propTypes2['default'].oneOfType([_propTypes2['default'].number, _propTypes2['default'].string]),
  fixed: _propTypes2['default'].oneOf([true, 'left', 'right']),
  render: _propTypes2['default'].func,
  onCellClick: _propTypes2['default'].func,
  onCell: _propTypes2['default'].func,
  onHeaderCell: _propTypes2['default'].func
};

exports['default'] = Column;
module.exports = exports['default'];