import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'mini-store';

function ColGroup(props, { table }) {
  const { prefixCls, expandIconAsCell } = table.props;
  const { fixed, headTable, firstRowCellsWidth } = props;

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
    leafColumns.map(c => {
      const columnKey = c.key || c.dataIndex;
      const width = headTable || fixed ? firstRowCellsWidth[columnKey] || c.width : c.width;
      return <col key={columnKey} style={{ width, minWidth: width }} />;
    }),
  );

  return <colgroup>{cols}</colgroup>;
}

ColGroup.propTypes = {
  fixed: PropTypes.string,
  firstRowCellsWidth: PropTypes.object,
  headTable: PropTypes.bool,
};

ColGroup.contextTypes = {
  table: PropTypes.any,
};

export default connect(state => ({
  firstRowCellsWidth: state.firstRowCellsWidth,
}))(ColGroup);
