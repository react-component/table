import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { measureScrollbar } from './utils';
import BaseTable from './BaseTable';

export default function HeadTable(props, { table }) {
  const { prefixCls, scroll, showHeader } = table.props;
  const { columns, fixed, tableClassName, handleBodyScrollLeft, expander } = props;
  const { saveRef } = table;
  let { useFixedHeader } = table.props;
  const headStyle = {};
  const scrollbarWidth = measureScrollbar({ direction: 'horizontal' });

  if (scroll.y) {
    useFixedHeader = true;
    // https://github.com/ant-design/ant-design/issues/17051
    const scrollbarWidthOfHeader = measureScrollbar({ direction: 'horizontal', prefixCls });
    // Add negative margin bottom for scroll bar overflow bug
    if (scrollbarWidthOfHeader > 0 && !fixed) {
      headStyle.marginBottom = `-${scrollbarWidthOfHeader}px`;
      headStyle.paddingBottom = '0px';
      // https://github.com/ant-design/ant-design/issues/17051
      headStyle.overflow = `scroll ${scrollbarWidth === 0 ? 'hidden' : 'scroll'}`;
    }
  }

  if (!useFixedHeader || !showHeader) {
    return null;
  }

  return (
    <div
      key="headTable"
      ref={fixed ? null : saveRef('headTable')}
      className={classNames(`${prefixCls}-header`, {
        [`${prefixCls}-hide-scrollbar`]: scrollbarWidth > 0,
      })}
      style={headStyle}
      onScroll={handleBodyScrollLeft}
    >
      <BaseTable
        tableClassName={tableClassName}
        hasHead
        hasBody={false}
        fixed={fixed}
        columns={columns}
        expander={expander}
      />
    </div>
  );
}

HeadTable.propTypes = {
  fixed: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  columns: PropTypes.array.isRequired,
  tableClassName: PropTypes.string.isRequired,
  handleBodyScrollLeft: PropTypes.func.isRequired,
  expander: PropTypes.object.isRequired,
};

HeadTable.contextTypes = {
  table: PropTypes.any,
};
