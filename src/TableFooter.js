import React from 'react';
import PropTypes from 'prop-types';

function getColumnFooter(col) {
  if (typeof col.footer === 'function') return col.footer;
  return () => col.footer;
}

export default function TableFooter(props, { table }) {
  const { columnManager, components } = table;
  const { prefixCls, data, expandIconAsCell } = table.props;
  const { fixed } = props;

  if (!columnManager.leafColumns().some(col => col.footer)) {
    return null;
  }

  const expandIconCol = {
    key: 'expand-icon-placeholder',
    render: () => null,
  };

  let leafColumns;
  if (fixed === 'left') {
    leafColumns = columnManager.leftLeafColumns();
    if (expandIconAsCell) {
      leafColumns = [expandIconCol, ...leafColumns];
    }
  } else if (fixed === 'right') {
    leafColumns = columnManager.rightLeafColumns();
  } else {
    leafColumns = columnManager.leafColumns();
    if (expandIconAsCell) {
      leafColumns = [expandIconCol, ...leafColumns];
    }
  }

  const FooterWrapper = components.footer.wrapper;
  const FooterRow = components.footer.row;
  const FooterCell = components.footer.cell;

  return (
    <FooterWrapper className={`${prefixCls}-tfoot`} key="footer">
      <FooterRow>
        {leafColumns.map(col =>
          <FooterCell
            key={col.key || col.dataIndex}
          >
            {col.footer ? getColumnFooter(col)(data) : null}
          </FooterCell>
        )}
      </FooterRow>
    </FooterWrapper>
  );
}

TableFooter.propTypes = {
  fixed: PropTypes.string,
  columns: PropTypes.array.isRequired,
};

TableFooter.contextTypes = {
  table: PropTypes.any,
};
