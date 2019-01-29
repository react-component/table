import React from 'react';
import PropTypes from 'prop-types';

export default function ColGroup(props, _ref) {
  var table = _ref.table;
  var _table$props = table.props,
      prefixCls = _table$props.prefixCls,
      expandIconAsCell = _table$props.expandIconAsCell;
  var fixed = props.fixed;


  var cols = [];

  if (expandIconAsCell && fixed !== 'right') {
    cols.push(React.createElement('col', { className: prefixCls + '-expand-icon-col', key: 'rc-table-expand-icon-col' }));
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
    return React.createElement('col', { key: c.key || c.dataIndex, style: { width: c.width, minWidth: c.width } });
  }));

  return React.createElement(
    'colgroup',
    null,
    cols
  );
}

ColGroup.propTypes = {
  fixed: PropTypes.string
};

ColGroup.contextTypes = {
  table: PropTypes.any
};