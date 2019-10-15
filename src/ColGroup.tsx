import React from 'react';
import PropTypes from 'prop-types';
import { INTERNAL_COL_DEFINE } from './utils';
import { FixedType, InternalColumn, Column } from './interface';

export interface ColGroupProps {
  fixed: FixedType;
  /** FIXME: Not used. Should confirm why this prop here */
  columns?: Column[];
}

const ColGroup: React.FC<ColGroupProps> = (props, { table }) => {
  const { prefixCls, expandIconAsCell } = table.props;
  const { fixed } = props;

  let cols: React.ReactElement[] = [];

  if (expandIconAsCell && fixed !== 'right') {
    cols.push(<col className={`${prefixCls}-expand-icon-col`} key="rc-table-expand-icon-col" />);
  }

  let leafColumns: InternalColumn[];

  if (fixed === 'left') {
    leafColumns = table.columnManager.leftLeafColumns();
  } else if (fixed === 'right') {
    leafColumns = table.columnManager.rightLeafColumns();
  } else {
    leafColumns = table.columnManager.leafColumns();
  }
  cols = cols.concat(
    leafColumns.map(({ key, dataIndex, width, [INTERNAL_COL_DEFINE]: additionalProps }) => {
      const mergedKey = key !== undefined ? key : dataIndex;
      return <col key={mergedKey} style={{ width, minWidth: width }} {...additionalProps} />;
    }),
  );

  return <colgroup>{cols}</colgroup>;
};

ColGroup.contextTypes = {
  table: PropTypes.any,
};

export default ColGroup;
