import React from 'react';
import PropTypes from 'prop-types';
import { measureScrollbar } from './utils';
import BaseTable from './BaseTable';

export default function FootTable(props, { table }) {
  const { prefixCls, scroll } = table.props;
  const { columns, fixed, tableClassName, handleBodyScrollLeft, expander } = props;
  const { saveRef, columnManager } = table;
  let { useFixedHeader } = table.props;
  const footStyle = {};

  if (scroll.y) {
    useFixedHeader = true;
    // Add negative margin bottom for scroll bar overflow bug
    const scrollbarWidth = measureScrollbar('horizontal');
    if (scrollbarWidth > 0 && !fixed) {
      footStyle.marginBottom = `-${scrollbarWidth}px`;
      footStyle.paddingBottom = '0px';
    }
  }

  if (!useFixedHeader || !columnManager.hasFooter()) {
    return null;
  }

  return (
    <div
      key="footTable"
      ref={fixed ? null : saveRef('footTable')}
      className={`${prefixCls}-column-footer`}
      style={footStyle}
      onScroll={handleBodyScrollLeft}
    >
      <BaseTable
        tableClassName={tableClassName}
        hasHead={false}
        hasBody={false}
        hasFoot
        fixed={fixed}
        columns={columns}
        expander={expander}
      />
    </div>
  );
}

FootTable.propTypes = {
  fixed: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  columns: PropTypes.array.isRequired,
  tableClassName: PropTypes.string.isRequired,
  handleBodyScrollLeft: PropTypes.func.isRequired,
  expander: PropTypes.object.isRequired,
};

FootTable.contextTypes = {
  table: PropTypes.any,
};
