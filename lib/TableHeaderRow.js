'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _miniStore = require('mini-store');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function TableHeaderRow(_ref) {
  var row = _ref.row,
      index = _ref.index,
      height = _ref.height,
      components = _ref.components,
      onHeaderRow = _ref.onHeaderRow,
      prefixCls = _ref.prefixCls;

  var HeaderRow = components.header.row;
  var HeaderCell = components.header.cell;
  var rowProps = onHeaderRow(row.map(function (cell) {
    return cell.column;
  }), index);
  var customStyle = rowProps ? rowProps.style : {};
  var style = (0, _extends3['default'])({ height: height }, customStyle);

  return _react2['default'].createElement(
    HeaderRow,
    (0, _extends3['default'])({}, rowProps, { style: style }),
    row.map(function (cell, i) {
      var column = cell.column,
          cellProps = (0, _objectWithoutProperties3['default'])(cell, ['column']);

      var customProps = column.onHeaderCell ? column.onHeaderCell(column) : {};
      if (column.align) {
        customProps.style = (0, _extends3['default'])({}, customProps.style, { textAlign: column.align });
        customProps.className = (0, _classnames2['default'])(customProps.className, column.className, (0, _defineProperty3['default'])({}, prefixCls + '-align-' + column.align, !!column.align));
      }
      return _react2['default'].createElement(HeaderCell, (0, _extends3['default'])({}, cellProps, customProps, { key: column.key || column.dataIndex || i }));
    })
  );
}

TableHeaderRow.propTypes = {
  row: _propTypes2['default'].array,
  index: _propTypes2['default'].number,
  height: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].number]),
  components: _propTypes2['default'].any,
  onHeaderRow: _propTypes2['default'].func
};

function getRowHeight(state, props) {
  var fixedColumnsHeadRowsHeight = state.fixedColumnsHeadRowsHeight;
  var columns = props.columns,
      rows = props.rows,
      fixed = props.fixed;

  var headerHeight = fixedColumnsHeadRowsHeight[0];

  if (!fixed) {
    return null;
  }

  if (headerHeight && columns) {
    if (headerHeight === 'auto') {
      return 'auto';
    }
    return headerHeight / rows.length;
  }
  return null;
}

exports['default'] = (0, _miniStore.connect)(function (state, props) {
  return {
    height: getRowHeight(state, props)
  };
})(TableHeaderRow);
module.exports = exports['default'];