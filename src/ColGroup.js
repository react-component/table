import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'mini-store';

function ColGroup(props, { table }) {
  const { prefixCls, expandIconAsCell } = table.props;
  const { fixed, firstRowCellsWidth } = props;

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
    leafColumns.map((c, index) => {
      const width = c.width || firstRowCellsWidth[index + cols.length];
      return <col key={c.key || c.dataIndex} style={{ width, minWidth: width }} />;
    }),
  );

  return <colgroup>{cols}</colgroup>;
}

ColGroup.propTypes = {
  fixed: PropTypes.string,
  firstRowCellsWidth: PropTypes.array,
};

ColGroup.contextTypes = {
  table: PropTypes.any,
};

export default connect(({ firstRowCellsWidth }) => ({
  firstRowCellsWidth,
}))(ColGroup);
