import React from 'react';
import PropTypes from 'prop-types';
import { measureScrollbar } from './utils';
import BaseTable from './BaseTable';

export default function HeadTable(props, { table }) {
  const { prefixCls, scroll, showHeader } = table.props;
  const { columns, fixed, tableClassName, handleBodyScrollLeft } = props;
  let { useFixedHeader } = table.props;
  const headStyle = {};

  if (scroll.y) {
    useFixedHeader = true;
    // Add negative margin bottom for scroll bar overflow bug
    const scrollbarWidth = measureScrollbar();
    if (scrollbarWidth > 0 && !fixed) {
      headStyle.marginBottom = `-${scrollbarWidth}px`;
      headStyle.paddingBottom = '0px';
    }
  }

  if (!useFixedHeader || !showHeader) {
    return null;
  }

  return (
    <div
      key="headTable"
      className={`${prefixCls}-header`}
      style={headStyle}
      onScroll={handleBodyScrollLeft}
    >
      <BaseTable
        tableClassName={tableClassName}
        hasHead
        hasBody={false}
        fixed={fixed}
        columns={columns}
      />
    </div>
  );
}

HeadTable.propTypes = {
  fixed: PropTypes.string,
  columns: PropTypes.array.isRequired,
  tableClassName: PropTypes.string.isRequired,
  handleBodyScrollLeft: PropTypes.func.isRequired,
};

HeadTable.contextTypes = {
  table: PropTypes.any,
};
