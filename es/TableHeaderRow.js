import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'mini-store';
import classNames from 'classnames';

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
  var style = _extends({ height: height }, customStyle);

  return React.createElement(
    HeaderRow,
    _extends({}, rowProps, { style: style }),
    row.map(function (cell, i) {
      var column = cell.column,
          cellProps = _objectWithoutProperties(cell, ['column']);

      var customProps = column.onHeaderCell ? column.onHeaderCell(column) : {};
      if (column.align) {
        customProps.style = _extends({}, customProps.style, { textAlign: column.align });
        customProps.className = classNames(customProps.className, column.className, _defineProperty({}, prefixCls + '-align-' + column.align, !!column.align));
      }
      return React.createElement(HeaderCell, _extends({}, cellProps, customProps, { key: column.key || column.dataIndex || i }));
    })
  );
}

TableHeaderRow.propTypes = {
  row: PropTypes.array,
  index: PropTypes.number,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  components: PropTypes.any,
  onHeaderRow: PropTypes.func
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

export default connect(function (state, props) {
  return {
    height: getRowHeight(state, props)
  };
})(TableHeaderRow);