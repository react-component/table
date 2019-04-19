import React from 'react';
import PropTypes from 'prop-types';
import { INTERNAL_COL_DEFINE } from './utils';

export default function ColGroup(props, { table }) {
  const { prefixCls, expandIconAsCell } = table.props;
  const { fixed } = props;

  let cols = [];

  if (expandIconAsCell && fixed !== 'right') {
    cols.push(<col className={`${prefixCls}-expand-icon-col`} key="rc-table-expand-icon-col" />);
  }

  let leafColumns;

  if (fixed === 'left') {
    leafColumns = table.columnManager.leftLeafColumns();
  } else if (fixed === 'right') {
    leafColumns = table.columnManager.rightLeafColumns();
  } else {
    leafColumns = table.columnManager.leafColumns();
  }
  cols = cols.concat(
    leafColumns.map(({ key, dataIndex, width, [INTERNAL_COL_DEFINE]: additionalProps }) => {
      return <col key={key || dataIndex} style={{ width, minWidth: width }} {...additionalProps} />;
    }),
  );

  return <colgroup>{cols}</colgroup>;
}

ColGroup.propTypes = {
  fixed: PropTypes.string,
};

ColGroup.contextTypes = {
  table: PropTypes.any,
};
