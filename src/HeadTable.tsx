import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import { measureScrollbar } from './utils';
import BaseTable from './BaseTable';
import { ColumnType, FixedType, Expander } from './interface';

export interface HeadTableProps {
  columns: ColumnType[];
  fixed?: FixedType;
  tableClassName: string;
  handleBodyScrollLeft: React.UIEventHandler<HTMLDivElement>;
  expander: Expander;
}

export default function HeadTable(props: HeadTableProps, { table }) {
  const { prefixCls, scroll, showHeader } = table.props;
  const { columns, fixed, tableClassName, handleBodyScrollLeft, expander } = props;
  const { saveRef } = table;
  let { useFixedHeader } = table.props;
  const headStyle: React.CSSProperties = {};
  const scrollbarWidth = measureScrollbar({ direction: 'vertical' });

  if (scroll.y) {
    useFixedHeader = true;
    // https://github.com/ant-design/ant-design/issues/17051
    const scrollbarWidthOfHeader = measureScrollbar({ direction: 'horizontal', prefixCls });
    // Add negative margin bottom for scroll bar overflow bug
    if (scrollbarWidthOfHeader > 0 && !fixed) {
      // headStyle.marginBottom = `-${scrollbarWidthOfHeader}px`;
      // headStyle.paddingBottom = '0px';
      // // https://github.com/ant-design/ant-design/pull/19986
      // headStyle.minWidth = `${scrollbarWidth}px`;
      // // https://github.com/ant-design/ant-design/issues/17051
      // headStyle.overflowX = 'auto';
      // headStyle.overflowY = scrollbarWidth === 0 ? 'hidden' : 'auto';
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

HeadTable.contextTypes = {
  table: PropTypes.any,
};
